import React from "react";
import { partition } from "lodash";
import { Tabs, TabPane } from "components";

import FieldGroup from "./FieldGroup";

const FieldList = ({ loading, error, entities, fields }) => {
  const { value: key } = entities[0];
  return (
    <Tabs defaultActiveKey={key} tabPosition={"left"}>
      {entities.map(entity => (
        <TabPane tab={entity.value} key={entity.value}>
          {(() => {
            const { [entity.value]: _fields = [] } = fields;
            const [staticFields, dynamicFields] = partition(
              _fields.sort((a, b) => a.order - b.order),
              "static"
            );

            return (
              <div>
                <FieldGroup
                  title={"Standard Fields"}
                  entity={entity}
                  loading={loading}
                  fields={staticFields}
                  key={`static-${entity.value}`}
                />
                <br />
                <br />
                <br />
                <FieldGroup
                  dynamic
                  title={"Custom Fields"}
                  entity={entity}
                  loading={loading}
                  fields={dynamicFields}
                  key={`dynamic-${entity.value}`}
                />
              </div>
            );
          })()}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default FieldList;
