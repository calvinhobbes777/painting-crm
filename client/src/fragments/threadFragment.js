import gql from "graphql-tag";

import { COMMENT_FRAGMENT } from "fragments";

export default gql`
  ${COMMENT_FRAGMENT}
  fragment THREAD_FRAGMENT on Thread {
    id
    type
    entity {
      JOB {
        id
      }
      TASK {
        id
      }
      USER {
        id
      }
      CUSTOMER {
        id
      }
    }
    title
    author {
      id
      username
    }
    comments {
      ...COMMENT_FRAGMENT
    }
    createdAt
    updatedAt
  }
`;
