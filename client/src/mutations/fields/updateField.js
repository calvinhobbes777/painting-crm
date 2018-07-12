import gql from "graphql-tag";

export default gql`
  mutation updateField(
    $id: ID!
    $name: String
    $values: [String!]
    $read: [String!]
    $write: [String!]
    $size: Int
    $order: Int
  ) {
    updateField(
      id: $id
      name: $name
      values: $values
      read: $read
      write: $write
      size: $size
      order: $order
    ) {
      id
      type
      name
      entity
      values
      size
      order
      static
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
