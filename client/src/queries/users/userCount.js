import gql from "graphql-tag";

export default gql`
  query userCount(
    $fields: [FieldInput!]
    $value: String
    $role: RoleSearchInput
  ) {
    userCount(fields: $fields, value: $value, role: $role)
  }
`;
