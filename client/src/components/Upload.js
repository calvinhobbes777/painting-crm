import React from "react";
import { Upload } from "antd";

import styled from "styled-components";

const Dragger = styled(Upload.Dragger)`
  & > .ant-upload.ant-upload-drag {
    margin-top: 4px !important;
  }
`;

export default props => <Dragger {...props} />;
