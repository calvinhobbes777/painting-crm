import React, { Component } from "react";
import { Mutation as ApolloMutation } from "react-apollo";

import { message } from "antd";
import { withRouter } from "react-router-dom";

class Mutation extends Component {
  constructor() {
    super();

    this.state = {
      error: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { result = {} } = props;

    return {
      error: !!result.error
    };
  }

  render() {
    const { error } = this.state;
    const { onErrorRender, onRender, result, mutation, history } = this.props;

    if (error && onErrorRender) {
      return onErrorRender(history, result.error);
    }

    return onRender(mutation, result);
  }
}

export default withRouter(
  ({ children, history, onErrorRender, ...options }) => (
    <ApolloMutation
      onError={history => {
        message.destroy();
        message.error("An error occurred. Please try again.");
      }}
      {...options}
    >
      {(mutation, result) => (
        <Mutation
          history={history}
          result={result}
          mutation={mutation}
          onRender={children}
          onErrorRender={onErrorRender}
        />
      )}
    </ApolloMutation>
  )
);
