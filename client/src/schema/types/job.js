import { JOB_SEARCH } from "queries";

export default {
  key: "job",
  label: "Job",
  ratio: 1,
  width: "50%",
  entity: "JOB",
  multiple: false,
  relationKey: "job",
  countKey: "jobCount",
  operation: JOB_SEARCH,
  operationKey: "jobSearch"
};
