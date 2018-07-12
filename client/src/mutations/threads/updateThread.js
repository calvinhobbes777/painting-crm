import gql from "graphql-tag";

export default gql`
  mutation updateThread($id: ID!, $title: String!) {
    updateThread(id: $id, title: $title) {
      id
    }
  }
`;
