import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  fragment USER_FRAGMENT on User {
    id
    username
    role {
      id
      type
      name
    }
    fields {
      ...FIELD_VALUE_FRAGMENT
    }
  }
`;
