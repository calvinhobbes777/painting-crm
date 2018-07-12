import React from "react";
import { Route, Switch } from "react-router-dom";

import Edit from "./Edit";
import Details from "./Details";
import ResetPassword from "./ResetPassword";

export default () => (
  <Switch>
    <Route exact path={"/account"} component={Details} />
    <Route exact path={"/account/edit"} component={Edit} />
    <Route exact path={"/account/reset-password"} component={ResetPassword} />
  </Switch>
);
