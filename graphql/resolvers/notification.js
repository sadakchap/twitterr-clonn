const { AuthenticationError, UserInputError } = require("apollo-server");
const User = require("../../models/User");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
  Query: {
    getNotifications: async (_, __, context) => {
      const { user: authUser } = checkAuth(context);
      try {
        const user = await User.findOne({ username: authUser.username });
        if (!user) {
          throw new UserInputError("User not found");
        }

        return user.notifications;
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    markNotificationsRead: async (_, { notificationsIds }, context) => {
      const { user: authUser } = checkAuth(context);

      if (!notificationsIds.length) {
        throw new UserInputError("Bad input, give some notifications ids!");
      }

      try {
        const user = await User.findOne({ username: authUser.username });
        if (!user) {
          throw new UserInputError("User not Found!");
        }

        user.notifications = user.notifications.map((not) => {
          if (notificationsIds.includes(not.id)) {
            not.read = true;
            return not;
          }
          return not;
        });
        // save user
        await user.save();
        return "done!";
      } catch (err) {
        return err;
      }
    },
  },
};
