const postResolvers = require("./posts");
const userResolvers = require("./user");
const commentResolvers = require("./comment");

module.exports = {
  Post: {
    likesCount: async (parent) => parent.likes.length,
    commentsCount: async (parent) => parent.comments.length,
  },
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
