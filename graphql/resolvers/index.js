const postResolvers = require("./posts");
const userResolvers = require("./user");
const commentResolvers = require("./comment");

module.exports = {
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
