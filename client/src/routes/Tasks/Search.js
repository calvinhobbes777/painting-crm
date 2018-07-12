import React from "react";

import { DynamicEntitySearch } from "containers";

import { TASK_SEARCH } from "queries";

export default ({ history }) => (
  <DynamicEntitySearch
    label={"Tasks"}
    entity={"TASK"}
    countKey={"taskCount"}
    operation={TASK_SEARCH}
    operationKey={"taskSearch"}
    onSelect={r => history.push(`/tasks/${r.id}`)}
  />
);
