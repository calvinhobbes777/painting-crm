import gql from "graphql-tag";

export default gql`
  mutation updateCustomer(
    $id: ID!
    $fields: [FieldInput!]!
    $salesManager: RelationInput
    $accountExecutive: RelationInput
  ) {
    updateCustomer(
      id: $id
      fields: $fields
      salesManager: $salesManager
      accountExecutive: $accountExecutive
    ) {
      id
    }
  }
`;
