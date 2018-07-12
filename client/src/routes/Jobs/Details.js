import React from "react";

import { DynamicDetails } from "containers";

import { JOB } from "queries";
import { jobSchema } from "schema";

export default ({
  match: {
    params: { id }
  }
}) => (
  <div>
    <DynamicDetails
      id={id}
      type={"JOB"}
      relations={jobSchema.read.relations}
      operation={JOB}
      operationKey={"job"}
    />
  </div>
);
