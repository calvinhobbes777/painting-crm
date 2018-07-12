import { USER_SEARCH } from "queries";

export default {
  key: "user",
  label: "User",
  ratio: 1,
  width: "50%",
  entity: "USER",
  multiple: false,
  relationKey: "user",
  countKey: "userCount",
  operation: USER_SEARCH,
  operationKey: "userSearch"
};
