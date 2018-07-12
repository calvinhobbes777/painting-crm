import React, { Component } from "react";

import {
  Button,
  Form,
  FormItem,
  Icon,
  Input,
  Loader,
  Select,
  SelectOption,
  Tag
} from "components";
import { ENTITIES, INPUT_TYPES } from "utilities";

import styles from "./styles";
import NewFieldPermissions from "./NewFieldPermissions";

class NewField extends Component {
  state = {
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
    const { name, entity, type, selectValues, permissions } = this.state;

    let { read, write } = permissions;

    read = Object.keys(read)
      .map(key => read[key] && key)
      .filter(val => val);

    write = Object.keys(write)
      .map(key => write[key] && key)
      .filter(val => val);

    this.props.onSubmit({
      name,
      entity,
      type,
      read,
      write,
      values: selectValues
    });
  };

  render() {
    const { loading } = this.props;
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

    return (
      <Loader spinning={loading}>
        <Form disabled={loading}>
          <FormItem label={"Name"} ratio={1} min={"50%"}>
            <Input
              value={name}
              placeholder={"Name"}
              onChange={e => this.onTextInputChange("name", e)}
            />
          </FormItem>
          <FormItem label={"Entity"} ratio={1} min={"50%"}>
            <Select
              value={entity}
              placeholder={"Entity"}
              onChange={value => this.onSelectInputChange("entity", value)}
            >
              {ENTITIES.map(e => (
                <SelectOption key={e.value} value={e.value}>
                  {e.label}
                </SelectOption>
              ))}
            </Select>
          </FormItem>
          <FormItem label={"Type"} ratio={1} min={"50%"}>
            <Select
              value={type}
              placeholder={"Type"}
              onChange={value => this.onSelectInputChange("type", value)}
            >
              {INPUT_TYPES.map(i => (
                <SelectOption key={i.value} value={i.value}>
                  {i.label}
                </SelectOption>
              ))}
            </Select>
          </FormItem>
          {hasValues && (
            <FormItem label={"Dropdown Options"} ratio={1} min={"50%"}>
              {selectValues.map((tag, index) => (
                <Tag
                  large="true"
                  key={tag}
                  closable
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
                <Tag
                  large="true"
                  onClick={this.showSelectInput}
                  style={styles.addSelectValueButton}
                >
                  <Icon type={"plus"} /> New Value
                </Tag>
              )}
            </FormItem>
          )}
          <FormItem label={"Permissions"} ratio={1} min={"100%"}>
            <NewFieldPermissions
              permissions={permissions}
              onChange={this.onPermissionChange}
            />
          </FormItem>
          <FormItem ratio={1} min={"100%"} horizontal={"flex-end"}>
            <Button type={"primary"} onClick={this.onSubmit}>
              Create Field
            </Button>
          </FormItem>
        </Form>
      </Loader>
    );
  }
}

export default NewField;
