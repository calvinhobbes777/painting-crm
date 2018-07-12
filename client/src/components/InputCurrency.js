import React from "react";
import { InputNumber } from "antd";

import styled from "styled-components";

const Input = styled(InputNumber)`
  width: 100% !important;
`;

export default props => (
  <Input
    placeholder={name}
    parser={value => value.replace(/\$\s?|(,*)/g, "")}
    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
  />
);
