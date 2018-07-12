import gql from "graphql-tag";

import { FIELD_VALUE_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  fragment TASK_FRAGMENT on Task {
    id
    fields {
      ...FIELD_VALUE_FRAGMENT
    }
  }
`;
