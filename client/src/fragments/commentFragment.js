import gql from "graphql-tag";

export default gql`
  fragment COMMENT_FRAGMENT on Comment {
    id
    body
    author {
      username
    }
    createdAt
    updatedAt
  }
`;
