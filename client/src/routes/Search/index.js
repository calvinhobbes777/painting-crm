import React, { Component } from "react";

import { get } from "lodash";

import { Button as AntButton } from "antd";

import {
  USER_SEARCH,
  TASK_SEARCH,
  JOB_SEARCH,
  CUSTOMER_SEARCH,
  USER_COUNT,
  TASK_COUNT,
  JOB_COUNT,
  CUSTOMER_COUNT
} from "queries";
import {
  UserContext,
  DynamicSearchTableList,
  Query,
  RestrictedPage
} from "containers";

import { Icon, Form, FormItem, Input, Button, Tabs, TabPane } from "components";

import { ENTITIES } from "utilities";

import { userSchema } from "schema";

const searchCustomFields = {
  USER: userSchema.read.fields.read
};

const query = {
  USER: USER_SEARCH,
  TASK: TASK_SEARCH,
  JOB: JOB_SEARCH,
  CUSTOMER: CUSTOMER_SEARCH
};

const count = {
  USER: USER_COUNT,
  TASK: TASK_COUNT,
  JOB: JOB_COUNT,
  CUSTOMER: CUSTOMER_COUNT
};

export default class extends Component {
  delay = null;

  state = {
    value: "",
    search: ""
  };

  onChange = e => {
    e.persist();

    if (this.delay) {
      clearTimeout(this.delay);
    }

    const value = e.target.value;

    this.setState(() => ({ value }));

    this.delay = setTimeout(
      () => this.setState(() => ({ search: value })),
      1500
    );
  };

  onSubmit = () => {
    this.setState(state => ({ search: state.value }));
  };

  onReset = () => {
    clearTimeout(this.delay);
    
    this.setState(() => ({ value: "", search: "" }));
  };

  renderTab = entity => (
    <Query
      query={count[entity.value]}
      variables={{ value: this.state.search.trim() }}
    >
      {({ data, loading }) => {
        const dataCount = data[`${entity.value.toLowerCase()}Count`];
        return (
          <div>
            {loading ? (
              <Icon type="loading" />
            ) : (
              <span style={{ fontSize: 16, marginRight: 8 }}>
                <b>{dataCount}</b>
              </span>
            )}
            {entity.label}s
          </div>
        );
      }}
    </Query>
  );

  render() {
    const { history } = this.props;
    return (
      <UserContext.Consumer>
        {user =>
          ENTITIES.filter(entity =>
            get(user, `role.permissions.${entity.value.toLowerCase()}s.list`)
          ).length > 0 ? (
            <div>
              <Form>
                <FormItem ratio={1} min={"70%"}>
                  <Input
                    placeholder="Search"
                    value={this.state.value}
                    onChange={this.onChange}
                  />
                </FormItem>
                <FormItem ratio={1} min={"30%"}>
                  <AntButton.Group
                    style={{ display: "flex", paddingTop: 4, minWidth: 260 }}
                  >
                    <Button
                      ghost
                      type={"primary"}
                      icon={"search"}
                      htmlType={"submit"}
                      style={{ flex: 1 }}
                      onClick={this.onSubmit}
                    >
                      Search
                    </Button>
                    {this.state.search.trim().length > 0 && (
                      <Button
                        ghost
                        icon={"close"}
                        type={"primary"}
                        style={{ flex: 1 }}
                        onClick={this.onReset}
                      >
                        Reset
                      </Button>
                    )}
                  </AntButton.Group>
                </FormItem>
              </Form>
              <Tabs type={"card"}>
                {ENTITIES.filter(entity => {
                  return get(
                    user,
                    `role.permissions.${entity.value.toLowerCase()}s.list`
                  );
                }).map(entity => {
                  return (
                    <TabPane key={entity.value} tab={this.renderTab(entity)}>
                      <DynamicSearchTableList
                        label={`${entity.label}`}
                        entity={entity.value}
                        operation={query[entity.value]}
                        operationKey={`${entity.value.toLowerCase()}Search`}
                        countKey={`${entity.value.toLowerCase()}Count`}
                        customFields={searchCustomFields[entity.value]}
                        onSelect={r =>
                          history.push(
                            `/${entity.label.toLowerCase()}s/${r.id}`
                          )
                        }
                        query={{ value: this.state.search.trim() }}
                      />
                    </TabPane>
                  );
                })}
              </Tabs>
            </div>
          ) : (
            <RestrictedPage />
          )
        }
      </UserContext.Consumer>
    );
  }
}
