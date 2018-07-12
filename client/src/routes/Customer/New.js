import React from "react";

import { DynamicCreateForm } from "containers";

import { CREATE_CUSTOMER } from "mutations";

import { customerSchema } from "schema";

export default ({ history }) => (
  <DynamicCreateForm
    type={"CUSTOMER"}
    operation={CREATE_CUSTOMER}
    relations={customerSchema.write.relations}
    onComplete={({ createCustomer: { id } }) => {
      if (id) {
        return history.replace(`/customers/${id}`);
      }

      history.replace("/customers");
    }}
  />
);
