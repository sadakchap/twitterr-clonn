const User = require("../../models/User");

const getUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);
    return {
      ...user._doc,
      id: user._id,
    };
  } catch (err) {
    return err;
  }
};

module.exports = {
  getUser,
};
