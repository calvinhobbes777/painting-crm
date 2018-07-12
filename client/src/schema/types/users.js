import { USER_SEARCH } from "queries";

export default {
  key: "users",
  label: "User",
  ratio: 1,
  width: "100%",
  entity: "USER",
  multiple: true,
  relationKey: "users",
  countKey: "userCount",
  operation: USER_SEARCH,
  operationKey: "userSearch"
};
