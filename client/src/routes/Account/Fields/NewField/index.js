import React from "react";
import { Mutation } from "containers";

import { CREATE_FIELD } from "mutations";

import NewFieldForm from "./NewFieldForm";

export default ({ history }) => (
  <Mutation
    mutation={CREATE_FIELD}
    onCompleted={() => {
      history.replace("/account/fields");
    }}
  >
    {(mutation, { loading }) => (
      <NewFieldForm
        loading={loading}
        onSubmit={variables => mutation({ variables: variables })}
      />
    )}
  </Mutation>
);
