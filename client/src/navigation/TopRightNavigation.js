import React from "react";
import { Icon, Menu } from "antd";

import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { UserContext } from "containers";

const navigateTo = navigate => params => navigate(params.item.props.route);

const MenuContainer = styled(Menu)`
  line-height: 64px;
  padding-right: 12px;
`;

const MenuItem = styled(Menu.Item)`
  height: 100%;
  padding: 0 14px;
  align-items: center;
  display: flex !important;
`;

const MenuItemIcon = styled(Icon)`
  margin-right: 0px !important;
`;

const Username = styled.span`
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  font-weight: 200;
  font-size: 16px;
`;

const TopRightNavigation = ({ primary, history }) => (
  <MenuContainer
    theme={"dark"}
    mode={"horizontal"}
    defaultSelectedKeys={[primary]}
    onClick={navigateTo(history.push)}
  >
    <MenuItem key={"search"} route={"/search"}>
      <MenuItemIcon type="search" />
    </MenuItem>
    <MenuItem key={"notifications"} route={"/notifications"}>
      <MenuItemIcon type="bell" />
    </MenuItem>
    <MenuItem key={"account"} route={"/account"}>
      <MenuItemIcon type="user" />
      <Username>
        <UserContext.Consumer>{user => user.username}</UserContext.Consumer>
      </Username>
    </MenuItem>
  </MenuContainer>
);

export default withRouter(TopRightNavigation);
