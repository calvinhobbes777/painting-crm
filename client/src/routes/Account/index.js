import React from "react";
import { Route, Switch } from "react-router-dom";

import { UserContext, RestrictedPage } from "containers";
import { get } from "lodash";

import Fields from "./Fields";
import Roles from "./Roles";
import Layouts from "./Layouts";
import Settings from "./Settings";

const pre = "role.permissions.account";

export default () => (
  <UserContext.Consumer>
    {user => (
      <Switch>
        <Route
          path={"/account/fields"}
          component={get(user, `${pre}.fields`) ? Fields : RestrictedPage}
        />
        <Route
          path={"/account/roles"}
          component={get(user, `${pre}.roles`) ? Roles : RestrictedPage}
        />
        <Route
          path={"/account/layout"}
          component={get(user, `${pre}.layout`) ? Layouts : RestrictedPage}
        />
        <Route path={"/account"} component={Settings} />
      </Switch>
    )}
  </UserContext.Consumer>
);
