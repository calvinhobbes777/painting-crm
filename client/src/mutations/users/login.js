import gql from "graphql-tag";

export default gql`
  mutation authenticate($username: String!, $password: String!) {
    authenticateUser(username: $username, password: $password) {
      user {
        username
        role {
          name
          type
        }
      }
      token
    }
  }
`;
