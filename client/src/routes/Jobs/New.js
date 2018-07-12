import React from "react";

import { DynamicCreateForm } from "containers";

import { jobSchema } from "schema";
import { CREATE_JOB } from "mutations";

export default ({ history }) => (
  <DynamicCreateForm
    type={"JOB"}
    operation={CREATE_JOB}
    relations={jobSchema.write.relations}
    onComplete={({ createJob: { id } }) => {
      if (id) {
        return history.replace(`/jobs/${id}`);
      }

      history.replace("/jobs");
    }}
  />
);
