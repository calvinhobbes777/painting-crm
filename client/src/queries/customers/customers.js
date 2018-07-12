import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT, USER_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  ${USER_FRAGMENT}
  query customers($page: Int, $size: Int) {
    customers(page: $page, size: $size) {
      id
      fields {
        ...FIELD_VALUE_FRAGMENT
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
