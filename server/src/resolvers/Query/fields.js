const { checkAuthentication } = require("../../utilities");

const fields = async (parent, args, ctx, info) => {
  const { role } = checkAuthentication(ctx);
  const { read = false, write = false } = args;

  const permissions = {};

  if (role && role.id) {
    if (write) {
      permissions.write_some = {
        id_in: [role.id]
      };
      permissions.read_some = {
        id_in: [role.id]
      };
    }

    if (read) {
      permissions.read_some = {
        id_in: [role.id]
      };
    }
  }

  return ctx.db.query.fields(
    {
      where: {
        ...permissions
      }
    },
    info
  );
};

const fieldsByEntity = async (parent, args, ctx, info) => {
  const { role } = checkAuthentication(ctx);
  const { entity, read = false, write = false } = args;

  const permissions = {};

  if (role && role.id) {
    if (write) {
      permissions.write_some = {
        id_in: [role.id]
      };
      permissions.read_some = {
        id_in: [role.id]
      };
    }

    if (read) {
      permissions.read_some = {
        id_in: [role.id]
      };
    }
  }

  return ctx.db.query.fields(
    {
      where: {
        entity,
        ...permissions
      }
    },
    info
  );
};

const field = async (parent, args, ctx, info) => {
  const { role } = checkAuthentication(ctx);
  const { id } = args;

  let roles = [];

  if (role && role.id) {
    roles.push(role.id);
  }

  const [field] = await ctx.db.query.fields(
    {
      where: {
        id,
        write_some: {
          id_in: roles
        }
      }
    },
    info
  );

  return field;
};

module.exports = {
  fields,
  fieldsByEntity,
  field
};
