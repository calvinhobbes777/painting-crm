import React from "react";
import { Input } from "antd";

import styled from "styled-components";

const TextArea = styled(Input.TextArea)`
  margin-top: 4px !important;
`;

const defaultProps = {
  autosize: {
    minRows: 4
  }
};

export default props => <TextArea {...defaultProps} {...props} />;
