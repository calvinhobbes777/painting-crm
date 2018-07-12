import React from "react";
import { Icon, Menu } from "antd";

import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { UserContext } from "containers";

import ROUTES from "./routes";

const SideMenu = styled(Menu)`
  height: 100%;
`;

const MenuItem = styled(Menu.Item)``;

const navigateTo = navigate => params => navigate(params.item.props.route);

const DrawerNavigation = ({ primary, secondary, history }) => (
  <UserContext.Consumer>
    {user =>
      user &&
      user.role && (
        <SideMenu
          mode={"inline"}
          defaultOpenKeys={[primary]}
          defaultSelectedKeys={[`${primary}`, `${primary}-${secondary}`]}
          onClick={navigateTo(history.push)}
        >
          {ROUTES(history, user.role.permissions, user).BASE_ROUTES.map(
            ({ icon, key, name, route }) => (
              <MenuItem key={key} route={route}>
                <Icon type={icon} />
                <span>{name}</span>
              </MenuItem>
            )
          )}
        </SideMenu>
      )
    }
  </UserContext.Consumer>
);

export default withRouter(DrawerNavigation);
