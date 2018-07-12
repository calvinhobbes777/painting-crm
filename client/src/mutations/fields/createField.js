import gql from "graphql-tag";

export default gql`
  mutation createField(
    $name: String!
    $type: FieldType!
    $values: [String!]
    $read: [String!]
    $write: [String!]
    $entity: FieldEntity!
  ) {
    createField(
      name: $name
      type: $type
      entity: $entity
      values: $values
      read: $read
      write: $write
    ) {
      id
      type
      name
      entity
      values
      read {
        id
        name
        type
      }
      write {
        id
        name
        type
      }
    }
  }
`;
