import React, { Component } from "react";

import { keyBy, sortBy, get, isObject, isArray } from "lodash";

import {
  DynamicUpdateInput,
  DynamicRelationshipInput,
  Query,
  Mutation
} from "containers";
import { Button, Form, FormItem, Loader } from "components";

import { FIELDS_BY_ENTITY } from "queries";
import { ENTITY_MAP, INPUT_SIZE_MAP } from "utilities";

class DynamicUpdateForm extends Component {
  state = {
    fields: {},
    customFields: {},
    relationsMap: {},
    hydrated: false
  };

  static getDerivedStateFromProps(
    { entity = {}, values = [], data = {}, relations = [], customFields = [] },
    state
  ) {
    if (state.hydrated || values.length === 0) {
      return {};
    }

    let relationsMap = {};
    let relationsValue = {};
    let customFieldsValue = {};

    customFields.forEach(f => {
      customFieldsValue[f.id] = get(entity, f.path);
    });

    relations.forEach(({ relationKey, multiple }) => {
      const value = data[relationKey];
      relationsMap[relationKey] = value;
      relationsValue[relationKey] = multiple
        ? value && value.map(({ id }) => ({ id }))
        : { id: value && value.id };
    });

    let initialState = {};

    values.forEach(({ id, field, value }) => {
      let fieldValue = value[field.type];

      if (isArray(fieldValue)) {
        fieldValue = fieldValue.map(fv => fv.id);
      } else if (isObject(fieldValue)) {
        fieldValue = fieldValue.id;
      }

      initialState[field.id] = {
        id,
        field: field.id,
        value: {
          id: value.id,
          [field.type]: fieldValue
        }
      };
    });

    return {
      hydrated: true,
      fields: initialState,
      relationsMap,
      relationsValue,
      customFieldsValue
    };
  }

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
      customFieldsValue: {
        ...state.customFieldsValue,
        [key]: value
      }
    }));
  };

  onSubmit = () => {
    const { fields, customFieldsValue, relationsValue } = this.state;

    this.props.onSubmit({
      fields: Object.values(fields),
      ...customFieldsValue,
      ...relationsValue
    });
  };

  render() {
    const { fields, relationsMap, customFieldsValue = {} } = this.state;
    const {
      relations = [],
      customFields = [],
      fields: _fields,
      loading,
      saving,
      type
    } = this.props;

    return (
      <Loader spinning={loading || saving}>
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
                      <DynamicUpdateInput
                        {...field}
                        {...data}
                        value={get(customFieldsValue, field.id)}
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
                  <DynamicUpdateInput
                    {...field}
                    value={get(customFieldsValue, field.id)}
                    onChange={this.onCustomFieldChange}
                  />
                </FormItem>
              )
          )}
          {_fields.map(({ id, name, size, type, values }) => (
            <FormItem
              key={id}
              label={name}
              ratio={1}
              min={`${INPUT_SIZE_MAP[size].value}%`}
            >
              <DynamicUpdateInput
                id={id}
                name={name}
                type={type}
                values={values}
                onChange={this.onChange}
                value={fields[id] && fields[id].value && fields[id].value[type]}
              />
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
              Update {ENTITY_MAP[type].label}
            </Button>
          </FormItem>
        </Form>
      </Loader>
    );
  }
}

export default ({
  id,
  onComplete,
  readKey,
  readOperation,
  writeOperation,
  type,
  ...props
}) => (
  <Mutation mutation={writeOperation} onCompleted={onComplete}>
    {(mutation, { loading: mutationLoading }) => (
      <Query
        query={readOperation}
        fetchPolicy={"network-only"}
        variables={{ id }}
      >
        {({ loading: valuesLoading, data: valuesData = {} }) => (
          <Query
            query={FIELDS_BY_ENTITY}
            fetchPolicy={"network-only"}
            variables={{ entity: type, read: true }}
          >
            {({ loading: queryLoading, data: fieldsData }) => {
              const entity = valuesData[readKey] || {};
              const { fieldsByEntity = [] } = fieldsData;
              const fields = sortBy(fieldsByEntity, "order");
              const fieldMap = keyBy(fieldsByEntity, "id");

              return (
                <DynamicUpdateForm
                  {...props}
                  type={type}
                  data={entity}
                  fields={fields}
                  fieldMap={fieldMap}
                  loading={queryLoading}
                  saving={mutationLoading}
                  values={entity.fields}
                  entity={entity}
                  onSubmit={variables =>
                    mutation({ variables: { id, ...variables } })
                  }
                />
              );
            }}
          </Query>
        )}
      </Query>
    )}
  </Mutation>
);
