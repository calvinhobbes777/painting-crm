import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  query taskSearch(
    $page: Int
    $size: Int
    $fields: [FieldInput!]
    $value: String
  ) {
    taskCount(fields: $fields, value: $value)
    taskSearch(page: $page, size: $size, fields: $fields, value: $value) {
      id
      fields {
        ...FIELD_VALUE_FRAGMENT
      }
    }
  }
`;
