const { mapSearchValueType, checkAuthentication } = require("../../utilities");

const me = async (parent, args, ctx, info) => {
  const { id } = checkAuthentication(ctx);

  return ctx.db.query.user({ where: { id } }, info);
};

const user = async (parent, args, ctx, info) => {
  const { id, username } = args;

  const [user] = await ctx.db.query.users(
    {
      first: 1,
      where: {
        OR: [
          {
            id: id
          },
          {
            username: username || id
          }
        ]
      }
    },
    info
  );

  return user;
};

module.exports = {
  me,
  user
};
