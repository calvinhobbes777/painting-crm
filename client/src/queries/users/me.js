import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  {
    me {
      id
      role {
        id
        type
        name
        read {
          id
          type
          name
          values
        }
        write {
          id
          type
          name
          values
        }
        permissions
      }
      username
      fields {
        ...FIELD_VALUE_FRAGMENT
      }
    }
  }
`;
