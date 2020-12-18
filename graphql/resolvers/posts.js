const { UserInputError, AuthenticationError } = require("apollo-server");
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
    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not found!");
        }

        if (user.id !== post.author.toString()) {
          throw new AuthenticationError("Unauthorizied Access Denied!");
        }
        await post.delete();
        return "Post deleted successfully!";
      } catch (err) {
        return err;
      }
    },
  },
};
