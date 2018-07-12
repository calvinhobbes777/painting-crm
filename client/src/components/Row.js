import React from "react";
import { Row as AntRow } from "antd";

import styled from "styled-components";

const Row = styled(AntRow)`
  flex: 1;
  display: flex !important;
`;

export default props => <Row {...props} />;
