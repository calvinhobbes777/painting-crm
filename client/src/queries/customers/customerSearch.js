import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT, USER_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  ${USER_FRAGMENT}
  query customerSearch(
    $page: Int
    $size: Int
    $fields: [FieldInput!]
    $value: String
    $salesManager: RelationInput
    $accountExecutive: RelationInput
  ) {
    customerCount(
      fields: $fields
      value: $value
      salesManager: $salesManager
      accountExecutive: $accountExecutive
    )
    customerSearch(
      page: $page
      size: $size
      fields: $fields
      value: $value
      salesManager: $salesManager
      accountExecutive: $accountExecutive
    ) {
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
