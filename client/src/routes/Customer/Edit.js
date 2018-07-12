import React from "react";

import { DynamicUpdateForm } from "containers";

import { CUSTOMER } from "queries";
import { UPDATE_CUSTOMER } from "mutations";

import { customerSchema } from "schema";

export default ({
  history,
  match: {
    params: { id }
  }
}) => (
  <DynamicUpdateForm
    id={id}
    type={"CUSTOMER"}
    readKey={"customer"}
    readOperation={CUSTOMER}
    writeOperation={UPDATE_CUSTOMER}
    relations={customerSchema.write.relations}
    onComplete={({ updateCustomer: { id } }) => {
      if (id) {
        return history.replace(`/customers/${id}`);
      }

      history.replace("/customers");
    }}
  />
);
