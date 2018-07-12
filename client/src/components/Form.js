import React from "react";
import { Form as AntForm } from "antd";
import styled from "styled-components";

const Form = styled(AntForm)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  opacity: ${props => (props.disabled ? 0.95 : 1)} !important;
  transition: opacity 0.25s linear;
  > * {
    pointer-events: ${props => (props.disabled ? "none" : "auto")};
  }
`;

export default props => <Form {...props} />;
