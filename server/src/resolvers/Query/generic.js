const {
  mapSearchValueType,
  mapExtraneousSearchValues
} = require("../../utilities");

const moment = require("moment");

const entity = type => async (parent, args, ctx, info) => {
  try {
    const result = await ctx.db.query[type]({ where: { id: args.id } }, info);
    return result;
  } catch (e) {
    console.log(e);
  }
};

const entities = type => async (parent, args, ctx, info) => {
  const { page = 1, size = 10 } = args;

  return ctx.db.query[`${type}s`](
    { where: {}, skip: (page - 1) * 10, first: size },
    info
  );
};

const entityCount = type => async (parent, args, ctx, info) => {
  const { fields = [], role, value, ...data } = args;

  let query = {};

  if (value) {
    let conditions = [
      { TEXT_contains: value },
      { SELECT_contains: value },
      { LONGTEXT_contains: value },
      { CURRENCY: parseFloat(value) },
      { NUMBER: parseInt(value) }
    ];

    if (moment(new Date(value)).isValid()) {
      conditions.push({
        DATE: moment(new Date(value)).format("YYYY-MM-DD")
      });
    }

    query = {
      fields_some: {
        value: {
          OR: conditions
        }
      },
      ...mapExtraneousSearchValues(data)
    };
  } else if (fields.length > 0) {
    query = {
      AND: fields.map(({ field, value }) => {
        const [key] = Object.keys(value);

        return {
          fields_some: {
            field: {
              id: field
            },
            value: mapSearchValueType({ field, value })
          }
        };
      }),
      ...mapExtraneousSearchValues(data)
    };
  } else {
    query = {
      ...mapExtraneousSearchValues(data)
    };
  }

  if (role) {
    query.role = role;
  }

  const {
    aggregate: { count }
  } = await ctx.db.query[`${type}sConnection`](
    {
      where: query
    },
    `{
        aggregate {
          count
        }
      }`
  );

  return count;
};

const entitySearch = type => async (parent, args, ctx, info) => {
  const { page = 1, size = 10, fields = [], value = false, ...data } = args;
  let query = {};

  if (value) {
    let conditions = [
      { TEXT_contains: value },
      { SELECT_contains: value },
      { LONGTEXT_contains: value },
      { CURRENCY: parseFloat(value) },
      { NUMBER: parseInt(value) }
    ];

    if (moment(new Date(value)).isValid()) {
      conditions.push({
        DATE: moment(new Date(value)).format("YYYY-MM-DD")
      });
    }

    query = {
      fields_some: {
        value: {
          OR: conditions
        }
      },
      ...mapExtraneousSearchValues(data)
    };
  } else if (fields.length > 0) {
    query = {
      AND: fields.map(({ field, value }) => {
        const [key] = Object.keys(value);

        return {
          fields_some: {
            field: {
              id: field
            },
            value: mapSearchValueType({ field, value })
          }
        };
      }),
      ...mapExtraneousSearchValues(data)
    };
  } else {
    query = {
      ...mapExtraneousSearchValues(data)
    };
  }

  return ctx.db.query[`${type}s`](
    {
      where: query,
      skip: (page - 1) * 10,
      first: size
    },
    info
  );
};

module.exports = {
  entity,
  entities,
  entityCount,
  entitySearch
};
