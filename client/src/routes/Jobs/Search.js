import React from "react";

import { DynamicEntitySearch } from "containers";

import { JOB_SEARCH } from "queries";

export default ({ history }) => (
  <DynamicEntitySearch
    label={"Jobs"}
    entity={"JOB"}
    countKey={"jobCount"}
    operation={JOB_SEARCH}
    operationKey={"jobSearch"}
    onSelect={r => history.push(`/jobs/${r.id}`)}
  />
);
