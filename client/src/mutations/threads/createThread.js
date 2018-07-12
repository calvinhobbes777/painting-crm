import gql from "graphql-tag";

export default gql`
  mutation createThread(
    $type: FieldEntity!
    $entity: ID!
    $author: ID!
    $title: String!
  ) {
    createThread(type: $type, entity: $entity, author: $author, title: $title) {
      id
    }
  }
`;
