import React, { Component } from "react";
import styled from "styled-components";
import { Button, Card, Form, FormItem, TextArea } from "components";
import { Query, Mutation, UserContext } from "containers";
import { Collapse, List, Modal, Mention } from "antd";
import { CREATE_THREAD, CREATE_COMMENT } from "mutations";
import { USERNAMES } from "queries";
import Moment from "react-moment";
import { Link, withRouter } from "react-router-dom";

const { toString, toContentState } = Mention;
const DetailContainer = styled(Card)`
  flex: 1;
  margin: 5px !important;
  margin-right: 15px !important;
`;

const DetailContainerTitle = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const Panel = Collapse.Panel;

const panelStyle = {
  paddingLeft: 6,
  marginBottom: 6
};

const itemStyle = {
  paddingLeft: 24,
  marginBottom: 6
};

class DynamicThread extends Component {
  state = {
    date: new Date(),
    threads: [],
    newThreadValue: "",
    newThreadModal: false
  };

  static getDerivedStateFromProps(props, state) {
    const { match } = props;
    const { params } = match;
    const { thread, comment } = params;

    return {
      activeThread: thread,
      activeComment: comment,
      threads: props.threads || []
    };
  }

  openNewThreadDialog = () => {
    this.setState(() => ({ newThreadModal: true }));
  };

  closeNewThreadDialog = () => {
    this.setState(() => ({ newThreadModal: false, newThreadValue: "" }));
  };

  onNewThreadValueChange = e => {
    e.persist();
    this.setState(() => ({ newThreadValue: e.target.value }));
  };

  onSubmitNewThread = () => {
    const value = this.state.newThreadValue;

    alert(value);

    this.closeNewThreadDialog();
  };

  componentDidMount() {
    this.refreshInterval = setInterval(() => {
      this.props.refresh();
    }, 10000);

    setTimeout(() => {
      const activeComment = document.getElementById(this.state.activeComment);
      if (activeComment) {
        activeComment.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  render() {
    const { type, entity, refresh } = this.props;
    const { threads, newThreadValue, newThreadModal } = this.state;

    return (
      <UserContext>
        {user => (
          <DetailContainer
            key={"id"}
            title={
              <DetailContainerTitle>
                <div>Threads - {threads.length}</div>
              </DetailContainerTitle>
            }
            className={"item-detail"}
            extra={
              <Button
                icon={"plus"}
                shape={"circle"}
                onClick={this.openNewThreadDialog}
              />
            }
          >
            <CreateThreadForm
              type={type}
              author={user.id}
              entity={entity.id}
              value={newThreadValue}
              visible={newThreadModal}
              onSuccess={refresh}
              onClose={this.closeNewThreadDialog}
              onChange={this.onNewThreadValueChange}
            />
            <Collapse
              accordion
              bordered={false}
              defaultActiveKey={this.state.activeThread}
            >
              {threads.map(
                ({ id, title, comments, author, createdAt, updatedAt }) => (
                  <Panel
                    id={id}
                    key={id}
                    style={{
                      borderRadius: 3,
                      marginTop: 8,
                      border:
                        this.state.activeThread === id &&
                        "1px solid rgba(204, 239, 255, 1)"
                    }}
                    header={
                      <div
                        style={{
                          ...panelStyle,
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >
                        <div>{title}</div>
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            paddingLeft: 12,
                            paddingRight: 18
                          }}
                        >
                          <span style={{ color: "#898989" }}>
                            Posted by&nbsp;
                          </span>
                          <span style={{ color: "#1890ff" }}>
                            <Link to={`/users/${author.username}`}>
                              {author.username}
                            </Link>&nbsp;-&nbsp;
                          </span>
                          <span style={{ color: "#898989" }}>
                            <Moment fromNow interval={60000}>
                              {createdAt}
                            </Moment>
                          </span>
                        </div>
                      </div>
                    }
                  >
                    <List
                      locale={{ emptyText: "No messages for this thread." }}
                      dataSource={comments}
                      itemLayout={"horizontal"}
                      renderItem={comment => (
                        <List.Item
                          style={{
                            ...itemStyle,
                            borderRadius: 3,
                            border:
                              this.state.activeComment === comment.id &&
                              "1px solid rgba(230, 247, 255, 1)",
                            background:
                              this.state.activeComment === comment.id &&
                              "rgba(230, 247, 255, 0.5)"
                          }}
                          id={comment.id}
                        >
                          <List.Item.Meta
                            description={
                              <span style={{ color: "#303030" }}>
                                {comment.body}
                              </span>
                            }
                            title={
                              <div style={{ whiteSpace: "nowrap" }}>
                                <span style={{ color: "#898989" }}>
                                  Posted by&nbsp;
                                </span>
                                <span style={{ color: "#1890ff" }}>
                                  <Link
                                    to={`/users/${comment.author.username}`}
                                  >
                                    {comment.author.username}
                                  </Link>&nbsp;-&nbsp;
                                </span>
                                <span style={{ color: "#898989" }}>
                                  <Moment fromNow interval={10000}>
                                    {comment.createdAt}
                                  </Moment>
                                </span>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                    <CreateCommentForm
                      thread={id}
                      author={user.id}
                      onSuccess={refresh}
                    />
                  </Panel>
                )
              )}
            </Collapse>
          </DetailContainer>
        )}
      </UserContext>
    );
  }
}

const CreateThreadForm = ({
  type,
  entity,
  author,
  value,
  visible,
  onClose,
  onChange,
  onSuccess
}) => (
  <Mutation mutation={CREATE_THREAD}>
    {(mutate, { loading }) => (
      <Modal
        title="New Thread"
        visible={visible}
        onCancel={onClose}
        afterClose={onClose}
        onOk={async () => {
          await mutate({ variables: { type, entity, author, title: value } });
          onClose();
          onSuccess();
        }}
        confirmLoading={loading}
      >
        <TextArea
          value={value}
          placeholder={"New Thread Topic"}
          onChange={onChange}
          autosize={{
            minRows: 1,
            maxRows: 18
          }}
        />
      </Modal>
    )}
  </Mutation>
);

class CreateCommentForm extends Component {
  state = {
    body: ""
  };

  onSend = mutate => async () => {
    const { body } = this.state;
    const { author, thread } = this.props;

    await mutate({
      variables: {
        author,
        thread,
        body
      }
    });

    this.setState(state => {
      return { body: "", content: toContentState("") };
    });

    this.mention && this.mention.mentionEle.reset();

    this.props.onSuccess();
  };

  render() {
    const { body, content } = this.state;
    // console.log(this.mention && this.mention.mentionEle.reset())

    return (
      <Mutation mutation={CREATE_COMMENT}>
        {(mutate, { loading: saving }) => (
          <Query query={USERNAMES}>
            {({ loading, data: { users = [] } }) => (
              <Form>
                <FormItem ratio={1} min={"calc(100% - 120px)"}>
                  <Mention
                    value={content}
                    ref={ref => (this.mention = ref)}
                    loading={loading}
                    placeholder={"Message.."}
                    style={{ width: "100%" }}
                    suggestions={users.map(u => u.username)}
                    onChange={value =>
                      this.setState(() => ({
                        content: value,
                        body: toString(value)
                      }))
                    }
                  />
                </FormItem>
                <FormItem ratio={1} min={"120px"}>
                  <Button
                    ghost
                    loading={saving}
                    type={"primary"}
                    style={{ width: "100%" }}
                    onClick={this.onSend(mutate)}
                    disabled={body.length === 0}
                  >
                    Send
                  </Button>
                </FormItem>
              </Form>
            )}
          </Query>
        )}
      </Mutation>
    );
  }
}

export default withRouter(DynamicThread);

// 'string'.match(/(?:^|\W)@(\w+)(?!\w)/g)
