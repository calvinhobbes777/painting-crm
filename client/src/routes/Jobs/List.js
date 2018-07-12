import React from "react";

import { JOBS, JOB_COUNT } from "queries";

import { DynamicTableList } from "containers";

export default ({ history }) => (
  <DynamicTableList
    label={"Jobs"}
    entity={"JOB"}
    operation={JOBS}
    operationKey={"jobs"}
    countOperation={JOB_COUNT}
    countKey={"jobCount"}
    onSelect={r => history.push(`/jobs/${r.id}`)}
  />
);
