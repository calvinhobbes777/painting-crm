import gql from "graphql-tag";

export default gql`
  mutation updateUser(
    $id: ID!
    $fields: [FieldInput!]!
    $username: String
    $role: String
  ) {
    updateUser(id: $id, fields: $fields, role: $role, username: $username) {
      id
    }
  }
`;
