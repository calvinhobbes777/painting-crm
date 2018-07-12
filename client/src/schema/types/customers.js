import { CUSTOMER_SEARCH } from "queries";

export default {
  key: "customers",
  label: "Customer",
  ratio: 1,
  width: "100%",
  entity: "CUSTOMER",
  multiple: true,
  relationKey: "customers",
  countKey: "customerCount",
  operation: CUSTOMER_SEARCH,
  operationKey: "customerSearch"
};
