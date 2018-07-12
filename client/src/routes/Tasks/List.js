import React from "react";

import { TASKS, TASK_COUNT } from "queries";

import { DynamicTableList } from "containers";

export default ({ history }) => (
  <DynamicTableList
    label={"Tasks"}
    entity={"TASK"}
    operation={TASKS}
    operationKey={"tasks"}
    countOperation={TASK_COUNT}
    countKey={"taskCount"}
    onSelect={r => history.push(`/tasks/${r.id}`)}
  />
);
