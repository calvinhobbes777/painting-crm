import { TASK_SEARCH } from "queries";

export default {
  key: "tasks",
  label: "Task",
  ratio: 1,
  width: "100%",
  entity: "TASK",
  multiple: true,
  relationKey: "tasks",
  countKey: "taskCount",
  operation: TASK_SEARCH,
  operationKey: "taskSearch"
};
