const { Prisma } = require("prisma-binding");
const { uniq } = require("lodash");
const { checkAuthentication } = require("../../utilities");

const db = new Prisma({
  typeDefs: __dirname + "/../../generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false
});

const users = async identifiers => {
  return db.query.users(
    {
      where: {
        OR: [{ id_in: identifiers }, { username_in: identifiers }]
      }
    },
    `{
        id
        username
    }`
  );
};

const create = async (users, title, body, type, entity, link) => {
  const queue = [].concat(users);

  await queue.map(async user => {
    try {
      const notification = await db.mutation.createNotification(
        {
          data: {
            title,
            body,
            type,
            entity,
            link,
            user: {
              connect: {
                id: user.id
              }
            }
          }
        },
        `{ id }`
      );

      return notification;
    } catch (e) {
      console.log(e);
    }
  });

  return true;
};

module.exports.assigned = async (entity, type, assigned = [], delegate) => {
  assigned = await users(Object.values(assigned));
  assigned = assigned.filter(u => u.username !== delegate);
  const link = `/${type.toLowerCase()}s/${entity}`;
  try {
    await create(
      assigned,
      `Assigned to a ${type} `,
      `You were assigned to a ${type} by @${delegate}.`,
      type.toUpperCase(),
      entity,
      link
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports.unassigned = async (entity, type, unassigned = [], delegate) => {
  unassigned = await users(Object.values(unassigned));
  unassigned = unassigned.filter(u => u.username !== delegate);
  const link = `/${type.toLowerCase()}s/${entity}`;
  try {
    await create(
      unassigned,
      `Removed from assigned ${type}`,
      `You were removed from a ${type} by @${delegate}.`,
      type.toUpperCase(),
      entity,
      link
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports.comment = async id => {
  try {
    const comment = await db.query.comment(
      { where: { id } },
      `{
            id
            body
            author {
                id
                username
            }
            thread {
                id
                type
                author {
                    id
                    username
                }
                entity {
                    JOB { id }
                    TASK { id }
                    USER { id }
                    CUSTOMER { id }
                }
            }
        }`
    );

    const linkEntity = comment.thread.type.toLowerCase();
    const linkEntityId = comment.thread.entity[comment.thread.type].id;
    const linkThreadId = comment.thread.id;
    const linkCommentId = comment.id;

    const link = `/${linkEntity}s/${linkEntityId}/${linkThreadId}/${linkCommentId}`;

    const taggedUsernames = uniq(
      comment.body
        .split(" ")
        .filter(str => str.match(/(?:^|\W)@(\w+)(?!\w)/g))
        .map(u => u.split("@").join("")) || []
    );

    const taggedUsers = await users(taggedUsernames);
    const commentAuthor = comment.author.username;
    const threadAuthor = comment.thread.author.username;
    const threadAuthorTagged = taggedUsers.find(
      u => u.username === threadAuthor
    );
    const filteredUsers = taggedUsers.filter(
      u =>
        (threadAuthorTagged && u.username === threadAuthor) ||
        (u.username !== threadAuthor && u.username !== commentAuthor)
    );

    if (!threadAuthorTagged) {
      await create(
        comment.thread.author,
        `New comment`,
        `A new comment was posted by @${
          comment.author.username
        } on a thread you created.`,
        comment.thread.type,
        comment.thread.entity[comment.thread.type].id,
        link
      );
    }

    await create(
      filteredUsers,
      `New mention`,
      `You were mentioned by @${comment.author.username} in a comment.`,
      comment.thread.type,
      comment.thread.entity[comment.thread.type].id,
      link
    );

    return comment;
  } catch (e) {
    console.log(e);
  }
};

module.exports.update = async (parent, args, ctx, info) => {
  const { id, read } = args;

  return ctx.db.mutation.updateNotification(
    {
      where: { id },
      data: {
        read
      }
    },
    info
  );
};

module.exports.markAllAsRead = async (parent, args, ctx, info) => {
  const { id } = checkAuthentication(ctx);

  return ctx.db.mutation.updateManyNotifications(
    {
      where: {
        user: {
          id: id
        }
      },
      data: {
        read: true
      }
    },
    info
  );
};
