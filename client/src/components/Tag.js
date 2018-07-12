import React from "react";
import { Tag as AntTag } from "antd";
import styled from "styled-components";

const Tag = styled(AntTag)`
  height: ${props => props.large && "32px !important"};
  line-height: ${props => props.large && "32px !important"};
`;

export default props => <Tag {...props} />;
