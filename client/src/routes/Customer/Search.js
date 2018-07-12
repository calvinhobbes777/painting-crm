import React from "react";

import { DynamicEntitySearch } from "containers";

import { CUSTOMER_SEARCH } from "queries";

import { customerSchema } from "schema";

export default ({ history }) => (
  <DynamicEntitySearch
    label={"Customers"}
    entity={"CUSTOMER"}
    countKey={"customerCount"}
    operation={CUSTOMER_SEARCH}
    operationKey={"customerSearch"}
    customFields={{
      read: customerSchema.query.fields.read,
      write: customerSchema.query.fields.write
    }}
    onSelect={r => history.push(`/customers/${r.id}`)}
  />
);
