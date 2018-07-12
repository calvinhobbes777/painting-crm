import React, { Component } from "react";

import { Button, Form, FormItem, Input, Loader } from "components";

class NewRole extends Component {
  state = {
    name: undefined
  };

  onTextInputChange = (key, e) => {
    e.persist();
    this.setState(() => ({ [key]: e.target.value }));
  };

  onSubmit = () => {
    const { name } = this.state;
    const type = name.toUpperCase();

    this.props.onSubmit({ name, type });
  };

  render() {
    const { loading } = this.props;
    const { name } = this.state;

    return (
      <Loader spinning={loading}>
        <Form disabled={loading}>
          <FormItem label={"Name"} ratio={1} min={"100%"}>
            <Input
              value={name}
              placeholder={"Name"}
              onChange={e => this.onTextInputChange("name", e)}
            />
          </FormItem>
          <FormItem ratio={1} min={"100%"} horizontal={"flex-end"}>
            <Button type={"primary"} onClick={this.onSubmit}>
              Create Role
            </Button>
          </FormItem>
        </Form>
      </Loader>
    );
  }
}

export default NewRole;
