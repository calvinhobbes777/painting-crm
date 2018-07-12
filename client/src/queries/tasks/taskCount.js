import gql from "graphql-tag";

export default gql`
  query taskCount($fields: [FieldInput!], $value: String) {
    taskCount(fields: $fields, value: $value)
  }
`;
