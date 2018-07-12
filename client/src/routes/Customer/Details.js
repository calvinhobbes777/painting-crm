import React from "react";

import { DynamicDetails } from "containers";

import { CUSTOMER } from "queries";
import { customerSchema } from "schema";

export default ({
  match: {
    params: { id }
  }
}) => (
  <div>
    <DynamicDetails
      id={id}
      type={"CUSTOMER"}
      relations={customerSchema.read.relations}
      operation={CUSTOMER}
      operationKey={"customer"}
    />
  </div>
);
