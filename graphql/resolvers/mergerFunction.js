const User = require("../../models/User");

const getUser = async (userId) => {
  try {
    const user = await User.findById(userId);
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
