import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  fragment JOB_FRAGMENT on Job {
    id
    fields {
      ...FIELD_VALUE_FRAGMENT
    }
  }
`;
