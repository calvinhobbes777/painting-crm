import React, { Component } from "react";

import { Button, Card, Icon, Input, Form, notification } from "antd";

import styled from "styled-components";

import { Mutation } from "containers";
import { LOGIN_USER } from "mutations";

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.success ? 0 : 1)};
  transition: opacity 0.5s linear;
`;

const LoginCard = styled(Card)`
  width: 300px;
  border: 1px solid #efefef;
`;

const LoginInputIcon = styled(Icon)`
  color: rgba(0, 0, 0, 0.25);
`;

const LoginSubmitButton = styled(Button)`
  width: 100%;
`;

class Login extends Component {
  state = {
    username: "",
    password: "",
    success: false,
    loading: false
  };

  static getDerivedStateFromProps({ loading, error, data = {} }, state) {
    const { authenticateUser = {} } = data;
    const { token } = authenticateUser;

    if (!!token) {
      localStorage.setItem("token", token);

      setTimeout(() => {
        window.location.reload();
      }, 200);

      return { loading: false, success: true, username: "", password: "" };
    }

    if (!!error) {
      notification.error({
        message: "Invalid Credentials",
        description:
          "The username and password combination entered was invalid. Please try again."
      });
    }

    return {
      loading
    };
  }

  onSubmit = async e => {
    e.preventDefault();

    const { username, password } = this.state;

    this.props.mutate({ variables: { username, password } });
  };

  onChange = e => {
    e.persist();

    this.setState(() => ({
      [e.target.name]: e.target.value
    }));
  };

  render() {
    const { username, password, loading, success } = this.state;

    return (
      <LoginContainer success={success}>
        <LoginCard title={"Login"}>
          <Form onSubmit={this.onSubmit}>
            <Form.Item>
              <Input
                type={"username"}
                name={"username"}
                value={username}
                placeholder="Username"
                prefix={<LoginInputIcon type={"user"} />}
                onChange={this.onChange}
              />
            </Form.Item>
            <Form.Item>
              <Input
                type={"password"}
                name={"password"}
                value={password}
                placeholder={"Password"}
                prefix={<LoginInputIcon type={"lock"} />}
                onChange={this.onChange}
              />
            </Form.Item>
            <Form.Item>
              <LoginSubmitButton
                type={"primary"}
                htmlType={"submit"}
                loading={loading}
                disabled={loading}
              >
                {success ? "Authenticated!" : !loading && "Login"}
              </LoginSubmitButton>
            </Form.Item>
          </Form>
        </LoginCard>
      </LoginContainer>
    );
  }
}

export default props => (
  <Mutation mutation={LOGIN_USER}>
    {(mutation, result) => <Login mutate={mutation} {...result} />}
  </Mutation>
);
