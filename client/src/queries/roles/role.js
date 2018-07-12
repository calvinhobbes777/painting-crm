import gql from "graphql-tag";

export default gql`
  query role($id: ID, $type: String) {
    role(id: $id, type: $type) {
      id
      name
      type
      read {
        id
        name
        entity
      }
      write {
        id
        name
        entity
      }
      permissions
    }
  }
`;
