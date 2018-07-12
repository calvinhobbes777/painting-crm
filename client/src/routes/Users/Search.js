import React from "react";

import { DynamicEntitySearch } from "containers";

import { USER_SEARCH } from "queries";

import { userSchema } from "schema";

export default ({ history }) => (
  <DynamicEntitySearch
    label={"Users"}
    entity={"USER"}
    countKey={"userCount"}
    operation={USER_SEARCH}
    operationKey={"userSearch"}
    customFields={{
      read: userSchema.read.fields.read,
      write: userSchema.write.fields.update
    }}
    onSelect={r => history.push(`/users/${r.id}`)}
  />
);
