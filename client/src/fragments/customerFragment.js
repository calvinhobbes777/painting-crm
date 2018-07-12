import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  fragment CUSTOMER_FRAGMENT on Customer {
    id
    fields {
      ...FIELD_VALUE_FRAGMENT
    }
  }
`;
