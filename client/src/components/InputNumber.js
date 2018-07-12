import React from "react";
import { InputNumber } from "antd";

import styled from "styled-components";

const Input = styled(InputNumber)`
  width: 100% !important;
`;

export default props => <Input {...props} />;
