const jwt = require("jsonwebtoken");

const checkAuthentication = ctx => {
  const Authorization = ctx.request.get("Authorization");

  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const user = jwt.verify(token, process.env.APP_SECRET);

    return user;
  }

  throw new Error("Not authorized");
};

module.exports = checkAuthentication;
