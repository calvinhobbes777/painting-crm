import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  query userSearch(
    $page: Int
    $username: String
    $role: RoleSearchInput
    $size: Int
    $fields: [FieldInput!]
    $value: String
  ) {
    userCount(fields: $fields, value: $value, username: $username, role: $role)
    userSearch(
      page: $page
      size: $size
      fields: $fields
      value: $value
      username: $username
      role: $role
    ) {
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
