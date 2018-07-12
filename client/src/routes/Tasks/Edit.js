import React from "react";

import { DynamicUpdateForm } from "containers";

import { TASK } from "queries";
import { UPDATE_TASK } from "mutations";
import { taskSchema } from "schema";

export default ({
  history,
  match: {
    params: { id }
  }
}) => (
  <DynamicUpdateForm
    id={id}
    type={"TASK"}
    readKey={"task"}
    readOperation={TASK}
    writeOperation={UPDATE_TASK}
    relations={taskSchema.write.relations}
    onComplete={({ updateTask: { id } }) => {
      if (id) {
        return history.replace(`/tasks/${id}`);
      }

      history.replace("/tasks");
    }}
  />
);
