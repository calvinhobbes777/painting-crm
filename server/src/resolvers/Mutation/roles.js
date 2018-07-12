const createRole = async (parent, args, ctx, info) => {
  return ctx.db.mutation.createRole({
    data: {
      ...args,
      permissions: {
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
      }
    }
  });
};

const updateRole = async (parent, args, ctx, info) => {
  const { id, ...data } = args;

  return ctx.db.mutation.updateRole({
    where: { id },
    data: data
  });
};

module.exports = { createRole, updateRole };
