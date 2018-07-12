import gql from "graphql-tag";

export default gql`
  mutation createRole($name: String!, $type: String!) {
    createRole(name: $name, type: $type) {
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
    }
  }
`;
