import React from "react";

import { groupBy, sortBy } from "lodash";
import { Query } from "containers";

import { ROLES, FIELDS } from "queries";
import { ENTITIES } from "utilities";

import RoleList from "./RoleList";

export default () => (
  <Query query={ROLES} fetchPolicy={"network-only"}>
    {({ data: rolesData, error: rolesError, loading: rolesLoading }) => {
      const { roles = [] } = rolesData;

      return (
        <Query query={FIELDS} fetchPolicy={"network-only"}>
          {({
            data: fieldsData,
            error: fieldsError,
            loading: fieldsLoading
          }) => {
            const { fields = [] } = fieldsData;

            const sorted = groupBy(sortBy(fields, "name"), "entity");

            return (
              <RoleList
                fields={sorted}
                roles={roles}
                entities={ENTITIES}
                error={rolesError || fieldsError}
                loading={rolesLoading || fieldsLoading}
              />
            );
          }}
        </Query>
      );
    }}
  </Query>
);
