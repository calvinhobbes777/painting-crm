import React from "react";

import { Card, Icon } from "components";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 240px);
`;

const Title = styled.div`
  font-size: 24px;
`;

const refresh = () => (window.location = window.location);

export default ({ history }) => {
  return (
    <Container>
      <Card
        title={
          <Title>
            <Icon type="frown-o" /> Oops..
          </Title>
        }
        actions={[
          <a onClick={history.goBack}>
            <Icon type="arrow-left" />&nbsp;&nbsp; Back
          </a>,
          <a onClick={refresh}>
            <Icon type="sync" />&nbsp;&nbsp; Refresh
          </a>
        ]}
      >
        <div>We encountered an error processing your request.</div>
        <div>Please contact the administrator if the issue persists.</div>
      </Card>
    </Container>
  );
};
