import "index.css";
import "schema";
import React from "react";
import ReactDOM from "react-dom";

import Router from "routes";
import { GraphQLProvider, registerServiceWorker } from "utilities";

ReactDOM.render(
  <GraphQLProvider>
    <Router />
  </GraphQLProvider>,
  document.getElementById("root")
);

registerServiceWorker();
