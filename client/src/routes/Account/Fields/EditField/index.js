import React from "react";
import { Mutation, Query } from "containers";

import { FIELD } from "queries";
import { UPDATE_FIELD } from "mutations";

import EditFieldForm from "./EditFieldForm";

export default ({
  history,
  match: {
    params: { field_id }
  }
}) => (
  <Mutation
    mutation={UPDATE_FIELD}
    onCompleted={() => {
      history.replace("/account/fields");
    }}
  >
    {(mutate, { loading: mutationLoading }) => (
      <Query query={FIELD} variables={{ id: field_id }}>
        {({ loading: queryLoading, data: { field } }) => (
          <EditFieldForm
            field={field}
            loading={queryLoading}
            saving={mutationLoading}
            onSubmit={variables => mutate({ variables: variables })}
          />
        )}
      </Query>
    )}
  </Mutation>
);
