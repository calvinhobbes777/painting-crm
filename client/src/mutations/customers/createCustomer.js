import gql from "graphql-tag";

export default gql`
  mutation createCustomer(
    $fields: [FieldInput!]!
    $salesManager: RelationInput
    $accountExecutive: RelationInput
  ) {
    createCustomer(
      fields: $fields
      salesManager: $salesManager
      accountExecutive: $accountExecutive
    ) {
      id
    }
  }
`;
