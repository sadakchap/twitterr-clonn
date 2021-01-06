const { UserInputError, withFilter, ForbiddenError } = require("apollo-server");
const Message = require("../../models/Message");
const Reaction = require("../../models/Reaction");
const User = require("../../models/User");
const checkAuth = require("../../utils/checkAuth");
const { getUser } = require("./mergerFunction");

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
    reactToMessage: async (_, { messageId, content }, context) => {
      const { user, pubsub } = checkAuth(context);
      const reactions = ["❤️", "😍", "😢", "👍", "👎", "😲", "😡", "😂"];
      try {
        if (!reactions.includes(content))
          throw new UserInputError("Invalid reaction");
        // check message
        const message = await Message.findById(messageId);
        if (!message) {
          throw new UserInputError("Message not found!");
        }

        if (user.username !== message.to && user.username !== message.from) {
          throw new ForbiddenError("UnAuthorizied!");
        }

        let reaction = await Reaction.findOne({
          messageId: message.id,
          userId: user.id,
        });
        if (reaction) {
          // update reaction
          reaction.content = content;
          await reaction.save();
        } else {
          reaction = new Reaction({
            content,
            messageId: message.id,
            userId: user.id,
          });
          await reaction.save();
        }

        pubsub.publish("NEW_REACTION", { newReaction: reaction });
        return reaction;
        // return {
        //   ...reaction._doc,
        //   id: reaction._id,
        //   user: getUser.bind(this, reaction.userId),
        // };
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
    newReaction: {
      subscribe: withFilter(
        (_, __, context) => {
          const { pubsub } = checkAuth(context);
          return pubsub.asyncIterator(["NEW_REACTION"]);
        },
        async ({ newReaction }, _, context) => {
          const { user } = checkAuth(context);
          const message = await Message.findById(newReaction.messageId);
          return message.from === user.username || message.to === user.username;
        }
      ),
    },
  },
};
