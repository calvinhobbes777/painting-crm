import React from "react";
import { Route, Switch } from "react-router-dom";

import NewRole from "./NewRole";
import EditRole from "./EditRole";
import RoleList from "./RoleList";
import RolePermissions from "./RolePermissions";

export default () => (
  <Switch>
    <Route exact path={"/account/roles"} component={RoleList} />
    <Route exact path={"/account/roles/new"} component={NewRole} />
    <Route
      exact
      path={"/account/roles/permissions"}
      component={RolePermissions}
    />
    <Route exact path={"/account/roles/:type"} component={EditRole} />
  </Switch>
);
