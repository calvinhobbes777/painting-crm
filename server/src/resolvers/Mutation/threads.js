const createThread = async (parent, args, ctx, info) => {
  const { type, title, author, entity } = args;

  const updateOp = `update${type.charAt(0)}${type.slice(1).toLowerCase()}`;

  const thread = await ctx.db.mutation.createThread(
    {
      data: {
        type,
        title,
        author: {
          connect: {
            id: author
          }
        },
        entity: {
          create: {
            [type]: {
              connect: {
                id: entity
              }
            }
          }
        }
      }
    },
    info
  );

  const connection = await ctx.db.mutation[updateOp](
    {
      where: { id: entity },
      data: {
        threads: {
          connect: {
            id: thread.id
          }
        }
      }
    },
    `{
    id
  }`
  );

  return thread;
};

const updateThread = async (parent, args, ctx, info) => {
  const { id, title } = args;

  return ctx.db.mutation.updateThread(
    {
      where: { id },
      data: {
        title
      }
    },
    info
  );
};

module.exports = { createThread, updateThread };
