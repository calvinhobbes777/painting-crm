import React from "react";
import { Mutation } from "containers";

import { CREATE_ROLE } from "mutations";

import NewRoleForm from "./NewRoleForm";

export default ({ history }) => (
  <Mutation
    mutation={CREATE_ROLE}
    onCompleted={() => {
      history.replace("/account/roles");
    }}
  >
    {(mutation, { loading }) => (
      <NewRoleForm
        loading={loading}
        onSubmit={variables => mutation({ variables: variables })}
      />
    )}
  </Mutation>
);
