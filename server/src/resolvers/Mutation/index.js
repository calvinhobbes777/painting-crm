const users = require("./users");
const fields = require("./fields");
const roles = require("./roles");
const threads = require("./threads");
const comments = require("./comments");
const notifications = require("./notifications");

const { createEntity, updateEntity } = require("./generic");

module.exports = {
  createJob: createEntity("job", "createJob"),
  updateJob: updateEntity("job", "updateJob"),
  createTask: createEntity("task", "createTask"),
  updateTask: updateEntity("task", "updateTask"),
  createCustomer: createEntity("customer", "createCustomer"),
  updateCustomer: updateEntity("customer", "updateCustomer"),
  updateNotification: notifications.update,
  markAllNotificationsAsRead: notifications.markAllAsRead,
  ...users,
  ...roles,
  ...fields,
  ...threads,
  ...comments
};
