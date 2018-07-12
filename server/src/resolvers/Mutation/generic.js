const { difference, keyBy } = require("lodash");
const notifications = require("./notifications");
const { checkAuthentication } = require("../../utilities");
const moment = require("moment");

const createEntity = (type, operation) => async (parent, args, ctx, info) => {
  const {
    fields,
    user,
    users,
    customer,
    customers,
    task,
    tasks,
    job,
    jobs,
    salesManager,
    accountExecutive,
    ...data
  } = args;

  const relations = [
    { user },
    { users },
    { customer },
    { customers },
    { task },
    { tasks },
    { job },
    { jobs },
    { salesManager },
    { accountExecutive }
  ]
    .map(value => {
      const [key] = Object.keys(value);
      const relation = value[key];

      if (relation) {
        if (relation.length > 0) {
          return {
            [key]: {
              connect: relation.map(rel => ({ id: rel.id }))
            }
          };
        } else if (relation.id) {
          return {
            [key]: {
              connect: {
                id: relation.id
              }
            }
          };
        } else {
          return {};
        }
      } else {
        return {};
      }
    })
    .reduce((value, acc) => Object.assign(acc, value), {});

  try {
    const entity = await ctx.db.mutation[operation]({
      data: {
        ...data,
        ...relations,
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

    return entity;
  } catch (e) {
    console.log("e", e);
  }
};

const updateEntity = (type, operation) => async (parent, args, ctx, info) => {
  const { username } = checkAuthentication(ctx);

  const {
    id,
    fields,
    user,
    users,
    customer,
    customers,
    task,
    tasks,
    job,
    jobs,
    salesManager,
    accountExecutive,
    ...data
  } = args;

  const {
    keys: relationKeys,
    values: relationValues,
    fragment
  } = generateFragment({
    user,
    users,
    customer,
    customers,
    task,
    tasks,
    job,
    jobs,
    salesManager,
    accountExecutive
  });

  const { fields: _fields, ..._data } = await ctx.db.query[type](
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
    ${fragment}
  }`
  );

  console.log(fragment, { _data });

  let relations = {};
  relationKeys.forEach(key => {
    const relation = {};
    const existing = _data[key] || {};
    const incoming = relationValues[key] || {};

    if (existing.length > 0 || incoming.length > 0) {
      const incomingIds = incoming.map(({ id }) => id);
      const existingIds = existing.map(({ id }) => id);

      relation.connect = difference(incomingIds, existingIds).map(id => ({
        id
      }));
      relation.disconnect = difference(existingIds, incomingIds).map(id => ({
        id
      }));
    } else {
      if (incoming.id && existing.id && incoming.id !== existing.id) {
        relation.connect = incoming;
        relation.disconnect = existing;
      } else if (incoming.id && !existing.id) {
        relation.connect = incoming;
      } else if (existing.id && !incoming.id) {
        relation.disconnect = existing;
      }
    }

    if (Object.values(relation).length > 0) {
      relations[key] = relation;
    }
  });

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

  if (relations.user && Object.keys(relations.user.connect || {}).length > 0) {
    notifications.assigned(id, type, relations.user.connect, username || "");
  }

  if (
    relations.user &&
    Object.keys(relations.user.disconnect || {}).length > 0
  ) {
    notifications.unassigned(
      id,
      type,
      relations.user.disconnect,
      username || ""
    );
  }

  console.log(relations);

  try {
    const entity = await ctx.db.mutation[operation]({
      where: { id },
      data: {
        ...data,
        ...relations,
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

    return entity;
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
    } else if (key === "DATE") {
      value[key] = moment(val).format("YYYY-MM-DD");
    } else {
      value[key] = val;
    }
  });

  return value;
};

const generateFragment = relations => {
  let values = {};
  let fragment = ``;
  const keys = Object.keys(relations).filter(key => {
    const value = relations[key];

    return relations[key];
  });

  keys.forEach(key => (values[key] = relations[key]));
  keys.forEach(
    relation => (fragment = fragment.concat(`${relation} {\n  id\n}\n`))
  );

  return {
    keys,
    values,
    fragment
  };
};

module.exports = { createEntity, updateEntity };
