import React, { Component } from "react";

import styled from "styled-components";

import { withRouter } from "react-router-dom";

import { Modal } from "antd";

import { Mutation } from "containers";
import { Button, Card, Form, FormItem, Input } from "components";

import { RESET_PASSWORD } from "mutations";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 320px;
`;

class ResetPassword extends Component {
  state = {
    password: "",
    confirmation: ""
  };

  onChange = field => e => {
    e.persist();

    this.setState(() => ({
      [field]: e.target.value
    }));
  };

  onSubmit = () => {
    Modal.confirm({
      title: "Reset password",
      content: (
        <div>
          Resetting your account password will automatically log you out of your
          current session, and require you to login in with your new password.
          <br />
          <br />
          Are you sure you want to continue?
        </div>
      ),
      okType: "danger",
      okText: "Proceed",
      onCancel: () => null,
      onOk: async () => {
        const {
          data: { resetPassword }
        } = await this.props.submit({ password: this.state.password });

        if (!this.props.administrator && resetPassword) {
          setTimeout(() => {
            !localStorage.removeItem("token") && window.location.reload();
          }, 2000);

          Modal.success({
            title: "Password Reset!",
            content: "We've reset your password! You will now be logged out."
          });
        } else if (this.props.administrator && resetPassword) {
          setTimeout(() => {
            this.props.back();
          }, 2000);

          Modal.success({
            title: "Password Reset!",
            content: "We've reset the account password!"
          });
        } else {
          Modal.error({
            title: "Error",
            content:
              "We encountered an issue resetting the password. Please try again."
          });
        }
      }
    });
  };

  render() {
    const { password, confirmation } = this.state;

    return (
      <Container>
        <Content>
          <Card title={"Reset Account Password"}>
            <Form disabled={false}>
              <FormItem min={"100%"} label={"New Password"}>
                <Input
                  type={"password"}
                  placeholder={"New Password"}
                  onChange={this.onChange("password")}
                />
              </FormItem>
              <FormItem min={"100%"} label={"Confirm Password"}>
                <Input
                  type={"password"}
                  placeholder={"Password Confirmation"}
                  onChange={this.onChange("confirmation")}
                />
              </FormItem>
              <FormItem min={"100%"}>
                <Button
                  ghost
                  type={"primary"}
                  style={{ width: "100%" }}
                  onClick={this.onSubmit}
                  icon={password !== confirmation ? "lock" : "check"}
                  disabled={password.length === 0 || password !== confirmation}
                >
                  Reset Password
                </Button>
              </FormItem>
            </Form>
          </Card>
        </Content>
      </Container>
    );
  }
}

export default withRouter(props => (
  <Mutation mutation={RESET_PASSWORD}>
    {(mutate, { data, loading }) => {
      const { match, history } = props;
      const { params } = match;
      const { id } = params;
      return (
        <ResetPassword
          back={history.goBack}
          administrator={!!id}
          submit={(variables = {}) =>
            mutate({
              variables: {
                ...variables,
                username: id,
                id: id
              }
            })
          }
        />
      );
    }}
  </Mutation>
));
