import gql from "graphql-tag";

export default gql`
  mutation createJob(
    $fields: [FieldInput!]!
    $customer: RelationInput # $users: [RelationInput!]
  ) {
    createJob(
      fields: $fields
      customer: $customer # users: $users
    ) {
      id
    }
  }
`;
