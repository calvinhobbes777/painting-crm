import React, { Component } from "react";

import moment from "moment";
import {
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Select,
  SelectOption
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
    let { name, type, value = {}, values, ...props } = this.props;

    if (typeof value === "object") {
      value = value[type];
    }

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
          <Input
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
            onClear={props.onClear}
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
            value={value && moment(value)}
            placeholder={name}
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
        return null;
      case "UPLOADS":
        return null;
      default:
        return null;
    }
  }
}

export default DynamicInput;
