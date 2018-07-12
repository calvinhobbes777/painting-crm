import React, { Component } from "react";

import { message } from "antd";

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
    const { name, type, values } = this.props;

    switch (type) {
      case "TEXT":
        return <Input placeholder={name} onChange={this.onTextInputChange} />;
      case "LONGTEXT":
        return (
          <TextArea placeholder={name} onChange={this.onTextInputChange} />
        );
      case "NUMBER":
        return (
          <InputNumber
            placeholder={name}
            onChange={this.onNumericInputChange}
          />
        );
      case "CURRENCY":
        return (
          <InputNumber
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
          <Select placeholder={name} onSelect={this.onSelectInputChange}>
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
          <DatePicker placeholder={name} onChange={this.onDateInputChange} />
        );
      case "YESNO":
        return <Checkbox onChange={this.onBooleanInputChange}>{name}</Checkbox>;
      case "UPLOAD":
        return <Uploader name={name} onChange={this.onFileInputChange} />;
      case "UPLOADS":
        return (
          <Uploader name={name} multiple onChange={this.onFileInputChange} />
        );
      default:
        return null;
    }
  }
}

class Uploader extends Component {
  state = {
    value: []
  };

  onFileUploaded = file => {
    const { multiple, onChange } = this.props;

    this.setState(state => {
      return {
        value: multiple ? [...state.files, file.id] : file.id
      };
    }, () => onChange && onChange(this.state.value));
  };

  render() {
    const { name, multiple = false } = this.props;
    return (
      <Upload
        multiple={multiple}
        listType={"picture-card"}
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
    );
  }
}

export default DynamicInput;
