import gql from "graphql-tag";

export default gql`
  {
    fields {
      id
      name
      type
      entity
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
