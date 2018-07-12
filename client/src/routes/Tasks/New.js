import React from "react";

import { DynamicCreateForm } from "containers";

import { taskSchema } from "schema";
import { CREATE_TASK } from "mutations";

export default ({ history }) => (
  <DynamicCreateForm
    type={"TASK"}
    operation={CREATE_TASK}
    relations={taskSchema.write.relations}
    onComplete={({ createTask: { id } }) => {
      if (id) {
        return history.replace(`/tasks/${id}`);
      }

      history.replace("/tasks");
    }}
  />
);
