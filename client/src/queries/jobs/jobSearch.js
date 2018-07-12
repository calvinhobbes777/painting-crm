import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  query jobSearch(
    $page: Int
    $size: Int
    $fields: [FieldInput!]
    $value: String
  ) {
    jobCount(fields: $fields, value: $value)
    jobSearch(page: $page, size: $size, fields: $fields, value: $value) {
      id
      fields {
        ...FIELD_VALUE_FRAGMENT
      }
    }
  }
`;
