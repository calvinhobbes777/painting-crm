import React, { Component } from "react";

import { keyBy, get } from "lodash";
import update from "immutability-helper";
import styled from "styled-components";
import { Pagination as AntPagingation } from "antd";

import { FIELDS_BY_ENTITY } from "queries";

import { DynamicTableDetail, Query } from "containers";
import { Loader, Table } from "components";

const Pagination = styled(AntPagingation)`
  padding: 20px 0 !important;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
`;

const TableDataLoading = ({ loading, children }) =>
  loading ? (
    <Loader>
      <div style={{ width: "100%", height: 180 }} />
    </Loader>
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

const getCustomColumnData = field => ({
  width: 200,
  key: field.id,
  title: field.name,
  render: (value, index) => {
    return (
      <DynamicTableDetail type={field.type} value={get(value, field.path)} />
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
    const {
      count,
      label,
      onSelect,
      operationKey,
      update,
      customFields = []
    } = this.props;

    return (
      <TableDataLoading loading={this.props.loading}>
        <Table
          bordered
          size={"small"}
          loading={loading}
          pagination={false}
          dataSource={values}
          rowKey={record => record.id}
          columns={[]
            .concat(customFields.map(getCustomColumnData))
            .concat(fields.map(getColumnData))}
          locale={{ emptyText: `No ${label}` }}
          onRow={r => ({ onClick: () => onSelect(r) })}
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
              page: 1,
              size: next,
              loading: current !== next ? true : false
            }));

            update({
              variables: { page: 1, size: next },
              updateQuery: (
                _,
                { fetchMoreResult: { [operationKey]: next = [] } }
              ) => {
                return {
                  [operationKey]: next
                };
              }
            });
          }}
          onChange={(p, s) => {
            this.setState(() => ({
              page: p,
              size: s,
              loading: p !== page || s !== size ? true : false
            }));

            update({
              variables: { page: p, size: s },
              updateQuery: (
                _,
                { fetchMoreResult: { [operationKey]: next = [] } }
              ) => {
                return {
                  [operationKey]: next
                };
              }
            });
          }}
        />
      </TableDataLoading>
    );
  }
}

export default ({
  label,
  entity,
  operation,
  operationKey,
  countOperation,
  countKey,
  onSelect,
  customFields
}) => (
  <Query query={countOperation} fetchPolicy={"network-only"}>
    {({ data: { [countKey]: count = null } }) => (
      <Query
        query={FIELDS_BY_ENTITY}
        variables={{ entity, read: true }}
        fetchPolicy={"network-only"}
      >
        {({ loading: fieldsLoading, data: { fieldsByEntity = [] } }) => (
          <Query query={operation} fetchPolicy={"network-only"}>
            {({
              loading: dataLoading,
              data: { [operationKey]: data = [] },
              fetchMore
            }) => {
              const fields = []
                .concat(fieldsByEntity)
                .sort((a, b) => a.order - b.order)
                .slice(0, 5);

              return (
                <DynamicTableList
                  label={label}
                  values={data}
                  fields={fields}
                  count={count}
                  update={fetchMore}
                  onSelect={onSelect}
                  operationKey={operationKey}
                  loading={fieldsLoading || dataLoading}
                  customFields={customFields}
                />
              );
            }}
          </Query>
        )}
      </Query>
    )}
  </Query>
);
