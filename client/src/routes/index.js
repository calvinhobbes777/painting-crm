import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { AppLayout } from "navigation";

import Auth from "./Auth";
import Load from "./Load";
import Logout from "./Logout";
import Login from "./Login";
import Customer from "./Customer";
import Jobs from "./Jobs";
import Tasks from "./Tasks";
import Users from "./Users";
import Account from "./Account";
import Search from "./Search";
import Notifications from "./Notifications";

export default () => (
  <BrowserRouter>
    <Load>
      <Auth
        guest={
          <Switch>
            <Route exact path={"/login"} component={Login} />
            <Redirect to={"/login"} />
          </Switch>
        }
        user={
          <AppLayout>
            <Switch>
              <Route path={"/search"} component={Search} />
              <Route path={"/account"} component={Account} />
              <Route path={"/notifications"} component={Notifications} />
              <Route path={"/customers"} component={Customer} />
              <Route path={"/tasks"} component={Tasks} />
              <Route path={"/jobs"} component={Jobs} />
              <Route path={"/users"} component={Users} />
              <Route path={"/logout"} component={Logout} />
              <Redirect to={"/tasks"} />
            </Switch>
          </AppLayout>
        }
      />
    </Load>
  </BrowserRouter>
);
