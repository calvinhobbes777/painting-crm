import React from "react";
import { Mutation, Query } from "containers";

import { ROLE } from "queries";
import { UPDATE_ROLE } from "mutations";

import EditRoleForm from "./EditRoleForm";

export default ({
  history,
  match: {
    params: { type }
  }
}) => (
  <Mutation
    mutation={UPDATE_ROLE}
    onCompleted={() => {
      history.replace("/account/roles");
    }}
  >
    {(mutate, { loading: mutationLoading }) => (
      <Query query={ROLE} variables={{ type: type.toUpperCase() }}>
        {({ loading: queryLoading, data: { role } }) => (
          <EditRoleForm
            role={role}
            loading={queryLoading}
            saving={mutationLoading}
            onSubmit={variables =>
              mutate({ variables: { id: role && role.id, ...variables } })
            }
          />
        )}
      </Query>
    )}
  </Mutation>
);
