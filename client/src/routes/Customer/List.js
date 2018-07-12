import React from "react";

import { CUSTOMERS, CUSTOMER_COUNT } from "queries";

import { DynamicTableList } from "containers";

import { customerSchema } from "schema";

export default ({ history }) => (
  <DynamicTableList
    label={"Customers"}
    entity={"CUSTOMER"}
    operation={CUSTOMERS}
    operationKey={"customers"}
    countOperation={CUSTOMER_COUNT}
    countKey={"customerCount"}
    customFields={customerSchema.query.fields.read}
    onSelect={r => history.push(`/customers/${r.id}`)}
  />
);
