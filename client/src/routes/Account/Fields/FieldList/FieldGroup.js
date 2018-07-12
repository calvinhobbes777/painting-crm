import React from "react";

import { Card } from "antd";
import { Link } from "react-router-dom";

import { Table } from "components";
import { INPUT_TYPE_MAP } from "utilities";

const columns = [
  {
    key: "name",
    title: "Field",
    dataIndex: "name",
    render: value => <b>{value}</b>
  },
  {
    key: "type",
    title: "Type",
    width: 200,
    dataIndex: "type",
    render: value => INPUT_TYPE_MAP[value].label
  },
  {
    key: "action",
    title: "Actions",
    fixed: "right",
    align: "center",
    width: 120,
    render: (_, record) => (
      <span>
        <Link to={`/account/fields/${record.id}/edit`}>Edit</Link>
      </span>
    )
  }
];

const FieldGroup = ({ title, entity, fields, loading, dynamic }) => (
  <Card title={title} bordered={false}>
    <Table
      bordered
      rowKey={"id"}
      loading={loading}
      columns={columns}
      dataSource={fields}
      pagination={false}
      showHeader={fields && fields.length > 0}
      locale={{
        emptyText: dynamic ? `No Custom Fields` : `No Standard Fields`
      }}
    />
  </Card>
);

export default FieldGroup;
