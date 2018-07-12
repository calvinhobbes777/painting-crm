import React from "react";
import { Route, Switch } from "react-router-dom";
import { get } from "lodash";
import { UserContext, RestrictedPage } from "containers";

import New from "./New";
import Edit from "./Edit";
import List from "./List";
import Details from "./Details";
import Search from "./Search";
import ResetPassword from "../Account/Settings/ResetPassword";

const pre = "role.permissions.users";

export default () => (
  <UserContext.Consumer>
    {user => (
      <Switch>
        {get(user, `${pre}.list`) && (
          <Route exact path={"/users"} component={List} />
        )}
        {get(user, `${pre}.create`) && (
          <Route exact path={"/users/new"} component={New} />
        )}
        {get(user, `${pre}.list`) && (
          <Route exact path={"/users/search"} component={Search} />
        )}
        {get(user, `${pre}.update`) && (
          <Route exact path={"/users/:id/edit"} component={Edit} />
        )}
        {get(user, `role.type`) === "ADMINISTRATOR" && (
          <Route
            exact
            path={"/users/:id/reset-password"}
            component={ResetPassword}
          />
        )}
        {get(user, `${pre}.details`) && (
          <Route
            exact
            path={"/users/:id/:thread?/:comment?"}
            component={Details}
          />
        )}
        <Route component={RestrictedPage} />
      </Switch>
    )}
  </UserContext.Consumer>
);
