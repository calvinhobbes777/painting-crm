import gql from "graphql-tag";

export default gql`
  mutation updateRole(
    $id: ID!
    $name: String!
    $type: String!
    $permissions: Json!
  ) {
    updateRole(id: $id, name: $name, type: $type, permissions: $permissions) {
      id
      type
      name
      read {
        id
        name
        type
      }
      write {
        id
        name
        type
      }
      permissions
    }
  }
`;
