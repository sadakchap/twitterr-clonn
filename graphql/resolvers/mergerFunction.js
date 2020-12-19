const Post = require("../../models/Post");
const User = require("../../models/User");

const getUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);
    return {
      ...user._doc,
      id: user._id,
      posts: getPosts.bind(this, user.posts),
    };
  } catch (err) {
    return err;
  }
};

const getPosts = async (postIds) => {
  console.log("why I can't get postIds", postIds);
  try {
    const posts = await Post.find({ _id: { $in: postIds } });
    return posts.map((post) => ({
      ...post._doc,
      id: post._id,
      author: getUser.bind(this, post.author),
    }));
  } catch (err) {
    return err;
  }
};

module.exports = {
  getUser,
  getPosts,
};
