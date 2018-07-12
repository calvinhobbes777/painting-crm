import React, { Component } from "react";

import styled from "styled-components";

import Moment from "react-moment";

import { Divider } from "components";
import { Query, Mutation, UserContext } from "containers";
import { Subscription } from "react-apollo";
import gql from "graphql-tag";

import { List, Icon, Button, Pagination } from "antd";

const iconName = type => {
  switch (type) {
    case "USER":
      return "user";
    case "JOB":
      return "schedule";
    case "TASK":
      return "solution";
    case "CUSTOMER":
      return "shop";
    default:
      return "";
  }
};

const typeLabel = type => {
  switch (type) {
    case "USER":
      return "User";
    case "JOB":
      return "Job";
    case "TASK":
      return "Task";
    case "CUSTOMER":
      return "Customer";
    default:
      return "";
  }
};

const NotificationSubscription = gql`
  subscription notification($where: NotificationSubscriptionWhereInput!) {
    notification(where: $where) {
      node {
        id
        link
        read
        title
        body
        type
        entity
        createdAt
        updatedAt
      }
    }
  }
`;

const NotificationQuery = gql`
  query notification($page: Int, $size: Int, $where: NotificationWhereInput!) {
    notifications(page: $page, size: $size, where: $where) {
      id
      link
      read
      title
      body
      type
      entity
      createdAt
      updatedAt
    }
  }
`;

const NotificationCount = gql`
  query notificationCount($id: ID, $username: String) {
    notificationCount(id: $id, username: $username)
  }
`;

const NotificationMarkAsReadMutation = gql`
  mutation updateNotification($id: ID!, $read: Boolean) {
    updateNotification(id: $id, read: $read) {
      id
      read
    }
  }
`;

const NotificationsMarkAllAsRead = gql`
  mutation {
    markAllNotificationsAsRead {
      count
    }
  }
`;

const Container = styled.div`
  background-color: rgba(87, 174, 255, 0);
  transition: all 0.15s ease-in-out;
  &:hover {
    cursor: pointer;
    background-color: rgba(87, 174, 255, 0.1);
    transition: all 0.15s ease-in-out;
  }
`;

class NotificationsList extends Component {
  state = {
    notifications: [],
    initialized: false
  };

  render() {
    const { data: notifications = [], loading } = this.props;

    return (
      <List
        locale={{ emptyText: "You don't have any notifications yet." }}
        loading={loading}
        itemLayout={"horizontal"}
        dataSource={notifications}
        renderItem={n => [
          <Container>
            <List.Item
              actions={[
                <Mutation mutation={NotificationMarkAsReadMutation}>
                  {(
                    mutate,
                    { data: { updateNotification: notif = {} } = {}, loading }
                  ) => (
                    <MarkReadToggle
                      id={n.id}
                      default={n.read}
                      value={notif.read}
                      onToggle={mutate}
                    />
                  )}
                </Mutation>,
                <Mutation
                  mutation={NotificationMarkAsReadMutation}
                  onCompleted={() => {
                    this.props.history.push(n.link);
                  }}
                >
                  {(
                    mutate,
                    { data: { updateNotification: notif = {} } = {}, loading }
                  ) => (
                    <MarkReadToggle
                      id={n.id}
                      default={n.read}
                      value={notif.read}
                      onToggle={mutate}
                      label={"View"}
                      icon={"eye-o"}
                    />
                  )}
                </Mutation>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Icon
                    type={iconName(n.type)}
                    style={{
                      margin: 4,
                      fontSize: 20
                    }}
                  />
                }
                title={
                  <span>
                    {typeLabel(n.type)} - {n.title} -{" "}
                    <Moment fromNow interval={10000}>
                      {n.createdAt}
                    </Moment>
                  </span>
                }
                description={n.body}
              />
            </List.Item>
          </Container>,
          <Divider style={{ margin: 0 }} />
        ]}
      />
    );
  }
}

class Notifications extends Component {
  state = { page: 1, size: 10 };

  render() {
    const { page, size } = this.state;

    return (
      <UserContext.Consumer>
        {({ id }) =>
          id && (
            <Query query={NotificationCount} variables={{ id }}>
              {({
                data: { notificationCount = 0 },
                loading,
                refetch: refetchCount
              }) => (
                <Query
                  query={NotificationQuery}
                  variables={{ page: 1, size: 10, where: { user: { id } } }}
                >
                  {({ data, loading, refetch, fetchMore } = {}) => (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          position: "relative"
                        }}
                      >
                        <Mutation
                          mutation={NotificationsMarkAllAsRead}
                          onCompleted={() => refetch()}
                        >
                          {mutate => (
                            <Button
                              icon={"bars"}
                              type={"dashed"}
                              style={{
                                bottom: 36,
                                position: "absolute",
                                zIndex: 100000
                              }}
                              onClick={mutate}
                            >
                              Mark All Read
                            </Button>
                          )}
                        </Mutation>
                      </div>
                      <Subscription
                        subscription={NotificationSubscription}
                        variables={{
                          where: {
                            mutation_in: ["CREATED"],
                            node: { user: { id } }
                          }
                        }}
                      >
                        {props => (
                          <NotificationRefresh
                            {...props}
                            onRefresh={() => {
                              refetch();
                              refetchCount();
                            }}
                          />
                        )}
                      </Subscription>
                      <NotificationsList
                        {...this.props}
                        loading={loading}
                        data={data.notifications}
                      />

                      <Pagination
                        style={{ display: "flex", marginTop: 24 }}
                        total={notificationCount}
                        current={page}
                        pageSize={size}
                        showSizeChanger
                        showQuickJumper
                        hideOnSinglePage
                        pageSizeOptions={["10", "25", "50", "75"]}
                        showTotal={(total, range = []) => (
                          <div>
                            Showing <b>{range.join(" - ")}</b> of <b>{total}</b>
                          </div>
                        )}
                        onShowSizeChange={(current, next) => {
                          this.setState(() => ({
                            page: 1,
                            size: next,
                            loading: current !== next ? true : false
                          }));

                          fetchMore({
                            variables: { page: 1, size: next },
                            updateQuery: (
                              _,
                              { fetchMoreResult: { notifications: next = [] } }
                            ) => {
                              return {
                                notifications: next
                              };
                            }
                          });
                        }}
                        onChange={(p, s) => {
                          this.setState(() => ({
                            page: p,
                            size: s,
                            loading: p !== page || s !== size ? true : false
                          }));

                          fetchMore({
                            variables: { page: p, size: s },
                            updateQuery: (
                              _,
                              { fetchMoreResult: { notifications: next = [] } }
                            ) => {
                              return {
                                notifications: next
                              };
                            }
                          });
                        }}
                      />
                    </div>
                  )}
                </Query>
              )}
            </Query>
          )
        }
      </UserContext.Consumer>
    );
  }
}

class MarkReadToggle extends Component {
  state = {
    read: undefined,
    initialized: false
  };

  render() {
    const {
      id,
      label,
      icon,
      onToggle,
      read,
      default: defaultValue
    } = this.props;
    return (
      <Button
        ghost={label || read || defaultValue}
        type="primary"
        icon={
          icon
            ? icon
            : read || defaultValue
              ? "close-circle-o"
              : "check-circle-o"
        }
        onClick={() =>
          onToggle({ variables: { id, read: read ? !read : !defaultValue } })
        }
      >
        {label ? label : read ? "Mark as unread" : "Mark as read"}
      </Button>
    );
  }
}

class NotificationRefresh extends Component {
  state = {
    available: false
  };

  static getDerivedStateFromProps(props, state) {
    const { notifications = {} } = state;
    const { data = {} } = props;
    const { notification = {} } = data;
    const { node = {} } = notification;
    const { id } = node;

    if (!id || notifications[id]) return {};

    return {
      notifications: {
        ...notifications,
        [id]: true
      },
      available: true
    };
  }

  refresh = () => {
    this.setState(() => ({ available: false }));
    this.props.onRefresh && this.props.onRefresh();
  };

  render() {
    const { available } = this.state;

    return (
      available && (
        <Divider>
          <Button icon={"reload"} ghost type={"primary"} onClick={this.refresh}>
            New Notifications
          </Button>
        </Divider>
      )
    );
  }
}

export default Notifications;
