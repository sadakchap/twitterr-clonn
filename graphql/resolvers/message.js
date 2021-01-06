const { UserInputError, withFilter } = require("apollo-server");
const Message = require("../../models/Message");
const User = require("../../models/User");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
  Query: {
    getMessages: async (_, { from }, context) => {
      const { user } = checkAuth(context);
      try {
        const otherUser = await User.findOne({ username: from });

        if (!otherUser) {
          throw new UserInputError("User not found");
        }

        const userNameList = [user.username, otherUser.username];
        const messages = await Message.find({
          $and: [
            {
              to: {
                $in: userNameList,
              },
            },
            {
              from: {
                $in: userNameList,
              },
            },
          ],
        }).sort({ createdAt: -1 });

        return messages;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, args, context) => {
      const { user, pubsub } = checkAuth(context);
      const { content, to } = args;
      if (content.trim() === "") {
        throw new UserInputError("Message can't be empty");
      }
      // check the user exists
      try {
        const recipient = await User.findOne({ username: to });
        if (!recipient) {
          throw new UserInputError("User not Found!");
        }
        // check if user is not sending to itself
        if (recipient.username === user.username) {
          throw new UserInputError("God, you are a legend!");
        }
        const message = await new Message({
          content,
          to,
          from: user.username,
        }).save();

        pubsub.publish("NEW_MESSAGE", { newMessage: message });

        return message;
      } catch (err) {
        return err;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, context) => {
          const { pubsub } = checkAuth(context);
          return pubsub.asyncIterator(["NEW_MESSAGE"]);
        },
        ({ newMessage }, _, context) => {
          const { user } = checkAuth(context);
          return (
            newMessage.from === user.username || newMessage.to === user.username
          );
        }
      ),
    },
  },
};
