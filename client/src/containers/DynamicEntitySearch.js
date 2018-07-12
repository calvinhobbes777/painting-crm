import React, { Component } from "react";

import { set, get, keyBy, sortBy } from "lodash";
import styled from "styled-components";
import update from "immutability-helper";

import { FIELDS_BY_ENTITY } from "queries";

import { Button, Form, FormItem, Icon } from "components";
import { DynamicSearchTableList, DynamicSearchInput, Query } from "containers";

const SearchToggle = styled.button`
  outline: 0;
  border: none;
  color: #1890ff;
  padding-left: 4px;
  padding-right: 4px;
  margin-right: 12px;
  background-color: transparent;
  &:hover {
    opacity: 0.8;
  }
`;

const SearchReset = styled.button`
  outline: 0;
  border: none;
  color: #1890ff;
  padding-left: 4px;
  padding-right: 4px;
  background-color: transparent;
  &:hover {
    opacity: 0.8;
  }
`;

class DynamicEntitySearch extends Component {
  state = {
    open: true,
    custom: {},
    fields: {},
    query: { fields: [], custom: [] }
  };

  onChange = (id, value) => {
    const { fieldMap } = this.props;
    const fields = { ...this.state.fields };

    if (!value) {
      delete fields[id];
    } else {
      const { type } = fieldMap[id];

      if (type) {
        fields[id] = {
          field: id,
          value: {
            [type]: value
          }
        };
      }
    }

    this.setState(() => ({ fields }));
  };

  onCustomFieldChange = (field, key, value) => {
    let val = value;

    const [initial, ...parts] = field.path ? field.path.split(".") : "";

    if (parts.length > 0 && value) {
      val = set({}, parts.join("."), value);
    }

    console.log({ final: val });

    this.setState(state => ({
      custom: {
        ...state.custom,
        [key]: val
      }
    }));

    return initial;
  };

  toggle = () => this.setState(state => ({ open: !state.open }));

  setQuerySize = size =>
    this.setState(state => ({ query: { ...state.query, size } }));

  reset = () =>
    this.setState(state =>
      update(state, {
        fields: { $set: {} },
        custom: { $set: {} },
        query: { $set: { fields: [] } }
      })
    );

  onSubmit = () => {
    const { fields, custom } = this.state;

    this.setState(state =>
      update(state, {
        query: { fields: { $set: Object.values(fields) }, $merge: custom }
      })
    );
  };

  render() {
    const { fields: values, custom, query, open } = this.state;
    const {
      fields,
      onSelect,
      label,
      entity,
      operation,
      operationKey,
      countKey,
      customFields = {}
    } = this.props;

    return (
      <div>
        <Form>
          {open &&
            customFields.write &&
            customFields.write.map(
              ({ DataQuery, ...field }) =>
                console.log({
                  custom,
                  path: field.path,
                  derived: get(custom, field.path)
                }) || DataQuery ? (
                  <DataQuery key={field.id}>
                    {data => (
                      <FormItem
                        key={field.id}
                        ratio={1}
                        min={"20%"}
                        max={"20%"}
                        style={{ marginBottom: 4 }}
                      >
                        <DynamicSearchInput
                          {...field}
                          {...data}
                          value={get(custom, field.path)}
                          onChange={(key, value) =>
                            this.onCustomFieldChange(field, key, value)
                          }
                          onClear={() =>
                            this.onCustomFieldChange(field, field.id)
                          }
                        />
                      </FormItem>
                    )}
                  </DataQuery>
                ) : (
                  <FormItem
                    key={field.id}
                    ratio={1}
                    min={"20%"}
                    max={"20%"}
                    style={{ marginBottom: 4 }}
                  >
                    <DynamicSearchInput
                      {...field}
                      value={get(custom, field.path)}
                      onChange={(key, value) =>
                        this.onCustomFieldChange(field, key, value)
                      }
                      onClear={() => this.onCustomFieldChange(field, field.id)}
                    />
                  </FormItem>
                )
            )}
          {open &&
            fields.map(field => (
              <FormItem
                key={field.id}
                ratio={1}
                min={"20%"}
                max={"20%"}
                style={{ marginBottom: 4 }}
              >
                <DynamicSearchInput
                  {...field}
                  onChange={this.onChange}
                  onClear={() => this.onChange(field.id)}
                  value={values[field.id] && values[field.id].value}
                />
              </FormItem>
            ))}
          {open && <FormItem ratio={1} />}
          <FormItem
            ratio={1}
            min={open ? "20%" : "100%"}
            style={open ? {} : { marginBottom: 0 }}
            horizontal={open ? "flex-end" : "center"}
          >
            {open &&
              (!!Object.keys(values).length ||
                !!Object.keys(custom).length) && (
                <SearchReset type={"button"} onClick={this.reset}>
                  Reset
                </SearchReset>
              )}
            <SearchToggle type={"button"} onClick={this.toggle}>
              {!open && <Icon type={"search"} />}&nbsp;
              {open ? "Hide" : "Show Search"}
            </SearchToggle>
            {open && (
              <Button
                ghost
                type={"primary"}
                icon={"search"}
                htmlType={"submit"}
                onClick={this.onSubmit}
              >
                Search
              </Button>
            )}
          </FormItem>
        </Form>
        <DynamicSearchTableList
          label={label}
          query={query}
          entity={entity}
          countKey={countKey}
          operation={operation}
          operationKey={operationKey}
          onSelect={onSelect}
          setQuerySize={this.setQuerySize}
          customFields={customFields.read || []}
        />
      </div>
    );
  }
}

export default ({
  onSelect,
  label,
  entity,
  countKey,
  operation,
  operationKey,
  customFields
}) => (
  <Query query={FIELDS_BY_ENTITY} variables={{ entity: entity, read: true }}>
    {({ loading, data }) => {
      const { fieldsByEntity = [] } = data;
      const fields = sortBy(fieldsByEntity, "order");
      const fieldMap = keyBy(fieldsByEntity, "id");

      return (
        <DynamicEntitySearch
          label={label}
          entity={entity}
          fields={fields}
          fieldMap={fieldMap}
          onSelect={onSelect}
          countKey={countKey}
          operation={operation}
          operationKey={operationKey}
          customFields={customFields}
        />
      );
    }}
  </Query>
);
