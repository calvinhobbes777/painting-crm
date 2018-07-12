import React from "react";

import styled from "styled-components";

import { Card, Divider, Loader } from "components";

import RoleUserCount from "./RoleUserCount";

const RoleUserCardDetail = styled.div`
  flex: 1;
  font-size: 24px;
  font-weight: ${props => (props.bold ? "bold" : undefined)};
  display: flex;
  justify-content: ${props => props.align};
  padding-right: 12px;
`;

const style = {
  display: "flex",
  justifyContent: "space-between"
};

const RoleList = ({ loading, error, roles, onSelect }) => (
  <Loader spinning={loading}>
    {roles.map(role => (
      <div key={role.type}>
        <Card hoverable bodyStyle={style} onClick={() => onSelect(role)}>
          <RoleUserCardDetail align={"flex-start"}>
            {role.name}
          </RoleUserCardDetail>
          <RoleUserCardDetail align={"flex-end"} bold>
            <RoleUserCount type={role.type} />
          </RoleUserCardDetail>
        </Card>
        <Divider />
      </div>
    ))}
  </Loader>
);

export default RoleList;
