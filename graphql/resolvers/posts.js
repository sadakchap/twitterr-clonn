const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth");
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
  Mutation: {
    createPost: async (_, { body }, context) => {
      const user = checkAuth(context);
      const post = new Post({
        body,
        username: user.username,
        author: user.id,
      });
      const newPost = await post.save();
      return {
        ...newPost._doc,
        id: newPost._id,
        author: getUser.bind(this, newPost.author),
      };
    },
  },
};
