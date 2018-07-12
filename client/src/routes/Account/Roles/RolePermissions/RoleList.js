import React from "react";

import { partition } from "lodash";
import { Tabs, TabPane } from "components";

import RoleEntityGroup from "./RoleEntityGroup";

const RoleList = ({ loading, error, roles, fields, entities }) => (
  <Tabs>
    {roles.map(role => (
      <TabPane tab={role.name} key={role.type}>
        <Tabs tabPosition={"left"}>
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
                    <RoleEntityGroup
                      role={role}
                      entity={entity}
                      loading={loading}
                      fields={staticFields}
                      key={`static-${entity.value}`}
                      title={"Standard Fields Permissions"}
                    />
                    <br />
                    <br />
                    <br />
                    <RoleEntityGroup
                      dynamic
                      role={role}
                      entity={entity}
                      loading={loading}
                      fields={dynamicFields}
                      key={`dynamic-${entity.value}`}
                      title={"Custom Fields Permissions"}
                    />
                  </div>
                );
              })()}
            </TabPane>
          ))}
        </Tabs>
      </TabPane>
    ))}
  </Tabs>
);

export default RoleList;
