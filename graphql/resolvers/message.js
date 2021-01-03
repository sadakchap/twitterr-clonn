const { UserInputError } = require("apollo-server");
const Message = require("../../models/Message");
const User = require("../../models/User");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
  Mutation: {
    sendMessage: async (_, args, context) => {
      const user = checkAuth(context);
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
        const message = new Message({
          content,
          to,
          from: user.username,
        }).save();

        return message;
      } catch (err) {
        return err;
      }
    },
  },
};
