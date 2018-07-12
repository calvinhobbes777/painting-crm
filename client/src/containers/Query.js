import React, { Component } from "react";
import { Query as ApolloQuery } from "react-apollo";

import { withRouter } from "react-router-dom";

import { QueryError } from "components";

class Query extends Component {
  constructor() {
    super();

    this.state = {
      error: false,
      errorInfo: ""
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
    const { result, history, onErrorRender, onRender } = this.props;

    if (error && onErrorRender) {
      return onErrorRender(history, result.error);
    }

    if (error) {
      return <QueryError history={history} />;
    }

    return onRender(result);
  }
}

export default withRouter(
  ({ children, onErrorRender, history, ...options }) => (
    <ApolloQuery {...options}>
      {result => (
        <Query
          result={result}
          history={history}
          onRender={children}
          onErrorRender={onErrorRender}
        />
      )}
    </ApolloQuery>
  )
);
