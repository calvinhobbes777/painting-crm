const { difference, intersection } = require("lodash");

const createField = async (parent, args, ctx, info) => {
  const { values, read, write, entity, ...data } = args;

  const {
    total: { count }
  } = await ctx.db.query.fieldsConnection(
    { where: { entity } },
    `{
      total: aggregate {
        count
      }
    }`
  );

  const field = await ctx.db.mutation.createField({
    data: {
      ...data,
      entity,
      size: 25,
      order: count + 1,
      values: { set: values },
      read: {
        connect: read.map(role => ({
          type: role
        }))
      },
      write: {
        connect: write.map(role => ({
          type: role
        }))
      }
    }
  });

  return await ctx.db.query.field({ where: { id: field.id } }, info);
};

const updateField = async (parent, args, ctx, info) => {
  const { id, values, read, write, name, order, size } = args;

  const relations = {
    read: {},
    write: {}
  };

  if ((read && read.length >= 0) || (write && write.length >= 0)) {
    const current = await ctx.db.query.field(
      { where: { id } },
      "{ id read { type } write { type } }"
    );

    if (read && read.length >= 0) {
      relations.read.connect = difference(
        read,
        current.read.map(r => r.type)
      ).map(type => ({
        type
      }));

      relations.read.disconnect = difference(
        current.read.map(r => r.type),
        read
      ).map(type => ({
        type
      }));
    }

    if (write && write.length >= 0) {
      relations.write.connect = difference(
        write,
        current.write.map(r => r.type)
      ).map(type => ({
        type
      }));
      relations.write.disconnect = difference(
        current.write.map(r => r.type),
        write
      ).map(type => ({
        type
      }));
    }
  }

  console.log({ relations });

  const field = await ctx.db.mutation.updateField({
    where: {
      id
    },
    data: {
      name,
      size,
      order,
      values: { set: values },
      ...relations
    }
  });

  return await ctx.db.query.field({ where: { id: field.id } }, info);
};

module.exports = { createField, updateField };
