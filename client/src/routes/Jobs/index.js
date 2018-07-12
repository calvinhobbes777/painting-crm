import React from "react";
import { Route, Switch } from "react-router-dom";

import { get } from "lodash";
import { UserContext, RestrictedPage } from "containers";

import New from "./New";
import Edit from "./Edit";
import List from "./List";
import Details from "./Details";
import Search from "./Search";

const pre = "role.permissions.jobs";

export default () => (
  <UserContext.Consumer>
    {user => (
      <Switch>
        {get(user, `${pre}.list`) && (
          <Route exact path={"/jobs"} component={List} />
        )}
        {get(user, `${pre}.create`) && (
          <Route exact path={"/jobs/new"} component={New} />
        )}
        {get(user, `${pre}.list`) && (
          <Route exact path={"/jobs/search"} component={Search} />
        )}
        {get(user, `${pre}.update`) && (
          <Route exact path={"/jobs/:id/edit"} component={Edit} />
        )}
        {get(user, `${pre}.details`) && (
          <Route
            exact
            path={"/jobs/:id/:thread?/:comment?"}
            component={Details}
          />
        )}
        <Route component={RestrictedPage} />
      </Switch>
    )}
  </UserContext.Consumer>
);
