const { UserInputError } = require("apollo-server");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const { getPosts } = require("./mergerFunction");
const { generateToken, getUniqueUsername } = require("../../utils/authUtils");
const checkAuth = require("../../utils/checkAuth");
const Message = require("../../models/Message");

module.exports = {
  Query: {
    getUsers: async (_, { filter }, context) => {
      const { user } = checkAuth(context);

      try {
        let users = await User.find({
          $and: [
            { username: new RegExp(filter, "i") },
            { _id: { $ne: user.id } },
          ],
        });

        // TODO: make this db call only if lastMessage field is requested
        const allUserMessages = await Message.find({
          $or: [{ to: user.username }, { from: user.username }],
        }).sort({ createdAt: -1 });

        return users.map((otherUser) => {
          const lastMessage = allUserMessages.find(
            (m) => m.to === otherUser.username || m.from === otherUser.username
          );
          const unreadNotifications = otherUser.notifications
            ? otherUser.notifications.filter((not) => not.read === false).length
            : 0;
          return {
            ...otherUser._doc,
            id: otherUser._id,
            posts: getPosts.bind(this, otherUser.posts),
            lastMessage,
            unreadNotifications,
          };
        });

        // return users.map((user) => ({
        //   ...user._doc,
        //   id: user._id,
        //   posts: getPosts.bind(this, user.posts),
        // }));
      } catch (err) {
        return err;
      }
    },
    getUser: async (_, { username }) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new UserInputError("User doesn't exists");
        }
        const unreadNotifications = user.notifications
          ? user.notifications.filter((not) => not.read === false).length
          : 0;

        user.notifications = user.notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return {
          ...user._doc,
          id: user._id,
          posts: getPosts.bind(this, user.posts),
          postsCount: user.posts.length,
          unreadNotifications,
        };
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      try {
        const user = await User.findOne({
          $or: [{ username: username }, { email: username }],
        });
        if (!user) {
          throw new UserInputError("User doesn't exists", {
            errors: {
              username: "User not Found!",
            },
          });
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
          throw new UserInputError("Username & password do not match", {
            errors: {
              username: "Username & password do not match!",
            },
          });
        }
        const token = generateToken({
          id: user._id,
          username: user.username,
          name: user.name,
        });

        const unreadNotifications = user.notifications
          ? user.notifications.filter((not) => not.read === false).length
          : 0;

        return {
          ...user._doc,
          id: user._id,
          token,
          tokenExpiration: 1,
          unreadNotifications,
        };
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      const {
        registerInput: { name, email, password, bio },
      } = args;

      const { valid, errors } = validateRegisterInput(name, email, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      try {
        const user = await User.findOne({ email });
        if (user) {
          throw new UserInputError("Email is taken!", {
            errors: {
              username: "Email is taken!",
            },
          });
        }
        // generate a unique username & hash password
        const username = getUniqueUsername(name);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          name,
          username,
          email,
          password: hashedPassword,
          bio,
        });

        const savedUser = await newUser.save();
        const token = generateToken({
          id: savedUser._id,
          username: savedUser.username,
          name: savedUser.name,
        });

        return {
          ...savedUser._doc,
          id: savedUser._id,
          token,
          tokenExpiration: 1,
          unreadNotifications: 0,
        };
      } catch (err) {
        return err;
      }
    },
    updateUser: async (_, args, context) => {
      const {
        userInput: { name, bio, profile_pic, website, location },
      } = args;

      const { user: authUser } = checkAuth(context);
      try {
        const user = await User.findById(authUser.id);
        if (!user) {
          throw new UserInputError("User not found!");
        }
        user.name = name;
        user.bio = bio;
        user.profile_pic = profile_pic;
        user.website = website;
        user.location = location;

        const updatedUser = await user.save();

        return {
          ...updatedUser._doc,
          id: updatedUser._id,
          posts: getPosts.bind(this, updatedUser.posts),
          postsCount: updatedUser.posts.length,
        };
      } catch (err) {
        return err;
      }
    },
  },
};
