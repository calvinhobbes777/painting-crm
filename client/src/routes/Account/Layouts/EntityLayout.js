import React, { Component } from "react";

import { message, Progress } from "antd";
import update from "immutability-helper";
import { keyBy, throttle } from "lodash";
import styled from "styled-components";

import { DragDropContext } from "react-dnd";
import { Mutation, Query, DynamicCreateInput } from "containers";
import HTML5Backend from "react-dnd-html5-backend";

import { FIELDS_BY_ENTITY } from "queries";
import { UPDATE_FIELD } from "mutations";
import { INPUT_SIZES, INPUT_SIZE_MAP } from "utilities";

import {
  Button,
  Form,
  FormItem,
  Loader,
  Select,
  SelectOption
} from "components";

import DraggableContainer from "./DraggableContainer";
import DraggableInput from "./DraggableInput";

const ProgressContainer = styled.div`
  position: absolute;
  z-index: 10;
  height: 100%;
  display: ${props => (props.saving ? "flex" : "none")};
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const EnitityLayout = DragDropContext(HTML5Backend)(
  class extends Component {
    state = {
      fields: {},
      progress: {
        current: 0,
        total: 0
      }
    };

    static getDerivedStateFromProps({ fields = {} }, state) {
      if (state.fields && Object.keys(state.fields).length === 0) {
        return {
          fields: keyBy(fields, "id"),
          original: keyBy(fields, "id")
        };
      }

      return {};
    }

    onMove = (d, h) => {
      this.setState(
        state =>
          update(state, {
            fields: {
              [d]: dragged =>
                update(dragged, {
                  order: { $set: state.fields[h].order }
                }),
              [h]: hovered =>
                update(hovered, {
                  order: { $set: state.fields[d].order }
                })
            },
            dragged: { $set: d },
            hovered: { $set: h }
          }),
        () => this.onMoved()
      );
    };

    onHover = throttle(id => {
      this.setState(() => ({ hovered: id }));
    }, 100);

    onDragStart = id => {
      this.setState(() => ({ dragged: id }));
    };

    onMoved = async () =>
      setTimeout(async () => {
        this.setState(state => ({
          dragged: false,
          hovered: false
        }));
      }, 1500);

    onSelectSize = (id, value) => {
      if (value) {
        this.setState(state =>
          update(state, {
            fields: {
              [id]: {
                size: { $set: value }
              }
            }
          })
        );
      }
    };

    onSave = async () => {
      const queue = [];
      const current = this.state.fields;
      const original = keyBy(this.props.fields, "id");

      const keys = Object.keys(current);

      keys.forEach(key => {
        const { size: currentSize, order: currentOrder } = current[key];
        const { size: originalSize, order: originalOrder } = original[key];

        const sizeChanged = currentSize !== originalSize;
        const orderChanged = currentOrder !== originalOrder;

        if (sizeChanged || orderChanged) {
          queue.push(current[key]);
        }
      });

      if (queue.length === 0) return;

      this.setState({
        saving: true,
        current: 0,
        total: queue.length
      });

      const requests = queue.map(field =>
        this.props
          .update({
            id: field.id,
            size: field.size,
            order: field.order
          })
          .then(() => {
            this.setState(state => ({
              current: state.current + 1
            }));
          })
      );

      await Promise.all(requests);

      setTimeout(
        () =>
          this.setState(
            () => ({
              total: 0,
              current: 0,
              saving: false
            }),
            () => {
              message.destroy();
              message.success("Layout updated successfully.");
            }
          ),
        1000
      );
    };

    render() {
      const {
        saving,
        current = 0,
        total = 0,
        dragged,
        hovered,
        fields
      } = this.state;

      return (
        <div style={styles.container}>
          <ProgressContainer saving={saving}>
            <Progress
              type={"circle"}
              percent={parseFloat(((current / total) * 100).toFixed(0))}
              status={current === total && current !== 0 ? "success" : "active"}
            />
          </ProgressContainer>
          <Form disabled={saving}>
            <DraggableContainer>
              {Object.keys(fields)
                .map(key => fields[key])
                .sort((a, b) => a.order - b.order)
                .map(field => {
                  let style = {
                    borderColor: "#e3eaf2"
                  };

                  if (dragged === field.id) {
                    style.borderColor = "#ee5253";
                  } else if (hovered === field.id) {
                    style.borderColor = "#1dd1a1";
                  }

                  const { id, size, name } = field;

                  const fieldSize = INPUT_SIZE_MAP[size].value;

                  return (
                    <DraggableInput
                      {...field}
                      key={id}
                      ratio={fieldSize}
                      onMove={this.onMove}
                      onHover={this.onHover}
                      onDragStart={this.onDragStart}
                      min={`${fieldSize}%`}
                    >
                      <div className={"tool"}>
                        <Select
                          size={"small"}
                          value={size}
                          placeholder={"Size"}
                          onSelect={value => this.onSelectSize(id, value)}
                        >
                          {INPUT_SIZES.map(size => (
                            <SelectOption key={size.value} value={size.value}>
                              {size.label}
                            </SelectOption>
                          ))}
                        </Select>
                      </div>
                      <FormItem
                        key={id}
                        label={name}
                        ratio={fieldSize}
                        min={`${fieldSize}%`}
                        style={{ ...styles.draggable, ...style }}
                      >
                        <DynamicCreateInput
                          {...field}
                          onChange={() => null}
                          value={null}
                        />
                      </FormItem>
                    </DraggableInput>
                  );
                })}
              <FormItem
                ratio={1}
                min={"100%"}
                horizontal={"flex-end"}
                style={{ padding: "30px 0px" }}
              >
                <Button disabled={saving} type="primary" onClick={this.onSave}>
                  {saving ? `Saving..` : "Save"}
                </Button>
              </FormItem>
            </DraggableContainer>
          </Form>
        </div>
      );
    }
  }
);

const styles = {
  container: {
    position: "relative"
  },
  draggable: {
    padding: 20,
    marginBottom: 0,
    border: "2px dashed transparent"
  }
};

export default ({ entity }) => (
  <Mutation mutation={UPDATE_FIELD}>
    {(mutate, { loading: mutationLoading }) => (
      <Query
        query={FIELDS_BY_ENTITY}
        fetchPolicy={"network-only"}
        variables={{ entity }}
      >
        {({ loading: queryLoading, data }) => {
          const { fieldsByEntity = [] } = data;

          return (
            <Loader spinning={queryLoading}>
              <EnitityLayout
                loading={queryLoading}
                saving={mutationLoading}
                fields={fieldsByEntity}
                update={variables => mutate({ variables: variables })}
              />
            </Loader>
          );
        }}
      </Query>
    )}
  </Mutation>
);
