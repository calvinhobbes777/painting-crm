import React, { Component } from "react";

import { Modal } from "antd";

import { Button, Divider } from "components";
import { DynamicEntitySearch, DynamicRelationsDetail } from "containers";

class DynamicRelationshipInput extends Component {
  state = {
    active: false
  };

  static getDerivedStateFromProps(props, state) {
    const { value } = props;

    return {
      selected: value
    };
  }

  onOpen = () => {
    this.setState(() => ({ active: true }));
  };

  onClose = () => {
    this.setState({ active: false });
  };

  onChange = record => {
    const { multiple, onChange } = this.props;

    this.setState(
      ({ selected }) => ({
        selected: multiple ? { ...selected, [record.id]: record } : record
      }),
      () => {
        const { selected } = this.state;
        const value = multiple ? Object.values(selected) : selected;

        onChange(value);

        if (!this.props.multiple) {
          this.onClose();
        }
      }
    );
  };

  onRemove = record => {
    const { multiple, onChange } = this.props;
    let next = undefined;

    if (multiple) {
      this.state.selected &&
        this.state.selected.forEach(val => {
          if (record.id !== val.id) {
            if (!next) next = {};

            next[val.id] = val;
          }
        });
    }

    this.setState(
      state => ({
        selected: next
      }),
      () => {
        const { selected } = this.state;

        const value = multiple ? Object.values(selected || {}) : selected;

        onChange(value);
      }
    );
  };

  onSelect = record => {
    if (this.props.onSelect) {
      this.props.onSelect(record);
    }
  };

  getColumnCount = size => {
    if (size === 100) {
      return 5;
    } else if (size >= 80) {
      return 4;
    } else if (size <= 40) {
      return 2;
    } else {
      return 3;
    }
  };

  render() {
    const {
      label,
      entity,
      multiple,
      operation,
      operationKey,
      countKey,
      value,
      size
    } = this.props;
    const { active } = this.state;

    return (
      <div>
        <DynamicRelationsDetail
          data={value}
          entity={entity}
          multiple={multiple}
          onOpen={this.onOpen}
          onRemove={this.onRemove}
          onSelect={this.onSelect}
          label={`${label}${multiple ? "s" : ""}`}
          columnsQty={this.getColumnCount(size)}
        />
        <Modal
          width={"90%"}
          footer={null}
          destroyOnClose
          visible={active}
          onCancel={this.onClose}
          title={`Assign ${label}${multiple ? "s" : ""}`}
        >
          <DynamicEntitySearch
            label={label}
            entity={entity}
            countKey={countKey}
            operation={operation}
            operationKey={operationKey}
            onSelect={this.onChange}
          />

          <Divider>
            <Button onClick={this.onClose} type={"primary"}>
              Done
            </Button>
          </Divider>
        </Modal>
      </div>
    );
  }
}

export default DynamicRelationshipInput;
