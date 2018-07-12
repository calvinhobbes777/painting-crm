import { JOB_SEARCH } from "queries";

export default {
  key: "jobs",
  label: "Job",
  ratio: 1,
  width: "100%",
  entity: "JOB",
  multiple: true,
  relationKey: "jobs",
  countKey: "jobCount",
  operation: JOB_SEARCH,
  operationKey: "jobSearch"
};
