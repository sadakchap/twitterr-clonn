const { UserInputError } = require("apollo-server");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const { getPosts } = require("./mergerFunction");
const { generateToken, getUniqueUsername } = require("../../utils/authUtils");

module.exports = {
  Query: {
    getUsers: async (_, { filter }) => {
      try {
        const users = await User.find({
          username: new RegExp(filter, "i"),
        });
        return users.map((user) => ({
          ...user._doc,
          id: user._id,
          posts: getPosts.bind(this, user.posts),
        }));
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
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
        return {
          id: user._id,
          username: user.username,
          token,
          tokenExpiration: 1,
        };
      } catch (err) {
        return err;
      }
    },
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
          name: savedUser.name, // see if we need this in frontend?
        });
        return {
          ...savedUser._doc,
          id: savedUser._id,
          token,
          tokenExpiration: 1,
        };
      } catch (err) {
        return err;
      }
    },
  },
};
