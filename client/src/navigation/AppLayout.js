import React from "react";
import { Layout } from "antd";

import styled from "styled-components";
import { withRouter } from "react-router-dom";

import {
  DrawerNavigation,
  SubNavigation,
  TopLeftNavigation,
  TopRightNavigation
} from "navigation";

const { Content, Header, Sider } = Layout;

const DrawerContainer = styled(Sider)`
  min-height: 100%;
  background-color: #ffffff;
`;

const TopBarContainer = styled(Header)`
  display: flex;
  padding: 0px !important;
  justify-content: space-between;
`;

const ContentContainer = styled(Content)`
  padding: 0px 20px 20px 20px;
  margin: 0;
`;

const RouteContent = styled(Content)`
  padding: 20px;
  min-height: calc(100vh - 170px);
  background-color: #ffffff;
`;

const LayoutContainer = styled(Layout)`
  max-height: 100vh;
  min-height: 100vh;
`;

const SubNavigationContainer = styled.div`
  top: 0;
  z-index: 1000;
  position: sticky;
  padding-top: 20px;
  background-color: #f0f3f6;
`;

const AppLayout = props => {
  const {
    children,
    location: { pathname }
  } = props;
  const { 1: primary, 2: secondary } = pathname.split("/");

  return (
    <LayoutContainer>
      <TopBarContainer>
        <TopLeftNavigation />
        <TopRightNavigation primary={primary} />
      </TopBarContainer>
      <Layout>
        <DrawerContainer collapsible>
          <DrawerNavigation primary={primary} secondary={secondary} />
        </DrawerContainer>
        <ContentContainer>
          <SubNavigationContainer>
            <SubNavigation primary={primary} secondary={secondary} />
          </SubNavigationContainer>
          <RouteContent>{children}</RouteContent>
        </ContentContainer>
      </Layout>
    </LayoutContainer>
  );
};

export default withRouter(AppLayout);
