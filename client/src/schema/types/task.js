import { TASK_SEARCH } from "queries";

export default {
  key: "task",
  label: "Task",
  ratio: 1,
  width: "50%",
  entity: "TASK",
  multiple: false,
  relationKey: "task",
  countKey: "taskCount",
  operation: TASK_SEARCH,
  operationKey: "taskSearch"
};
