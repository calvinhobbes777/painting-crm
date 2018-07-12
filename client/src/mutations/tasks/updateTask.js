import gql from "graphql-tag";

export default gql`
  mutation updateTask(
    $id: ID!
    $fields: [FieldInput!]!
    $job: RelationInput
    $user: RelationInput
    $customer: RelationInput
  ) {
    updateTask(
      id: $id
      fields: $fields
      user: $user
      job: $job
      customer: $customer
    ) {
      id
    }
  }
`;
