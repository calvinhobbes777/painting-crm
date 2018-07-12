import React from "react";
import { DragSource, DropTarget } from "react-dnd";

import { throttle } from "lodash";

const hover = throttle((props, monitor, component) => {
  const { id: hovered, onHover } = props;
  const { id: dragged } = monitor.getItem() || {};

  if (dragged === hovered) {
    return onHover(false);
  }

  return onHover(hovered);
}, 100);

const cardSource = {
  beginDrag(props) {
    const { id, onDragStart } = props;

    onDragStart(id);

    return {
      ...props
    };
  }
};

const cardTarget = {
  drop(props, monitor, component) {
    const { id: hovered, onMove } = props;
    const { id: dragged } = monitor.getItem();

    onMove(dragged, hovered);
  },
  hover
};

export default DropTarget("INPUT", cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource("INPUT", cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(
    ({
      min,
      ratio,
      children,
      onClick,
      isDragging,
      connectDragSource,
      connectDropTarget
    }) =>
      connectDragSource(
        connectDropTarget(
          <span
            onClick={onClick}
            className={"draggable"}
            style={{ flex: ratio, minWidth: `calc(${min} - 20px)` }}
          >
            {children}
          </span>
        )
      )
  )
);
