import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  query jobs($page: Int, $size: Int) {
    jobs(page: $page, size: $size) {
      id
      fields {
        ...FIELD_VALUE_FRAGMENT
      }
    }
  }
`;
