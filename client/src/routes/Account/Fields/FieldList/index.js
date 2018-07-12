import React from "react";

import { sortBy, groupBy } from "lodash";
import { Query } from "containers";

import { FIELDS } from "queries";
import { ENTITIES } from "utilities";

import FieldList from "./FieldList";

export default () => (
  <Query query={FIELDS} fetchPolicy={"network-only"}>
    {({ data, error, loading }) => {
      const { fields = [] } = data;

      const sorted = groupBy(sortBy(fields, "name"), "entity");

      return (
        <FieldList
          error={error}
          loading={loading}
          fields={sorted}
          entities={ENTITIES}
        />
      );
    }}
  </Query>
);
