import { CUSTOMER_SEARCH } from "queries";

export default {
  key: "customer",
  label: "Customer",
  ratio: 1,
  width: "50%",
  entity: "CUSTOMER",
  multiple: false,
  relationKey: "customer",
  countKey: "customerCount",
  operation: CUSTOMER_SEARCH,
  operationKey: "customerSearch"
};
