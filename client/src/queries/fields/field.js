import gql from "graphql-tag";

export default gql`
  query field($id: ID!) {
    field(id: $id) {
      id
      name
      type
      entity
      values
      static
      order
      size
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
    }
  }
`;
