import React from "react";

import { DynamicUpdateForm } from "containers";

import { USER } from "queries";
import { UPDATE_USER } from "mutations";

const getUser = () => {
  const token = localStorage.getItem("token");
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace("-", "+").replace("_", "/");

  return JSON.parse(window.atob(base64));
};

export default ({ history }) => {
  const { id } = getUser();

  return (
    <DynamicUpdateForm
      id={id}
      type={"USER"}
      readKey={"user"}
      readOperation={USER}
      writeOperation={UPDATE_USER}
      customFields={[]}
      onComplete={({ updateUser: { id } }) => {
        if (id) {
          return history.replace(`/account`);
        }

        history.replace("/account");
      }}
    />
  );
};
