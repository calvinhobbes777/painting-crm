import React from "react";

import { DynamicDetails } from "containers";

import { ME } from "queries";

import { userSchema } from "schema";

export default () => (
  <DynamicDetails
    type={"USER"}
    operation={ME}
    operationKey={"me"}
    threadsOff={true}
    customFields={userSchema.read.fields.read}
  />
);
