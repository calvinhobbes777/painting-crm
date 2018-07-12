import React, { Component } from "react";

import { keyBy, sortBy } from "lodash";

import {
  Query,
  Mutation,
  DynamicCreateInput,
  DynamicRelationshipInput
} from "containers";
import { Button, Form, FormItem, Loader } from "components";

import { FIELDS_BY_ENTITY } from "queries";
import { ENTITY_MAP, INPUT_SIZE_MAP } from "utilities";

class DynamicCreateForm extends Component {
  state = {
    fields: {},
    customFields: {},
    relationsMap: {}
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

  onRelationChange = (key, value, multiple) => {
    this.setState(state => ({
      relationsMap: {
        ...state.relationsMap,
        [key]: value
      },
      relationsValue: {
        ...state.relationsValue,
        [key]: multiple
          ? value && value.map(({ id }) => ({ id }))
          : { id: value && value.id }
      }
    }));
  };

  onCustomFieldChange = (key, value) => {
    this.setState(state => ({
      customFields: {
        ...state.customFields,
        [key]: value
      }
    }));
  };

  onSubmit = () => {
    const { fields, customFields, relationsValue } = this.state;

    this.props.onSubmit({
      fields: Object.values(fields),
      ...customFields,
      ...relationsValue
    });
  };

  render() {
    const { relationsMap } = this.state;
    const {
      relations = [],
      customFields = [],
      fields,
      loading,
      saving,
      type
    } = this.props;

    return (
      <Loader spinning={loading || saving} unstyled>
        <Form disabled={saving}>
          {customFields.map(
            ({ DataQuery, ...field }) =>
              DataQuery ? (
                <DataQuery key={field.id}>
                  {data => (
                    <FormItem
                      key={field.id}
                      label={field.name}
                      ratio={1}
                      min={`${INPUT_SIZE_MAP[field.size].value}%`}
                    >
                      <DynamicCreateInput
                        {...field}
                        {...data}
                        onChange={this.onCustomFieldChange}
                      />
                    </FormItem>
                  )}
                </DataQuery>
              ) : (
                <FormItem
                  key={field.id}
                  label={field.name}
                  ratio={1}
                  min={`${INPUT_SIZE_MAP[field.size].value}%`}
                >
                  <DynamicCreateInput
                    {...field}
                    onChange={this.onCustomFieldChange}
                  />
                </FormItem>
              )
          )}
          {fields.map(field => (
            <FormItem
              key={field.id}
              label={field.name}
              ratio={1}
              min={`${INPUT_SIZE_MAP[field.size].value}%`}
            >
              <DynamicCreateInput {...field} onChange={this.onChange} />
            </FormItem>
          ))}
          {relations.map(
            ({
              key,
              label,
              ratio,
              width,
              entity,
              multiple,
              relationKey,
              countKey,
              operation,
              operationKey
            }) => (
              <FormItem key={key} min={width} ratio={ratio}>
                <DynamicRelationshipInput
                  size={parseInt(width, 100)}
                  value={relationsMap[relationKey]}
                  multiple={multiple}
                  label={label}
                  entity={entity}
                  countKey={countKey}
                  operation={operation}
                  operationKey={operationKey}
                  onRemove={value =>
                    this.onRemoveRelation(relationKey, value, multiple)
                  }
                  onChange={value =>
                    this.onRelationChange(relationKey, value, multiple)
                  }
                />
              </FormItem>
            )
          )}
          <FormItem ratio={1} min={"100%"} horizontal={"flex-end"}>
            <Button
              type={"primary"}
              onClick={this.onSubmit}
              disabled={loading || saving}
              loading={saving}
            >
              Create {ENTITY_MAP[type].label}
            </Button>
          </FormItem>
        </Form>
      </Loader>
    );
  }
}

export default ({ onComplete, operation, type, ...props }) => (
  <Mutation mutation={operation} onCompleted={onComplete}>
    {(mutation, { loading: mutationLoading }) => (
      <Query
        query={FIELDS_BY_ENTITY}
        fetchPolicy={"network-only"}
        variables={{ entity: type, read: true, write: true }}
      >
        {({ loading: queryLoading, data }) => {
          const { fieldsByEntity = [] } = data;
          const fields = sortBy(fieldsByEntity, "order");
          const fieldMap = keyBy(fieldsByEntity, "id");

          return (
            <DynamicCreateForm
              {...props}
              type={type}
              fields={fields}
              fieldMap={fieldMap}
              loading={queryLoading}
              saving={mutationLoading}
              onSubmit={variables => mutation({ variables })}
            />
          );
        }}
      </Query>
    )}
  </Mutation>
);
