const postResolvers = require("./posts");
const userResolvers = require("./user");
const commentResolvers = require("./comment");
const messageResolvers = require("./message");
const notificationResolvers = require("./notification");

const Message = require("../../models/Message");
const User = require("../../models/User");

module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Post: {
    likesCount: async (parent) => parent.likes.length,
    commentsCount: async (parent) => parent.comments.length,
  },
  Reaction: {
    message: async (parent) => await Message.findById(parent.messageId),
    createdAt: (parent) => parent.createdAt.toISOString(),
    user: async (parent) => await User.findById(parent.userId),
  },
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
    ...messageResolvers.Query,
    ...notificationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...messageResolvers.Mutation,
    ...notificationResolvers.Mutation,
  },
  Subscription: {
    ...messageResolvers.Subscription,
  },
};
