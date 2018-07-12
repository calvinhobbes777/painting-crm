import React from "react";
import { DatePicker } from "antd";

import styled from "styled-components";

const DateInput = styled(DatePicker)`
  width: 100%;
`;

export default props => <DateInput {...props} />;
