import gql from "graphql-tag";

import {
  FIELD_VALUE_FRAGMENT,
  JOB_FRAGMENT,
  THREAD_FRAGMENT,
  USER_FRAGMENT
} from "fragments";
// console.log()
export default gql`
  ${FIELD_VALUE_FRAGMENT}
  ${USER_FRAGMENT}
  ${JOB_FRAGMENT}
  ${THREAD_FRAGMENT}
  query customer($id: ID!) {
    customer(id: $id) {
      id
      fields {
        ...FIELD_VALUE_FRAGMENT
      }
      jobs {
        ...JOB_FRAGMENT
      }
      threads {
        ...THREAD_FRAGMENT
      }
      salesManager {
        ...USER_FRAGMENT
      }
      accountExecutive {
        ...USER_FRAGMENT
      }
    }
  }
`;
