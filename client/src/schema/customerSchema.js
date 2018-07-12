import React from "react";

import { jobs, tasks, user } from "./types";
import { Query } from "containers";

import { USERS } from "queries";

const fields = {};

const readRelations = {
  jobs,
  tasks,
  salesManager: {
    ...user,
    key: "salesManager",
    label: "Sales Manager",
    relationKey: "salesManager"
  },
  accountExecutive: {
    ...user,
    key: "accountExecutive",
    label: "Account Executive",
    relationKey: "accountExecutive"
  }
};

const query = {
  read: {
    salesManager: {
      id: "salesManager",
      name: "Sales Manager",
      size: 25,
      type: "TEXT",
      path: "salesManager.username"
    },
    accountExecutive: {
      id: "accountExecutive",
      name: "Account Executive",
      size: 25,
      type: "TEXT",
      path: "accountExecutive.username"
    }
  },
  write: {
    accountExecutive: {
      id: "accountExecutive",
      name: "Account Executive",
      size: 25,
      type: "SELECT",
      values: [],
      path: "accountExecutive.id",
      DataQuery: ({ children: render }) => (
        <Query query={USERS}>
          {({ loading, data: { users = [] } }) =>
            render({
              values: users.map(u => ({
                title: u.username,
                value: u.id
              }))
            })
          }
        </Query>
      )
    },
    salesManager: {
      id: "salesManager",
      name: "Sales Manager",
      size: 25,
      type: "SELECT",
      values: [],
      path: "salesManager.id",
      DataQuery: ({ children: render }) => (
        <Query query={USERS}>
          {({ loading, data: { users = [] } }) =>
            render({
              values: users.map(u => ({
                title: u.username,
                value: u.id
              }))
            })
          }
        </Query>
      )
    }
  }
};

const writeRelations = {
  salesManager: {
    ...user,
    key: "salesManager",
    label: "Sales Manager",
    relationKey: "salesManager"
  },
  accountExecutive: {
    ...user,
    key: "accountExecutive",
    label: "Account Executive",
    relationKey: "accountExecutive"
  }
};

export default {
  write: {
    fields: Object.values(fields),
    relations: Object.values(writeRelations)
  },
  read: {
    fields: Object.values(fields),
    relations: Object.values(readRelations)
  },
  query: {
    fields: {
      read: Object.values(query.read),
      write: Object.values(query.write)
    }
  }
};
