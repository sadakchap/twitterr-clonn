const { AuthenticationError, PubSub } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_AUTH } = require("../config");
const pubsub = new PubSub();

module.exports = (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split("Bearer ")[1];
  }
  if (token) {
    try {
      const decodedToken = jwt.verify(token, JWT_AUTH);
      return { user: decodedToken, pubsub };
    } catch (err) {
      throw new AuthenticationError("Token invalid/expired!");
    }
  }
  throw new AuthenticationError(`Authorization header is missing!`);
};
