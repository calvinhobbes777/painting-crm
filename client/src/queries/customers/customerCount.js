import gql from "graphql-tag";

export default gql`
  query customerCount($fields: [FieldInput!], $value: String) {
    customerCount(fields: $fields, value: $value)
  }
`;
