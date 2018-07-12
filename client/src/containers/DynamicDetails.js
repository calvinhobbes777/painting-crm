import React from "react";

import { withRouter } from "react-router-dom";
import { Card } from "antd";

import { sortBy, keyBy, get } from "lodash";
import styled from "styled-components";

import { Loader } from "components";
import {
  DynamicThread,
  DynamicDetailItem,
  DynamicRelationsDetail,
  Query
} from "containers";

import { FIELDS_BY_ENTITY } from "queries";
import { INPUT_SIZE_MAP } from "utilities";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const DetailContainer = styled(Card)`
  flex: 1;
  margin: 5px !important;
  margin-right: 15px !important;
  min-width: ${props => `calc(${INPUT_SIZE_MAP[props.size].value}% - 20px)`};
`;

const DetailRelationContainer = styled.div`
  flex: 1;
  margin: 5px !important;
  margin-right: 15px !important;
  min-width: ${props => `calc(${props.size} - 20px)`};
`;

const bodyStyle = {
  paddingTop: 16,
  paddingBottom: 16
};

export default withRouter(
  ({
    id,
    username,
    type,
    operation,
    operationKey,
    relations = [],
    customFields = [],
    threadsOff,
    history
  }) => (
    <Query
      query={operation}
      variables={{ id, username }}
      fetchPolicy={"network-only"}
    >
      {({ loading: valuesLoading, data: valuesData = {}, refetch }) => (
        <Query
          query={FIELDS_BY_ENTITY}
          fetchPolicy={"network-only"}
          variables={{ entity: type, read: true }}
        >
          {({ loading: fieldsLoading, data: fieldsData }) => {
            const entity = valuesData[operationKey] || {};
            const { fieldsByEntity = [] } = fieldsData;
            const fields = keyBy(entity.fields, "field.id");
            const _fields = sortBy(fieldsByEntity, "order");

            return (
              <Loader spinning={valuesLoading && fieldsLoading}>
                <Container>
                  {[]
                    .concat(customFields)
                    .map(({ id, size, type, name, path }) => (
                      <DetailContainer
                        key={id}
                        size={size}
                        title={name}
                        bodyStyle={bodyStyle}
                        className={"item-detail"}
                      >
                        <DynamicDetailItem
                          name={name}
                          type={type}
                          value={get(entity, path)}
                        />
                      </DetailContainer>
                    ))}
                </Container>
                <Container>
                  {[]
                    .concat(_fields)
                    .sort((a, b) => a.order - b.order)
                    .map(({ id, size, type, name }) => (
                      <DetailContainer
                        key={id}
                        size={size}
                        title={name}
                        bodyStyle={bodyStyle}
                        className={"item-detail"}
                      >
                        <DynamicDetailItem
                          name={name}
                          type={type}
                          value={
                            fields[id] &&
                            fields[id].value &&
                            fields[id].value[type]
                          }
                        />
                      </DetailContainer>
                    ))}
                </Container>
                <Container>
                  {relations.map(
                    ({ key, label, multiple, entity: _entity, width }) => (
                      <DetailRelationContainer key={key} size={width}>
                        <DynamicRelationsDetail
                          read
                          key={key}
                          data={entity[key]}
                          entity={_entity}
                          multiple={multiple}
                          onOpen={() => null}
                          onRemove={() => null}
                          onSelect={r => {
                            history.push(`/${_entity.toLowerCase()}s/${r.id}`);
                          }}
                          label={`${label}${multiple ? "s" : ""}`}
                          columnsQty={3}
                        />
                      </DetailRelationContainer>
                    )
                  )}
                </Container>
                {threadsOff || (
                  <Container>
                    <DynamicThread
                      refresh={() => refetch({ id })}
                      type={type}
                      entity={entity}
                      threads={entity.threads}
                    />
                  </Container>
                )}
              </Loader>
            );
          }}
        </Query>
      )}
    </Query>
  )
);
