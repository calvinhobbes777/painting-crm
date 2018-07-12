import gql from "graphql-tag";

import {
  FIELD_VALUE_FRAGMENT,
  USER_FRAGMENT,
  JOB_FRAGMENT,
  CUSTOMER_FRAGMENT,
  THREAD_FRAGMENT
} from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  ${USER_FRAGMENT}
  ${JOB_FRAGMENT}
  ${CUSTOMER_FRAGMENT}
  ${THREAD_FRAGMENT}
  query task($id: ID!) {
    task(id: $id) {
      id
      fields {
        ...FIELD_VALUE_FRAGMENT
      }
      user {
        ...USER_FRAGMENT
      }
      job {
        ...JOB_FRAGMENT
      }
      customer {
        ...CUSTOMER_FRAGMENT
      }
      threads {
        ...THREAD_FRAGMENT
      }
    }
  }
`;
