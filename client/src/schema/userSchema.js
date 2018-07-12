import React from "react";
import { Query } from "containers";
import { tasks, jobs } from "./types";
import { ROLES } from "queries";

const fields = {
  read: {
    username: {
      id: "username",
      name: "Username",
      size: 50,
      type: "TEXT",
      path: "username"
    },
    role: {
      id: "role",
      name: "Role",
      size: 50,
      type: "SELECT",
      path: "role.name"
    }
  },
  create: {
    username: {
      id: "username",
      name: "Username",
      size: 33,
      type: "TEXT"
    },
    password: {
      id: "password",
      name: "Password",
      size: 33,
      type: "TEXT"
    },
    role: {
      id: "role",
      name: "Role",
      size: 33,
      type: "SELECT",
      values: [],
      DataQuery: ({ children: render }) => (
        <Query query={ROLES}>
          {({ loading, data: { roles = [] } }) =>
            render({
              values: roles.map(r => ({
                title: r.name,
                value: r.type
              }))
            })
          }
        </Query>
      )
    }
  },
  update: {
    username: {
      id: "username",
      name: "Username",
      size: 50,
      type: "TEXT",
      path: "username"
    },
    role: {
      id: "role",
      name: "Role",
      size: 50,
      type: "SELECT",
      path: "role.type",
      values: [],
      DataQuery: ({ children: render }) => (
        <Query query={ROLES}>
          {({ loading, data: { roles = [] } }) =>
            render({
              values: roles.map(r => ({
                title: r.name,
                value: r.type
              }))
            })
          }
        </Query>
      )
    }
  }
};

const readRelations = {
  tasks,
  jobs
};

const writeRelations = {};

export default {
  write: {
    fields: {
      create: Object.values(fields.create),
      update: Object.values(fields.update)
    },
    relations: Object.values(writeRelations)
  },
  read: {
    fields: {
      read: Object.values(fields.read)
    },
    relations: Object.values(readRelations)
  }
};
