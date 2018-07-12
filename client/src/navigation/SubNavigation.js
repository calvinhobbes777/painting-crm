import React from "react";

import { Route, Switch, withRouter } from "react-router-dom";
import { Layout, Icon, Menu } from "antd";

import styled from "styled-components";

import ROUTES from "./routes";

import { UserContext } from "containers";

const navigateTo = navigate => (params, id) =>
  navigate(params.item.props.route.replace(":id", id));

const TopBarContainer = styled(Layout.Header)`
  display: flex;
  padding: 0px !important;
  justify-content: space-between;
  background-color: #fff !important;
`;

const TitleContainer = styled.div`
  display: flex;
  line-height: 64px;
  border-bottom: 1px solid #e8e8e8;
  flex: 1;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 200;
  padding: 0px 24px;
`;

const MenuItem = styled(Menu.Item)`
  height: 100%;
  padding: 0 14px;
  align-items: center;
  display: flex !important;
`;

const SubNavigation = ({ primary, secondary, history }) => (
  <UserContext.Consumer>
    {user =>
      user &&
      user.role && (
        <Switch>
          {ROUTES(history, user.role.permissions, user).SUB_ROUTES.map(
            parent =>
              parent.hideMenu ? null : (
                <Route
                  exact
                  key={parent.key}
                  path={parent.route}
                  render={({
                    match: {
                      params: { id }
                    }
                  }) => (
                    <TopBarContainer>
                      <TitleContainer>
                        <Title>
                          <Icon type={parent.icon} />&nbsp;
                          {parent.name}
                        </Title>
                      </TitleContainer>
                      {parent.routes.length > 0 && (
                        <Menu
                          mode={"horizontal"}
                          onClick={params =>
                            params.item.props.route === "back"
                              ? history.goBack()
                              : navigateTo(history.push)(params, id)
                          }
                          defaultOpenKeys={[`_${primary}_`]}
                          defaultSelectedKeys={[
                            !secondary
                              ? `_${primary}_`
                              : `${primary}-${secondary}`
                          ]}
                        >
                          {parent.routes.map(child => (
                            <MenuItem key={child.key} route={child.route}>
                              <Icon type={child.icon} />
                              {child.name}
                            </MenuItem>
                          ))}
                        </Menu>
                      )}
                    </TopBarContainer>
                  )}
                />
              )
          )}
        </Switch>
      )
    }
  </UserContext.Consumer>
);

export default withRouter(SubNavigation);
