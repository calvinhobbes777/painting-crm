import gql from "graphql-tag";

export default gql`
  mutation createComment($author: ID!, $thread: ID!, $body: String!) {
    createComment(author: $author, thread: $thread, body: $body) {
      id
    }
  }
`;
