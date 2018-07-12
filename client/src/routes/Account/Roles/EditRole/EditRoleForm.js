import React, { Component } from "react";

import {
  Button,
  Form,
  FormItem,
  Input,
  Divider,
  Loader,
  Tabs,
  TabPane,
  Card
} from "components";

const startUpperCase = value =>
  `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;

class UpdateRole extends Component {
  state = {
    name: undefined,
    permissions: {}
  };

  static getDerivedStateFromProps(props, state) {
    const { role = {} } = props;

    if (!state.initialized && role.name !== state.name) {
      return {
        name: role.name,
        permissions: role.permissions
      };
    }

    return null;
  }

  onTextInputChange = (key, e) => {
    e.persist();
    this.setState(() => ({ [key]: e.target.value }));
  };

  onToggle = (entity, key, value) => {
    console.log(entity, key, value);
    this.setState(state => ({
      permissions: {
        ...state.permissions,
        [entity]: {
          ...state.permissions[entity],
          [key]: value
        }
      }
    }));
  };

  onSubmit = () => {
    const { name, permissions } = this.state;
    const type = name.toUpperCase();

    this.props.onSubmit({ name, type, permissions });
  };

  render() {
    const { loading, role } = this.props;
    const { name, permissions } = this.state;

    return (
      <Loader spinning={loading}>
        <Form disabled={loading}>
          <FormItem label={"Name"} ratio={1} min={"100%"}>
            <Input
              value={name}
              placeholder={"Name"}
              onChange={e => this.onTextInputChange("name", e)}
              disabled={role && role.type === "ADMINISTRATOR"}
            />
          </FormItem>
          {role && role.type === "ADMINISTRATOR" ? null : (
            <FormItem label={"View Permissions"} ratio={1} min={"100%"}>
              <Divider style={{ marginBottom: 16, marginTop: 8 }} />
              <Tabs tabPosition={"left"}>
                {Object.keys(permissions).map(entity => (
                  <TabPane key={entity} tab={startUpperCase(entity)}>
                    <Card
                      title={`${startUpperCase(entity)} Permissions`}
                      bordered={false}
                    >
                      {Object.keys(permissions[entity]).map(key => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            paddingBottom: 12
                          }}
                        >
                          <div style={{ minWidth: 140 }}>
                            <b>{startUpperCase(key)} View(s)</b>
                          </div>
                          <div style={{ flex: 1 }}>
                            {permissions[entity][key] ? (
                              <Button
                                icon="check"
                                style={{ color: "#52c41a" }}
                                onClick={() =>
                                  this.onToggle(
                                    entity,
                                    key,
                                    !permissions[entity][key]
                                  )
                                }
                              >
                                Enabled
                              </Button>
                            ) : (
                              <Button
                                icon="close"
                                style={{ color: "#f5222d" }}
                                onClick={() =>
                                  this.onToggle(
                                    entity,
                                    key,
                                    !permissions[entity][key]
                                  )
                                }
                              >
                                Disabled
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </Card>
                  </TabPane>
                ))}
              </Tabs>
            </FormItem>
          )}
          <Divider />
          <FormItem ratio={1} min={"100%"} horizontal={"flex-end"}>
            <Button type={"primary"} onClick={this.onSubmit}>
              Update Role
            </Button>
          </FormItem>
        </Form>
      </Loader>
    );
  }
}

export default UpdateRole;
