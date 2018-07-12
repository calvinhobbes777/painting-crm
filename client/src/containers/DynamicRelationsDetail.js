import React from "react";

import { Button, Card } from "components";
import { DynamicRelationsTableList } from "containers";

export default ({
  read = false,
  data = [],
  label,
  entity,
  columnsQty,
  onOpen,
  onRemove,
  onSelect
}) => {
  const selected = data && (data.id || data.length > 0);
  const value = data && (data.id ? [data] : data);

  return (
    <Card
      className={read && "item-detail"}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          {label}
        </div>
      }
      extra={!read && <Button onClick={onOpen}>Select</Button>}
      bodyStyle={{
        textAlign: read && "center",
        padding: read ? 16 : selected ? 8 : 0
      }}
    >
      {read && !selected && `No ${label} Assigned`}
      {selected && (
        <DynamicRelationsTableList
          read={read}
          data={value}
          label={null}
          entity={entity}
          count={data.length}
          columnsQty={columnsQty}
          onRemove={onRemove}
          onSelect={onSelect}
        />
      )}
    </Card>
  );
};
