import React from "react";

import moment from "moment";
import styled from "styled-components";
import { Icon } from "components";

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TextContainer = styled.p`
  margin: 0px;
  max-height: 43px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const DynamicTableDetail = ({ type, value }) => {
  switch (type) {
    case "TEXT":
      return (
        <ValueContainer>
          <TextContainer>{value || "-"}</TextContainer>
        </ValueContainer>
      );
    case "LONGTEXT":
      return (
        <ValueContainer>
          <TextContainer>{value || "-"}</TextContainer>
        </ValueContainer>
      );
    case "NUMBER":
      return (
        <ValueContainer>
          <TextContainer>{value || "-"}</TextContainer>
        </ValueContainer>
      );
    case "CURRENCY":
      return (
        <ValueContainer>
          <TextContainer>${value || "-"}</TextContainer>
        </ValueContainer>
      );
    case "SELECT":
      return (
        <ValueContainer>
          <TextContainer>{value || "-"}</TextContainer>
        </ValueContainer>
      );
    case "DATE":
      return (
        <ValueContainer>
          <TextContainer>
            {value
              ? moment(value)
                  .zone("+00:00")
                  .format("MMM. Do, YYYY")
              : "-"}
          </TextContainer>
        </ValueContainer>
      );
    case "YESNO":
      return (
        <ValueContainer>
          <TextContainer>
            {value ? (
              <Icon type={"check"} style={{ color: "#52c41a" }} />
            ) : (
              <Icon type={"close"} style={{ color: "#f5222d" }} />
            )}
          </TextContainer>
        </ValueContainer>
      );
    case "UPLOAD":
      return value ? <Icon type={"check"} /> : null;
    case "UPLOADS":
      return value ? <Icon type={"check"} /> : null;
    default:
      return null;
  }
};

export default DynamicTableDetail;
