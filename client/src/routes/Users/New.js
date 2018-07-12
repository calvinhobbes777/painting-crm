import React from "react";

import { DynamicCreateForm } from "containers";

import { CREATE_USER } from "mutations";

import { userSchema } from "schema";

export default ({ history }) => (
  <DynamicCreateForm
    type={"USER"}
    operation={CREATE_USER}
    customFields={userSchema.write.fields.create}
    onComplete={({ createUser: { id } }) => {
      if (id) {
        return history.replace(`/users/${id}`);
      }
      history.replace("/users");
    }}
  />
);
