import gql from "graphql-tag";

export default gql`
  mutation createTask(
    $fields: [FieldInput!]!
    $job: RelationInput
    $user: RelationInput
    $customer: RelationInput
  ) {
    createTask(fields: $fields, user: $user, job: $job, customer: $customer) {
      id
    }
  }
`;
