const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_AUTH } = require("../config");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const decodedToken = jwt.verify(token, JWT_AUTH);
        return decodedToken;
      } catch (err) {
        throw new AuthenticationError("Token invalid/expired!");
      }
    }
    throw new AuthenticationError(
      `Token must be provided "Bearer token" format`
    );
  }
  throw new AuthenticationError(`Authorization header is missing!`);
};
