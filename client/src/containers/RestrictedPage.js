import React from "react";

import { withRouter } from "react-router-dom";

import { Button, Alert } from "antd";

export default withRouter(({ message, history }) => (
  <div>
    <Alert
      banner
      showIcon
      type={"info"}
      message={"Insufficient Permission"}
      description={
        "The permissions set for this account do not allow access to this page."
      }
    />
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Button
        type={"primary"}
        ghost
        icon={"arrow-left"}
        onClick={history.goBack}
      >
        Go Back
      </Button>
    </div>
  </div>
));
