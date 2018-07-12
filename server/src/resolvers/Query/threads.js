const thread = async (parent, args, ctx, info) => {
  const { id } = args;

  const thread = await ctx.db.query.thread({ where: { id } }, info);

  return thread;
};

const threads = async (parent, args, ctx, info) => {
  return ctx.db.query.threads({ where: {} }, info);
};

module.exports = {
  thread,
  threads
};
