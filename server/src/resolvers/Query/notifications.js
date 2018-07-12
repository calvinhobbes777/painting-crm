const notifications = async (parent, args, ctx, info) => {
  const { page = 1, size = 10, where = {} } = args;
  return ctx.db.query.notifications(
    {
      where,
      skip: (page - 1) * 10,
      first: size,
      orderBy: "createdAt_DESC"
    },
    info
  );
};

const notificationCount = async (parent, args, ctx, info) => {
  const { id = "__default__", username = "__default__" } = args;
  const {
    aggregate: { count }
  } = await ctx.db.query.notificationsConnection(
    {
      where: {
        OR: [
          {
            user: {
              id
            }
          },
          {
            user: {
              username
            }
          }
        ]
      }
    },
    `{
      aggregate {
        count
      }
    }`
  );

  return count;
};

module.exports = {
  notifications,
  notificationCount
};
