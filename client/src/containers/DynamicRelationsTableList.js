import React, { Component } from "react";

import { keyBy } from "lodash";
import update from "immutability-helper";
import styled from "styled-components";
import { Pagination as AntPagingation } from "antd";

import { FIELDS_BY_ENTITY } from "queries";

import { DynamicTableDetail, Query } from "containers";
import { Button, Loader, Table } from "components";

const BorderlessTable = styled(Table)`
  & .ant-table {
    border: none !important;
  }
`;

const Pagination = styled(AntPagingation)`
  padding: 20px 0 !important;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
`;

const TableDataLoading = ({ loading, children }) =>
  loading ? (
    <div
      style={{
        minHeight: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Loader />
    </div>
  ) : (
    children
  );

const getColumnData = field => ({
  width: 200,
  key: field.id,
  title: field.name,
  render: (value, index) => {
    const valueMap = keyBy(value.fields, "field.id");

    return (
      <DynamicTableDetail
        type={field.type}
        value={valueMap[field.id] && valueMap[field.id].value[field.type]}
      />
    );
  }
});

const clearRowColumn = onRemove => ({
  width: 40,
  key: "clearRow",
  title: "",
  render: (value, index) => {
    return (
      <div>
        <Button
          onClick={e => {
            e.stopPropagation();
            onRemove(value);
          }}
          size={"small"}
          shape={"circle"}
          icon={"close"}
        />
      </div>
    );
  }
});

class DynamicTableList extends Component {
  state = { page: 1, size: 10, fields: [], values: [], valueMap: {} };

  static getDerivedStateFromProps(
    { fields = [], values = [], loading = false },
    state
  ) {
    const updatedValueMap = keyBy(values, "id");

    return update(state, {
      loading: { $set: loading },
      fields: { $set: fields },
      valueMap: { $set: updatedValueMap },
      values: { $set: Object.values(updatedValueMap) }
    });
  }

  render() {
    const { fields, loading, page, size, values } = this.state;
    const { count, label, onSelect, onRemove, read } = this.props;

    return (
      <TableDataLoading loading={this.props.loading}>
        <BorderlessTable
          bordered={false}
          size={"small"}
          loading={loading}
          pagination={false}
          dataSource={values}
          rowKey={record => record.id}
          locale={{ emptyText: !this.props.loading && `No ${label}` }}
          onRow={r => ({ onClick: () => onSelect(r) })}
          columns={fields
            .map(getColumnData)
            .concat(read ? [] : clearRowColumn(onRemove))}
        />
        <Pagination
          total={count}
          current={page}
          pageSize={size}
          showSizeChanger
          showQuickJumper
          hideOnSinglePage
          pageSizeOptions={["10", "25", "50", "75"]}
          showTotal={(total, range = []) => (
            <div>
              Showing <b>{range.join(" - ")}</b> of <b>{total}</b>
            </div>
          )}
          onShowSizeChange={(current, next) => {
            this.setState(() => ({
              size: next,
              loading: current !== next ? true : false
            }));
          }}
          onChange={(p, s) => {
            this.setState(() => ({
              page: p,
              size: s,
              loading: p !== page || s !== size ? true : false
            }));
          }}
        />
      </TableDataLoading>
    );
  }
}

export default ({
  read,
  label,
  entity,
  onSelect,
  onRemove,
  data = [],
  count = 0,
  columnsQty = 3
}) => (
  <Query
    query={FIELDS_BY_ENTITY}
    variables={{ entity, read: true }}
    fetchPolicy={"network-only"}
  >
    {({ loading: fieldsLoading, data: { fieldsByEntity = [] } }) => {
      const fields = []
        .concat(fieldsByEntity)
        .sort((a, b) => a.order - b.order)
        .slice(0, columnsQty);

      return (
        <DynamicTableList
          read={read}
          label={label}
          values={data}
          fields={fields}
          count={count}
          onRemove={onRemove}
          onSelect={onSelect}
          loading={fieldsLoading}
        />
      );
    }}
  </Query>
);
