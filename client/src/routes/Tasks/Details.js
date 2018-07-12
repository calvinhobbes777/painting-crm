import React from "react";

import { DynamicDetails } from "containers";

import { TASK } from "queries";
import { taskSchema } from "schema";

export default ({
  match: {
    params: { id }
  }
}) => (
  <div>
    <DynamicDetails
      id={id}
      type={"TASK"}
      relations={taskSchema.read.relations}
      operation={TASK}
      operationKey={"task"}
    />
  </div>
);
