import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  query users($page: Int, $size: Int) {
    users(page: $page, size: $size) {
      id
      fields {
        ...FIELD_VALUE_FRAGMENT
      }
      username
      role {
        id
        name
        type
      }
    }
  }
`;
