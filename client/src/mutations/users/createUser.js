import gql from "graphql-tag";

export default gql`
  mutation createUser(
    $username: String!
    $password: String!
    $role: String!
    $fields: [FieldInput!]!
  ) {
    createUser(
      username: $username
      password: $password
      fields: $fields
      role: $role
    ) {
      user {
        id
      }
    }
  }
`;
