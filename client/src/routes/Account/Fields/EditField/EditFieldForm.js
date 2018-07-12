import React, { Component } from "react";

import { Button, Form, FormItem, Icon, Input, Loader, Tag } from "components";
import { ENTITIES, INPUT_TYPES } from "utilities";

import styles from "./styles";
import EditFieldPermissions from "./EditFieldPermissions";

class EditField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      name: undefined,
      entity: undefined,
      type: undefined,
      selectValue: undefined,
      selectValues: [],
      selectValueInputVisible: false,
      permissions: {
        read: {},
        write: {}
      }
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { field = {} } = props;
    const { read, write } = field;

    if (
      !state.initialized &&
      (field.name !== state.name ||
        field.entity !== state.entity ||
        field.type !== state.type ||
        field.values !== state.values ||
        read !== state.read ||
        write !== state.write)
    ) {
      return {
        initialized: true,
        name: field.name,
        entity: field.entity,
        type: field.type,
        selectValues: field.values,
        permissions: {
          read: read.reduce(
            (_read, { type }) => !(_read[type] = true) || _read,
            {}
          ),
          write: write.reduce(
            (_write, { type }) => !(_write[type] = true) || _write,
            {}
          )
        }
      };
    }

    return null;
  }

  handleClose = removed =>
    this.setState(state => ({
      selectValues: state.selectValues.filter(tag => tag !== removed)
    }));

  showSelectInput = () => {
    this.setState(() => ({ selectValueInputVisible: true }));
  };

  onSelectInputChange = (key, value) => {
    this.setState(() => ({ [key]: value }));
  };

  onTextInputChange = (key, e) => {
    e.persist();
    this.setState(() => ({ [key]: e.target.value }));
  };

  onSelectValueChange = e => {
    this.setState({ selectValue: e.target.value });
  };

  onAddSelectValue = () => {
    let { selectValue, selectValues } = this.state;

    if (selectValue && selectValues.indexOf(selectValue) === -1) {
      selectValues = [...selectValues, selectValue];
    }

    this.setState({
      selectValues,
      selectValueInputVisible: false,
      selectValue: ""
    });
  };

  onPermissionChange = (type, operation) => {
    let overrideWriteOp = false;

    if (operation === "read") {
      if (this.state.permissions.read[type]) {
        overrideWriteOp = true;
      }
    } else {
      if (
        !this.state.permissions.write[type] &&
        !this.state.permissions.read[type]
      ) {
        return;
      }
    }

    this.setState(state => ({
      permissions: {
        ...state.permissions,
        write: {
          ...state.permissions.write,
          [type]: overrideWriteOp ? false : state.permissions.write[type]
        },
        [operation]: {
          ...state.permissions[operation],
          [type]: !state.permissions[operation][type]
        }
      }
    }));
  };

  onSubmit = () => {
    const {
      field: { id }
    } = this.props;
    const { name, selectValues, permissions } = this.state;

    let { read, write } = permissions;

    read = Object.keys(read)
      .map(key => read[key] && key)
      .filter(val => val);

    write = Object.keys(write)
      .map(key => write[key] && key)
      .filter(val => val);

    this.props.onSubmit({ id, name, read, write, values: selectValues });
  };

  render() {
    const { field, loading, saving } = this.props;

    const {
      name,
      entity,
      type,
      selectValues,
      selectValueInputVisible,
      selectValue,
      permissions
    } = this.state;

    const hasValues = type === "SELECT";

    const entityValue = ENTITIES.find(e => e.value === entity);
    const typeValue = INPUT_TYPES.find(i => i.value === type);

    return (
      <Loader spinning={loading || saving}>
        <Form disabled={saving}>
          <FormItem label={"Name"} ratio={2} min={"50%"}>
            {field && !field.static ? (
              <Input
                value={name}
                placeholder={"Name"}
                onChange={e => this.onTextInputChange("name", e)}
              />
            ) : (
              <b>{name}</b>
            )}
          </FormItem>
          <FormItem label={"Entity"} ratio={1} min={"25%"}>
            <b>{entityValue && entityValue.label}</b>
          </FormItem>
          <FormItem label={"Type"} ratio={1} min={"25%"}>
            <b>{typeValue && typeValue.label}</b>
          </FormItem>
          {hasValues && (
            <FormItem label={"Dropdown Options"} ratio={1} min={"50%"}>
              {selectValues.map((tag, index) => (
                <Tag
                  large="true"
                  key={tag}
                  closable={field && !field.static}
                  afterClose={() => this.handleClose(tag)}
                >
                  {tag}
                </Tag>
              ))}
              {selectValueInputVisible ? (
                <Input
                  autoFocus
                  value={selectValue}
                  onBlur={this.onAddSelectValue}
                  onPressEnter={this.onAddSelectValue}
                  onChange={this.onSelectValueChange}
                />
              ) : (
                field &&
                !field.static && (
                  <Tag
                    large="true"
                    onClick={this.showSelectInput}
                    style={styles.addSelectValueButton}
                  >
                    <Icon type={"plus"} /> New Value
                  </Tag>
                )
              )}
            </FormItem>
          )}
          <FormItem label={"Permissions"} ratio={1} min={"100%"}>
            <EditFieldPermissions
              permissions={permissions}
              onChange={this.onPermissionChange}
            />
          </FormItem>
          <FormItem ratio={1} min={"100%"} horizontal={"flex-end"}>
            <Button type={"primary"} onClick={this.onSubmit}>
              Update Field
            </Button>
          </FormItem>
        </Form>
      </Loader>
    );
  }
}

export default EditField;
