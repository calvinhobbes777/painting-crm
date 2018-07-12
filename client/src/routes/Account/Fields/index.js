import React from "react";
import { Route, Switch } from "react-router-dom";

import FieldList from "./FieldList";
import NewField from "./NewField";
import EditField from "./EditField";

export default () => (
  <Switch>
    <Route exact path={"/account/fields"} component={FieldList} />
    <Route exact path={"/account/fields/new"} component={NewField} />
    <Route
      exact
      path={"/account/fields/:field_id/edit"}
      component={EditField}
    />
  </Switch>
);
