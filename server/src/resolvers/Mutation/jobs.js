const { keyBy } = require("lodash");

const createJob = async (parent, args, ctx, info) => {
  const { fields, ...data } = args;

  try {
    const job = await ctx.db.mutation.createJob({
      data: {
        ...data,
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

    return job;
  } catch (e) {
    console.log("e", e);
  }
};

const updateJob = async (parent, args, ctx, info) => {
  const { id, fields, ...data } = args;

  const { fields: _fields } = await ctx.db.query.job(
    { where: { id: args.id } },
    `{
    id
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

  let incoming = [];
  let existing = [];
  const fieldValueMap = keyBy(_fields, "field.id");

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
    const job = await ctx.db.mutation.updateJob({
      where: { id },
      data: {
        ...data,
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

    return job;
  } catch (e) {
    console.log("e", e);
  }
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

module.exports = { createJob, updateJob };
