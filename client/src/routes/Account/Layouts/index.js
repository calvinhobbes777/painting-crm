import React from "react";

import { Tabs, TabPane } from "components";
import { ENTITIES } from "utilities";

import EntityLayout from "./EntityLayout";

const LayoutTabs = () => (
  <Tabs>
    {ENTITIES.map(({ label, value }) => (
      <TabPane key={value} tab={label}>
        <EntityLayout entity={value} />
      </TabPane>
    ))}
  </Tabs>
);

export default LayoutTabs;
