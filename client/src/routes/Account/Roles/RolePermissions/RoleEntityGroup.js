import React, { Component } from "react";

import { Table, PopConfirm, Button } from "components";
import { Card } from "antd";

import { UPDATE_FIELD } from "mutations";
import { Mutation } from "containers";

class PermissionsToggle extends Component {
  state = {
    checked: true
  };

  static getDerivedStateFromProps(nextProps) {
    const { value, role } = nextProps;

    if (value.find(r => r.type === role.type)) {
      return {
        checked: true
      };
    }

    return {
      checked: false
    };
  }

  toggleReadWrite = mutate => async () => {
    const { checked } = this.state;
    const { operation, field, role } = this.props;

    const variables = {
      id: field.id,
      read: field.read.map(({ type }) => type),
      write: field.write.map(({ type }) => type)
    };

    if (checked) {
      const next = field[operation]
        .map(({ type }) => type)
        .filter(type => type !== role.type);

      await mutate({ variables: { ...variables, [operation]: next } });

      this.setState(() => ({ checked: false }));
    } else {
      const current = field[operation].map(({ type }) => type);
      const next = [...current, role.type];

      await mutate({ variables: { ...variables, [operation]: next } });

      this.setState(() => ({ checked: true }));
    }
  };

  render() {
    const { checked } = this.state;
    const { role, operation, field } = this.props;
    return (
      <Mutation mutation={UPDATE_FIELD}>
        {mutate =>
          checked ? (
            <PopConfirm
              title={
                <div style={{ fontSize: 16 }}>
                  Disable {role.name} to{" "}
                  <b>
                    {operation.toUpperCase()} &rarr; {field.name}
                  </b>{" "}
                  field?
                </div>
              }
              onConfirm={this.toggleReadWrite(mutate)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon="check"
                shape={"circle"}
                style={{ color: "#52c41a" }}
              />
            </PopConfirm>
          ) : (
            <PopConfirm
              title={
                <div style={{ fontSize: 16 }}>
                  Enable {role.name} to{" "}
                  <b>
                    {operation.toUpperCase()} &rarr; {field.name}
                  </b>{" "}
                  field?
                </div>
              }
              onConfirm={this.toggleReadWrite(mutate)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon="close"
                shape={"circle"}
                style={{ color: "#f5222d" }}
              />
            </PopConfirm>
          )
        }
      </Mutation>
    );
  }
}

const columns = (role, dynamic) => [
  {
    key: "name",
    title: "Field",
    dataIndex: "name",
    render: value => <b>{value}</b>
  },
  {
    key: "read",
    title: "Read",
    dataIndex: "read",
    align: "center",
    render: (value, field) => (
      <PermissionsToggle
        value={value}
        role={role}
        field={field}
        operation="read"
      />
    )
  },
  {
    key: "write",
    title: "Write",
    dataIndex: "write",
    align: "center",
    render: (value, field) => (
      <PermissionsToggle
        value={value}
        role={role}
        field={field}
        operation="write"
      />
    )
  }
];

const RoleEntityGroup = ({ title, entity, role, fields, loading, dynamic }) => (
  <Card title={title} bordered={false}>
    <Table
      bordered
      rowKey={"id"}
      loading={loading}
      dataSource={fields}
      columns={columns(role, dynamic)}
      pagination={false}
      showHeader={fields && fields.length > 0}
      locale={{
        emptyText: dynamic ? `No Custom Fields` : `No Standard Fields`
      }}
    />
  </Card>
);

export default RoleEntityGroup;
