import React, { Component } from "react";
import { Query } from "containers";
import { Checkbox, Table } from "components";
import { ROLES } from "queries";

class NewFieldPermissions extends Component {
  state = {
    initialized: false
  };

  static getDerivedStateFromProps(props, state) {
    const { roles = [], onChange } = props;
    const { initialized = false } = state;

    if (!initialized && roles.length > 0) {
      setTimeout(() => roles.forEach(r => onChange(r.type, "read")));
      setTimeout(() => roles.forEach(r => onChange(r.type, "write")));

      return {
        initialized: true
      };
    }

    return {};
  }

  render() {
    const { roles, permissions, onChange } = this.props;

    let columns = [
      {
        align: "left",
        key: "operation",
        dataIndex: "operation",
        title: <span>Operation</span>,
        render: value => <b>{value}</b>
      }
    ];

    let data = [
      {
        operation: "Read"
      },
      {
        operation: "Write"
      }
    ];

    roles.map(({ name, type }) =>
      columns.push({
        key: type,
        title: name,
        dataIndex: type,
        render: (_, { operation }) => {
          const op = operation.toLowerCase();
          const checked = permissions[op] && permissions[op][type];
          let disabled = false;

          if (
            (!checked && op === "write" && !permissions.read[type]) ||
            type === "ADMINISTRATOR"
          ) {
            disabled = true;
          }

          return (
            <Checkbox
              onChange={e => onChange(type, op)}
              checked={checked}
              disabled={disabled}
            />
          );
        }
      })
    );

    return (
      <Table
        rowKey={"operation"}
        pagination={false}
        columns={columns}
        dataSource={data}
      />
    );
  }
}

export default props => (
  <Query query={ROLES}>
    {({ data }) => {
      const { roles = [] } = data;

      return <NewFieldPermissions {...props} roles={roles} />;
    }}
  </Query>
);
