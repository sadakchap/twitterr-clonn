const Post = require("../../models/Post");
const { getUser } = require("./mergerFunction");

module.exports = {
  Query: {
    getPosts: async () => {
      const posts = await Post.find();
      return posts.map((post) => ({
        ...post._doc,
        id: post._id,
        author: getUser.bind(this, post._doc.author),
      }));
    },
  },
};