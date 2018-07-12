import React from "react";

import { USERS, USER_COUNT } from "queries";

import { DynamicTableList } from "containers";

import { userSchema } from "schema";

export default ({ history }) => (
  <DynamicTableList
    label={"Users"}
    entity={"USER"}
    operation={USERS}
    operationKey={"users"}
    countOperation={USER_COUNT}
    countKey={"userCount"}
    customFields={userSchema.read.fields.read || []}
    onSelect={r => history.push(`/users/${r.id}`)}
  />
);
