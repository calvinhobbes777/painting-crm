const role = async (parent, args, ctx, info) => {
  const { id, type } = args;

  let query = {};

  if (id) {
    query.id = id;
  }

  if (type) {
    query.type = type;
  }

  const [role] = await ctx.db.query.roles({ where: query }, info);

  return role;
};

const roles = async (parent, args, ctx, info) => {
  return ctx.db.query.roles({ where: {} }, info);
};

module.exports = {
  role,
  roles
};
