import gql from "graphql-tag";

import {
  FIELD_VALUE_FRAGMENT,
  JOB_FRAGMENT,
  TASK_FRAGMENT,
  THREAD_FRAGMENT
} from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  ${JOB_FRAGMENT}
  ${TASK_FRAGMENT}
  ${THREAD_FRAGMENT}
  query user($id: ID, $username: String) {
    user(id: $id, username: $username) {
      id
      username
      role {
        id
        type
        name
      }
      fields {
        ...FIELD_VALUE_FRAGMENT
      }
      jobs {
        ...JOB_FRAGMENT
      }
      tasks {
        ...TASK_FRAGMENT
      }
      threads {
        ...THREAD_FRAGMENT
      }
    }
  }
`;
