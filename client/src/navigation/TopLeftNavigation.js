import React from "react";
import styled from "styled-components";
const TopMenuLeft = styled.div`
  width: 79px;
  display: flex;
  line-height: 64px;
  background-color: #57aeff;
`;

const Brand = styled.h1`
  color: #ffffff;
  font-size: 24px;
  font-weight: 200;
  width: 200px;
  padding: 0px 24px;
`;

export default () => (
  <TopMenuLeft>
    <Brand>ACI</Brand>
  </TopMenuLeft>
);
