import React from "react";

import { DynamicDetails } from "containers";

import { USER } from "queries";
import { userSchema } from "schema";

export default ({
  match: {
    params: { id }
  }
}) => (
  <div>
    <DynamicDetails
      id={id}
      username={id}
      type={"USER"}
      customFields={userSchema.read.fields.read}
      relations={userSchema.read.relations}
      operation={USER}
      operationKey={"user"}
    />
  </div>
);
