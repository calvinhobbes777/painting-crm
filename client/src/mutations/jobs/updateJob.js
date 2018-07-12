import gql from "graphql-tag";

export default gql`
  mutation updateJob(
    $id: ID!
    $fields: [FieldInput!]!
    $customer: RelationInput # $users: [RelationInput!]
  ) {
    updateJob(
      id: $id
      fields: $fields
      customer: $customer # users: $users
    ) {
      id
    }
  }
`;
