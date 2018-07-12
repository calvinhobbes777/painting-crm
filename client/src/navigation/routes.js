export default (history, permissions = {}, user = {}) => {
  const DEFAULT_ROUTES = [
    { key: "tasks", icon: "solution", plural: "Tasks", singular: "Task" },
    { key: "jobs", icon: "schedule", plural: "Jobs", singular: "Job" },
    {
      key: "customers",
      icon: "shop",
      plural: "Customers",
      singular: "Customer"
    },
    { key: "users", icon: "team", plural: "Users", singular: "User" }
  ];

  const DEFAULT_BASE_ROUTES = DEFAULT_ROUTES.map(
    ({ icon, key, plural, hideMenu = false }) => {
      let _route = {
        key,
        icon,
        hideMenu,
        name: plural,
        route: `/${key}`,
        routes: []
      };

      if (permissions[key].list) {
        _route.routes.push({
          icon: "search",
          key: `${key}-search`,
          name: "Search",
          route: `/${key}/search`
        });
      }

      if (permissions[key].create) {
        _route.routes.push({
          icon: "plus-circle-o",
          key: `${key}-new`,
          name: "New",
          route: `/${key}/new`
        });
      }

      return _route;
    }
  );

  const DEFAULT_SUB_ROUTES = DEFAULT_ROUTES.map(
    ({ icon, key, plural, singular }) => {
      let _routes = [];

      if (permissions[key].create) {
        _routes.push({
          key,
          icon: "plus-circle-o",
          name: `New ${singular}`,
          route: `/${key}/new`,
          routes: [
            {
              icon: "close",
              key: `${key}-cancel`,
              name: "Cancel",
              route: `back`
            }
          ]
        });
      }

      if (permissions[key].update) {
        if (user.role.type === "ADMINISTRATOR") {
          _routes.push({
            key: "users",
            icon: "edit",
            name: `Edit User`,
            route: `/users/:id/edit`,
            routes: [
              {
                icon: "lock",
                key: `user-reset-password`,
                name: "Reset Password",
                route: `/users/:id/reset-password`
              },
              {
                icon: "close",
                key: `${key}-cancel`,
                name: "Cancel",
                route: `back`
              }
            ]
          });
        }
        _routes.push({
          key,
          icon: "edit",
          name: `Edit ${singular}`,
          route: `/${key}/:id/edit`,
          routes: [
            {
              icon: "close",
              key: `${key}-cancel`,
              name: "Cancel",
              route: `back`
            }
          ]
        });
      }

      if (permissions[key].list) {
        _routes.push({
          key,
          icon: "search",
          name: `Search ${plural}`,
          route: `/${key}/search`,
          routes: [
            {
              icon: "arrow-left",
              key: `${key}-back`,
              name: "Back",
              route: `back`
            }
          ]
        });
      }

      if (permissions[key].details) {
        let _route_routes = [];

        if (permissions[key].update) {
          _route_routes.push({
            icon: "edit",
            key: `${key}-edit`,
            name: "Edit",
            route: `/${key}/:id/edit`
          });
        }

        _route_routes.push({
          icon: "arrow-left",
          key: `${key}-back`,
          name: "Back",
          route: `back`
        });

        _routes.push({
          key,
          icon,
          name: `${singular} Detail`,
          route: `/${key}/:id/:thread?/:comment?`,
          routes: _route_routes
        });
      }

      return _routes;
    }
  );

  let CUSTOM_ROUTES = [];

  if (
    permissions.jobs.list ||
    permissions.tasks.list ||
    permissions.users.list ||
    permissions.customers.list
  ) {
    CUSTOM_ROUTES.push({
      icon: "search",
      key: "search",
      name: "Search",
      route: "/search",
      routes: []
    });
  }

  let account_route_routes = [
    {
      icon: "form",
      key: "account-edit",
      name: "Edit",
      route: "/account/edit"
    }
  ];

  if (permissions.account.fields) {
    account_route_routes.push({
      icon: "profile",
      key: "account-fields",
      name: "Fields",
      route: "/account/fields"
    });

    CUSTOM_ROUTES = CUSTOM_ROUTES.concat([
      {
        icon: "profile",
        key: "account-fields",
        name: "Fields",
        route: "/account/fields",
        routes: [
          {
            icon: "plus-circle-o",
            key: `account-fields-new`,
            name: "New",
            route: `/account/fields/new`
          },
          {
            icon: "arrow-left",
            key: `account-settings-back`,
            name: "Back",
            route: `back`
          }
        ]
      },

      {
        icon: "plus-circle-o",
        key: "new-account-fields",
        name: "New Field",
        route: "/account/fields/new",
        routes: [
          {
            icon: "arrow-left",
            key: `account-settings-back`,
            name: "Back",
            route: `/account/fields`
          }
        ]
      },
      {
        icon: "form",
        key: "edit-account-fields",
        name: "Edit Field",
        route: "/account/fields/:field_id/edit",
        routes: [
          {
            icon: "close",
            key: `edit-account-fields`,
            name: "Cancel",
            route: `back`
          }
        ]
      }
    ]);
  }

  if (permissions.account.roles) {
    account_route_routes.push({
      icon: "team",
      key: "account-roles",
      name: "Roles",
      route: "/account/roles"
    });

    CUSTOM_ROUTES = CUSTOM_ROUTES.concat([
      {
        icon: "team",
        key: "account-roles",
        name: "Roles",
        route: "/account/roles",
        routes: [
          {
            icon: "key",
            key: `account-roles-permissions`,
            name: "Permissions",
            route: `/account/roles/permissions`
          },
          {
            icon: "plus-circle-o",
            key: `account-roles-new`,
            name: "New",
            route: `/account/roles/new`
          },
          {
            icon: "arrow-left",
            key: `account-settings-back`,
            name: "Back",
            route: `back`
          }
        ]
      },
      {
        icon: "plus-circle-o",
        key: "new-account-roles",
        name: "New Role",
        route: "/account/roles/new",
        routes: [
          {
            icon: "close",
            key: `account-settings-back`,
            name: "Cancel",
            route: `back`
          }
        ]
      },
      {
        icon: "key",
        key: "account-roles-permissions",
        name: "Role Permissions",
        route: "/account/roles/permissions",
        routes: [
          {
            icon: "arrow-left",
            key: `account-settings-back`,
            name: "Back",
            route: `back`
          }
        ]
      },
      {
        icon: "form",
        key: "edit-account-roles",
        name: "Edit Role",
        route: "/account/roles/:type",
        routes: [
          {
            icon: "close",
            key: `account-settings-back`,
            name: "Cancel",
            route: `back`
          }
        ]
      }
    ]);
  }

  if (permissions.account.layout) {
    account_route_routes.push({
      icon: "layout",
      key: "account-layout",
      name: "Layout",
      route: "/account/layout"
    });

    CUSTOM_ROUTES.push({
      icon: "layout",
      key: "account-layout",
      name: "Layout",
      route: "/account/layout",
      routes: [
        {
          icon: "arrow-left",
          key: `account-settings-back`,
          name: "Back",
          route: `back`
        }
      ]
    });
  }

  account_route_routes.push({
    icon: "logout",
    key: "logout",
    name: "Logout",
    route: "/logout"
  });

  CUSTOM_ROUTES.push({
    icon: "user",
    key: "account",
    name: "Account",
    route: "/account",
    routes: account_route_routes
  });

  CUSTOM_ROUTES = CUSTOM_ROUTES.concat([
    {
      icon: "bell",
      key: "notification",
      name: "Notifications",
      route: "/notifications",
      routes: []
    },
    {
      icon: "form",
      key: "account-edit",
      name: "Edit Account",
      route: "/account/edit",
      routes: [
        {
          icon: "lock",
          key: `account-password-reset`,
          name: "Reset Password",
          route: `/account/reset-password`
        },
        {
          icon: "arrow-left",
          key: `account-settings-back`,
          name: "Back",
          route: `back`
        }
      ]
    },
    {
      icon: "lock",
      key: "account-reset-password",
      name: "Reset Password",
      route: "/account/reset-password",
      routes: [
        {
          icon: "arrow-left",
          key: `account-reset-password-back`,
          name: "Back",
          route: `back`
        }
      ]
    }
  ]);

  const SUB_ROUTES = [
    ...CUSTOM_ROUTES,
    ...DEFAULT_SUB_ROUTES,
    ...DEFAULT_BASE_ROUTES
  ].reduce((subRoutes, subRouteGroup) => subRoutes.concat(subRouteGroup), []);

  return {
    SUB_ROUTES,
    BASE_ROUTES: DEFAULT_BASE_ROUTES
  };
};
