import React, { Component } from "react";

import { isArray } from "lodash";

import { Query } from "containers";
import gql from "graphql-tag";
import { message } from "antd";
import moment from "moment";

import {
  Checkbox,
  DatePicker,
  Icon,
  Input,
  InputNumber,
  Select,
  SelectOption,
  TextArea,
  Upload
} from "components";

class DynamicInput extends Component {
  onTextInputChange = event => {
    event.persist();

    this.onValueChange(event.target.value);
  };

  onNumericInputChange = value => {
    this.onValueChange(value);
  };

  onDateInputChange = (moment, value) => {
    this.onValueChange(value);
  };

  onBooleanInputChange = event => {
    this.onValueChange(event.target.checked);
  };

  onFileInputChange = value => {
    this.onValueChange(value);
  };

  onSelectInputChange = value => {
    this.onValueChange(value);
  };

  onValueChange = value => {
    this.props.onChange(this.props.id, value);
  };

  render() {
    const { name, type, value, values } = this.props;

    switch (type) {
      case "TEXT":
        return (
          <Input
            value={value}
            placeholder={name}
            onChange={this.onTextInputChange}
          />
        );
      case "LONGTEXT":
        return (
          <TextArea
            value={value}
            placeholder={name}
            onChange={this.onTextInputChange}
          />
        );
      case "NUMBER":
        return (
          <InputNumber
            value={value}
            placeholder={name}
            onChange={this.onNumericInputChange}
          />
        );
      case "CURRENCY":
        return (
          <InputNumber
            value={value}
            placeholder={name}
            onChange={this.onNumericInputChange}
            parser={value => value.replace(/\$\s?|(,*)/g, "")}
            formatter={value =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        );
      case "SELECT":
        return (
          <Select
            value={value}
            placeholder={name}
            onSelect={this.onSelectInputChange}
          >
            {values.map(v => (
              <SelectOption
                key={typeof v === "string" ? v : v.value}
                children={typeof v === "string" ? v : v.title}
                value={typeof v === "string" ? v : v.value}
              />
            ))}
          </Select>
        );
      case "DATE":
        return (
          <DatePicker
            placeholder={name}
            value={value && moment(value).zone("+00:00")}
            onChange={this.onDateInputChange}
          />
        );
      case "YESNO":
        return (
          <Checkbox checked={value} onChange={this.onBooleanInputChange}>
            {name}
          </Checkbox>
        );
      case "UPLOAD":
        return (
          <Uploader
            name={name}
            value={value}
            onChange={this.onFileInputChange}
          />
        );
      case "UPLOADS":
        return (
          <Uploader
            name={name}
            value={value}
            multiple
            onChange={this.onFileInputChange}
          />
        );
      default:
        return null;
    }
  }
}

// const memory = bytes => {
//   const style = {
//     fontSize: 17
//   };

//   const kb = bytes / 1000;

//   if (kb < 1000) {
//     return (
//       <div>
//         <span style={style}>{kb.toFixed(2)}</span> <b>KB</b>
//       </div>
//     );
//   }

//   const mb = kb / 1000;

//   if (mb > 1000) {
//     return (
//       <div>
//         <span style={style}>{mb.toFixed(2)}</span> <b>MB</b>
//       </div>
//     );
//   }

//   const gb = mb / 1000;

//   return (
//     <div>
//       <span style={style}>{gb.toFixed(2)}</span> <b>GB</b>
//     </div>
//   );
// };

class Uploader extends Component {
  state = {
    value: [],
    initial: []
  };

  static getDerivedStateFromProps(props, state) {
    if (state.hydrated) return {};

    let hydrated = false;

    if (!props.value || props.value.length > 0) {
      hydrated = true;
    }

    return {
      hydrated,
      initial: props.value
    };
  }

  onFileUploaded = file => {
    const { multiple, onChange } = this.props;

    this.setState(state => {
      return {
        value: multiple ? [...state.value, file.id] : file.id
      };
    }, () => onChange && onChange(this.state.value));
  };

  render() {
    const { initial } = this.state;
    const { name, multiple = false } = this.props;
    return (
      <div>
        {initial ? (
          isArray(initial) ? (
            initial.map(v => console.log(v) || <FileLink id={v} />)
          ) : (
            <FileLink id={initial} />
          )
        ) : null}

        <Upload
          multiple={multiple}
          listType={"text"}
          action={`${process.env.REACT_APP_GRAPHQL_SERVER_URI}/upload`}
          onChange={info => {
            if (info.file.status === "done") {
              this.onFileUploaded(info.file.response);
            } else if (info.file.status === "error") {
              message.error(`${info.file.name} file upload failed.`);
            }
          }}
        >
          <div style={{ padding: "0px 5px" }}>
            <Icon type="file-add" />&nbsp;
            <small>
              Click or drag files to this area to upload <b>{name}</b>
            </small>
          </div>
        </Upload>
      </div>
    );
  }
}

const FileLink = ({ id }) => (
  <Query
    query={gql`
      query file($id: ID!) {
        file(id: $id) {
          id
          name
          url
        }
      }
    `}
    variables={{ id }}
  >
    {({ loading, data: { file = {} } }) => (
      <a href={file.url} target="_blank" style={{ marginRight: 12 }}>
        <Icon type={"file"} /> {file.name}
      </a>
    )}
  </Query>
);

export default DynamicInput;
