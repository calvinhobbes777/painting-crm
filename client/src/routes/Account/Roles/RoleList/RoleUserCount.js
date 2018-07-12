import React from "react";

import { Loader } from "components";
import { Query } from "containers";

import { USER_COUNT } from "queries";

export default ({ type }) => (
  <Query
    query={USER_COUNT}
    variables={{
      role: {
        type: type
      }
    }}
  >
    {({ loading, data: { userCount } }) => (loading ? <Loader /> : userCount)}
  </Query>
);
