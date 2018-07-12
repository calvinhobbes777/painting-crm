import gql from "graphql-tag";

export default gql`
  fragment FIELD_VALUE_FRAGMENT on FieldValue {
    id
    field {
      id
      type
      name
      size
      order
    }
    value {
      id
      TEXT
      DATE
      LONGTEXT
      SELECT
      CURRENCY
      NUMBER
      YESNO
      UPLOAD {
        id
        type
        name
        size
        url
        secret
      }
      UPLOADS {
        id
        type
        name
        size
        url
        secret
      }
    }
  }
`;
