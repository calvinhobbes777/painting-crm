import React from "react";

import { Select } from "antd";

import styled from "styled-components";

import { Button } from "components";

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SelectWithClear = styled(Select)`
  & > div {
    border-right-color: transparent;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`;

const SelectClear = styled.div`
  & > button {
    margin-top: 4px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
`;

export default ({ onClear, ...props }) => {
  if (onClear) {
    return (
      <SelectContainer>
        <SelectWithClear {...props} />
        <SelectClear>
          <Button icon={"close"} onClick={onClear} />
        </SelectClear>
      </SelectContainer>
    );
  }

  return <Select {...props} />;
};
