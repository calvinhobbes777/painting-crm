const notifications = require("./notifications");

const createComment = async (parent, args, ctx, info) => {
  const { body, thread, author } = args;

  const comment = await ctx.db.mutation.createComment(
    {
      data: {
        body,
        thread: {
          connect: {
            id: thread
          }
        },
        author: {
          connect: {
            id: author
          }
        }
      }
    },
    `{
      id
    }`
  );

  notifications.comment(comment.id);

  return comment;
};

const updateComment = async (parent, args, ctx, info) => {
  const { id, body } = args;

  return ctx.db.mutation.updateComment(
    {
      where: { id },
      data: {
        body
      }
    },
    info
  );
};

module.exports = { createComment, updateComment };
