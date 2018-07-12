import gql from "graphql-tag";

export default gql`
  {
    roles {
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
    }
  }
`;
