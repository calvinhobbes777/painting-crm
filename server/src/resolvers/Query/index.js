const fields = require("./fields");
const roles = require("./roles");
const users = require("./users");
const tasks = require("./tasks");
const jobs = require("./jobs");
const customers = require("./customers");
const threads = require("./threads");
const notifications = require("./notifications");

const genericTypes = ["customer", "job", "task", "user", "file"];
const { entity, entities, entityCount, entitySearch } = require("./generic");

const generics = genericTypes
  .map(type => ({
    [`${type}`]: entity(type),
    [`${type}s`]: entities(type),
    [`${type}Count`]: entityCount(type),
    [`${type}Search`]: entitySearch(type)
  }))
  .reduce((val, acc) => Object.assign(acc, val), {});

module.exports = {
  ...generics,
  ...users,
  ...fields,
  ...roles,
  ...threads,
  ...notifications
};
