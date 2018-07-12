import gql from "graphql-tag";
import { FIELD_VALUE_FRAGMENT, THREAD_FRAGMENT } from "fragments";

export default gql`
  ${FIELD_VALUE_FRAGMENT}
  ${THREAD_FRAGMENT}
  query job($id: ID!) {
    job(id: $id) {
      id
      fields {
        ...FIELD_VALUE_FRAGMENT
      }
      customer {
        id
        fields {
          ...FIELD_VALUE_FRAGMENT
        }
      }
      # users {
      #   id
      #   username
      #   fields {
      #     ...FIELD_VALUE_FRAGMENT
      #   }
      # }
      threads {
        ...THREAD_FRAGMENT
      }
    }
  }
`;
