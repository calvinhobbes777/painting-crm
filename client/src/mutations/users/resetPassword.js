import gql from "graphql-tag";

export default gql`
  mutation resetPassword($id: ID, $username: String, $password: String!) {
    resetPassword(id: $id, username: $username, password: $password)
  }
`;
