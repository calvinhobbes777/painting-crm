import React from "react";

import { DynamicUpdateForm } from "containers";

import { JOB } from "queries";
import { UPDATE_JOB } from "mutations";
import { jobSchema } from "schema";

export default ({
  history,
  match: {
    params: { id }
  }
}) => (
  <DynamicUpdateForm
    id={id}
    type={"JOB"}
    readKey={"job"}
    readOperation={JOB}
    writeOperation={UPDATE_JOB}
    relations={jobSchema.write.relations}
    onComplete={({ updateJob: { id } }) => {
      if (id) {
        return history.replace(`/jobs/${id}`);
      }

      history.replace("/jobs");
    }}
  />
);
