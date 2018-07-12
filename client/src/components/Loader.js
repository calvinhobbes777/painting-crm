import React from "react";
import { Spin } from "antd";

import styled from "styled-components";

const Loader = styled(Spin)`
  height: ${props => !props.unstyled && "100%"};
  max-height: ${props => !props.unstyled && "100% !important"};
`;

export default props => <Loader {...props} />;
