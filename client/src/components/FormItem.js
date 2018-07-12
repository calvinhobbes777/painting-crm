import React from "react";
import { Form } from "antd";
import styled from "styled-components";

const FormItem = styled(Form.Item)`
  padding-left: 10px !important;
  padding-right: 10px !important;
  flex: ${({ ratio }) => ratio || 1};
  min-width: ${({ min }) => min};
  max-width: ${({ max = "100%" }) => max};
  display: ${({ horizontal, vertical }) =>
    (horizontal || vertical) && "flex !important"};
  flex-direction: ${({ horizontal, vertical }) =>
    (horizontal || vertical) && "column"};
  justify-content: ${({ vertical }) => vertical};
  align-items: ${({ horizontal }) => horizontal};
`;

const defaults = {
  colon: false
};

export default props => <FormItem {...defaults} {...props} />;
