const notifications = async (parent, { where = {} }, ctx, info) => {
  return ctx.db.subscription.notification(where, info);
};

module.exports = {
  notifications
};
