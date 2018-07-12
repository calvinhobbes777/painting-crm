import gql from "graphql-tag";

export default gql`
  query fieldsByEntity($entity: FieldEntity!, $read: Boolean, $write: Boolean) {
    fieldsByEntity(entity: $entity, read: $read, write: $write) {
      id
      name
      type
      entity
      values
      static
      order
      size
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
