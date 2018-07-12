import React from "react";

import { DynamicUpdateForm } from "containers";

import { USER } from "queries";
import { UPDATE_USER } from "mutations";

import { userSchema } from "schema";

export default ({
  history,
  match: {
    params: { id }
  }
}) => (
  <DynamicUpdateForm
    id={id}
    type={"USER"}
    readKey={"user"}
    readOperation={USER}
    writeOperation={UPDATE_USER}
    customFields={userSchema.write.fields.update}
    onComplete={({ updateUser: { id } }) => {
      if (id) {
        return history.replace(`/users/${id}`);
      }

      history.replace("/users");
    }}
  />
);
