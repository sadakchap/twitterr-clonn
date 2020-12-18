const { UserInputError } = require("apollo-server");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { JWT_AUTH } = require("../../config");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_AUTH, {
    expiresIn: "1h",
  });
};

module.exports = {
  Query: {
    login: async (_, args) => {
      const { username, password } = args;
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      try {
        const user = await User.findOne({ username });
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
        const token = generateToken({ id: user._id, username: user.username });
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
  },
  Mutation: {
    register: async (_, args) => {
      const {
        registerInput: { username, email, password, confirmPassword, bio },
      } = args;

      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      try {
        const user = await User.findOne({ username });
        if (user) {
          throw new UserInputError("Username is taken!", {
            errors: {
              username: "Username is taken!",
            },
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          bio,
        });
        const savedUser = await newUser.save();
        const token = generateToken({
          id: savedUser._id,
          username: savedUser.username,
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
