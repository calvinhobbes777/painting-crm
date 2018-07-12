const Query = require("./Query");
const Mutation = require("./Mutation");
const Subscription = require("./Subscription");
const Payloads = require("./Payloads");

module.exports = {
  Query,
  Mutation,
  Subscription: {
    notification: {
      subscribe: Subscription.notifications
    }
  },
  ...Payloads
};
