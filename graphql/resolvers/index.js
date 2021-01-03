const postResolvers = require("./posts");
const userResolvers = require("./user");
const commentResolvers = require("./comment");
const messageResolvers = require("./message");

module.exports = {
  Post: {
    likesCount: async (parent) => parent.likes.length,
    commentsCount: async (parent) => parent.comments.length,
  },
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
    ...messageResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
};
