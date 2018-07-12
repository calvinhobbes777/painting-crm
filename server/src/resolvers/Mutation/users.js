const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { keyBy } = require("lodash");
const { checkAuthentication } = require("../../utilities");

const generateJWT = ({ ...user }) => jwt.sign(user, process.env.APP_SECRET);

const createUser = async (
  parent,
  { password, role, fields, ...data },
  ctx,
  info
) => {
  password = await bcrypt.hash(password, 10);

  const user = await ctx.db.mutation.createUser({
    data: {
      ...data,
      password,
      role: {
        connect: {
          type: role
        }
      },
      fields: {
        create: fields.map(({ field, value }) => ({
          value: {
            create: mapValue(value)
          },
          field: {
            connect: {
              id: field
            }
          }
        }))
      }
    }
  });

  return {
    user,
    token: generateJWT(user)
  };
};

const updateUser = async (parent, args, ctx, info) => {
  const { id, fields, username, role } = args;

  const [user] = await ctx.db.query.users(
    {
      first: 1,
      where: {
        OR: [{ id: args.id }, { username: args.id }]
      }
    },
    `{
    id
    username
    role {
      type
    }
    fields {
      id
      field {
        id
      }
      value {
        id
      }
    }
  }`
  );

  let updates = {};

  if (username && username !== user.username) {
    updates.username = username;
  }

  if (role && role !== role.type) {
    updates.role = {
      connect: {
        type: role
      }
    };
  }

  let incoming = [];
  let existing = [];
  const fieldValueMap = keyBy(user.fields, "field.id");

  fields.map(
    fieldValue =>
      !fieldValueMap[fieldValue.field]
        ? incoming.push(fieldValue)
        : existing.push(
            Object.assign({
              id: fieldValueMap[fieldValue.field].id,
              ...fieldValue
            })
          )
  );

  try {
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        ...updates,
        fields: {
          create: incoming.map(({ field, value }) => ({
            value: {
              create: mapValue(value)
            },
            field: {
              connect: {
                id: field
              }
            }
          })),
          update: existing.map(
            ({
              id: fieldValueId,
              field,
              value: { id: valueId, ...value }
            }) => ({
              where: { id: fieldValueId },
              data: {
                value: {
                  update: mapValue(value)
                }
              }
            })
          )
        }
      }
    });

    return updatedUser;
  } catch (e) {
    console.log("e", e);
  }
};

const resetPassword = async (parent, args, ctx, info) => {
  let { id, username, password } = args;

  if (!id && !username) {
    const { id: requesterId } = checkAuthentication(ctx);

    id = requesterId;
  }

  const newPassword = await bcrypt.hash(password, 10);

  try {
    const [user] = await ctx.db.query.users(
      {
        first: 1,
        where: {
          OR: [
            {
              id: id
            },
            {
              username: username
            }
          ]
        }
      },
      `{
        id
      }`
    );

    const result = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        password: newPassword
      }
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const authenticateUser = async (parent, { username, password }, ctx, info) => {
  const result = await ctx.db.query.user(
    { where: { username } },
    `
      {
        id
        username
        password
        role {
          id
          type
          name
        }
      }
    `
  );

  if (!result) {
    throw new Error(`No such user found for username: ${username}`);
  }

  const { password: _password, ...user } = result;

  const valid = await bcrypt.compare(password, _password);

  if (!valid) {
    throw new Error("Invalid password");
  }

  return {
    user,
    token: generateJWT(user)
  };
};

const mapValue = map => {
  let value = {};

  Object.keys(map).forEach(key => {
    const val = map[key];

    if (key === "UPLOAD") {
      value[key] = { connect: { id: val } };
    } else if (key === "UPLOADS") {
      value[key] = { connect: val.map(val => ({ id: val })) };
    } else {
      value[key] = val;
    }
  });

  return value;
};

module.exports = { createUser, updateUser, authenticateUser, resetPassword };
