import React from "react";

import withScrolling from "react-dnd-scrollzone";
import styled from "styled-components";

const ScrollingComponent = withScrolling("div");

const ScrollView = styled(ScrollingComponent)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  overflow-y: scroll;
  max-height: calc(100vh - 280px);
  width: 100%;
`;

export default props => <ScrollView>{props.children}</ScrollView>;
