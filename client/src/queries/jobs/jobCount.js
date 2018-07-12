import gql from "graphql-tag";

export default gql`
  query jobCount($fields: [FieldInput!], $value: String) {
    jobCount(fields: $fields, value: $value)
  }
`;
