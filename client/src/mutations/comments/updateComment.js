import gql from "graphql-tag";

export default gql`
  mutation updateComment($id: ID!, $body: String!) {
    updateComment(id: $id, body: $body) {
      id
    }
  }
`;
