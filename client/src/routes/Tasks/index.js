import React from "react";
import { Route, Switch } from "react-router-dom";

import { get } from "lodash";
import { UserContext, RestrictedPage } from "containers";

import New from "./New";
import Edit from "./Edit";
import List from "./List";
import Details from "./Details";
import Search from "./Search";

const pre = "role.permissions.tasks";

export default () => (
  <UserContext.Consumer>
    {user => (
      <Switch>
        {get(user, `${pre}.list`) && (
          <Route exact path={"/tasks"} component={List} />
        )}
        {get(user, `${pre}.create`) && (
          <Route exact path={"/tasks/new"} component={New} />
        )}
        {get(user, `${pre}.list`) && (
          <Route exact path={"/tasks/search"} component={Search} />
        )}
        {get(user, `${pre}.update`) && (
          <Route exact path={"/tasks/:id/edit"} component={Edit} />
        )}
        {get(user, `${pre}.details`) && (
          <Route
            exact
            path={"/tasks/:id/:thread?/:comment?"}
            component={Details}
          />
        )}
        <Route component={RestrictedPage} />
      </Switch>
    )}
  </UserContext.Consumer>
);
