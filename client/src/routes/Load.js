import React, { Component } from "react";
import { ApolloConsumer } from "react-apollo";
import styled from "styled-components";

import { ME } from "queries";
import { _resolve } from "utilities";
import { UserContext } from "containers";
import { Loader } from "components";

const AppLoader = styled.div`
  position: absolute;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s linear;
  opacity: ${({ loading }) => (loading ? 1 : 0)};
`;

const AppContent = styled.div`
  transition: all 0.5s linear;
  opacity: ${({ loading }) => (loading ? 0 : 1)};
`;

class AppContainer extends Component {
  state = {
    user: {},
    loader: true,
    loading: true
  };

  async componentDidMount() {
    const token = localStorage.getItem("token");

    if (token) {
      const { result } = await _resolve(this.props.user());
      const user = result.data.me;

      if (!user) {
        localStorage.removeItem("token");

        return window.location.reload();
      }

      this.setState(() => ({ user }));
    }

    await new Promise(resolve =>
      setTimeout(() => {
        this.setState(() => ({ loading: false }));
        resolve();
      }, 1000)
    );

    await new Promise(resolve =>
      setTimeout(() => {
        this.setState(() => ({ loader: false }));
        resolve();
      }, 1000)
    );
  }

  render() {
    const { loading, loader, user } = this.state;
    const { children } = this.props;

    let content = [
      <UserContext.Provider value={user} key={"content"}>
        <AppContent loading={loading}>{children}</AppContent>
      </UserContext.Provider>
    ];

    if (loader) {
      content.unshift(
        <AppLoader loading={loading} key={"loader"}>
          <Loader size={"large"} />
        </AppLoader>
      );
    }

    return content;
  }
}

export default props => (
  <ApolloConsumer>
    {client => (
      <AppContainer user={() => client.query({ query: ME })} {...props} />
    )}
  </ApolloConsumer>
);
