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
`;

const DynamicDetailItem = ({ name, type, value }) => {
  switch (type) {
    case "TEXT":
      return (
        <ValueContainer>
          <TextContainer>{value}</TextContainer>
        </ValueContainer>
      );
    case "LONGTEXT":
      return (
        <ValueContainer>
          <TextContainer>{value}</TextContainer>
        </ValueContainer>
      );
    case "NUMBER":
      return (
        <ValueContainer>
          <TextContainer>{value}</TextContainer>
        </ValueContainer>
      );
    case "CURRENCY":
      return (
        <ValueContainer>
          <TextContainer>${value}</TextContainer>
        </ValueContainer>
      );
    case "SELECT":
      return (
        <ValueContainer>
          <TextContainer>{value}</TextContainer>
        </ValueContainer>
      );
    case "DATE":
      return (
        <ValueContainer>
          <TextContainer>
            {value &&
              moment(value)
                .zone("+00:00")
                .format("MMM. Do, YYYY")}
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
      return value ? (
        <a href={value.url} target="_blank">
          <Icon type={"file"} /> {value.name}
        </a>
      ) : (
        <center>No file has been uploaded yet.</center>
      );
    case "UPLOADS":
      return value && value.length ? (
        value.map(v => (
          <a href={v.url} target="_blank" style={{ marginRight: 12 }}>
            <Icon type={"file"} /> {v.name}
          </a>
        ))
      ) : (
        <center>No files have been uploaded yet.</center>
      );
    default:
      return null;
  }
};

export default DynamicDetailItem;
