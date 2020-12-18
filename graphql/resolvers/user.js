const { UserInputError } = require("apollo-server");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { JWT_AUTH } = require("../../config");

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_AUTH, {
    expiresIn: "1h",
  });
};

module.exports = {
  Mutation: {
    register: async (_, args) => {
      const {
        registerInput: { username, email, password, confirmPassword, bio },
      } = args;
      // valid user Input
      // check for existing user, if exists -> throw err

      // hash the password
      // save the user in db
      // generate a token
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
// bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
//   // result == true
// });
