const permissions = {
  account: {
    roles: true,
    fields: true,
    layout: true
  },
  jobs: {
    list: true,
    details: true,
    create: true,
    update: true
  },
  users: {
    list: true,
    details: true,
    create: true,
    update: true
  },
  tasks: {
    list: true,
    details: true,
    create: true,
    update: true
  },
  customers: {
    list: true,
    details: true,
    create: true,
    update: true
  }
};

const roles = [
  {
    name: "Administrator",
    type: "ADMINISTRATOR",
    permissions: permissions
  },
  {
    name: "Manager",
    type: "MANAGER",
    permissions: permissions
  },
  {
    name: "Employee",
    type: "EMPLOYEE",
    permissions: permissions
  }
];

module.exports.roles = roles;
module.exports.permissions = permissions;
