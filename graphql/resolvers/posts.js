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
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not Found!");
        }
        return {
          ...post._doc,
          id: post._id,
          author: getUser.bind(this, post.author),
        };
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Post body can not be Empty!");
      }
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
    updatePost: async (_, { postId, body }, context) => {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Post body can not be Empty!");
      }
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not found!");
        }

        if (user.id !== post.author.toString()) {
          throw new AuthenticationError("Unauthorizied Access Denied!");
        }
        post.body = body;
        const savedPost = await post.save();
        return {
          ...savedPost._doc,
          id: savedPost._id,
          author: getUser.bind(this, savedPost.author),
        };
      } catch (err) {
        return err;
      }
    },
    likePost: async (_, { postId }, context) => {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not Found!");
        }
        // check if user exists in likes array
        // if exists then remove
        // else add
        const isLiked = post.likes.findIndex(
          (like) => like.username === user.username
        );
        if (isLiked < 0) {
          // not found
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString(),
          });
        } else {
          post.likes = post.likes.filter(
            (like) => like.username !== user.username
          );
        }
        const saved = await post.save();
        return {
          ...saved._doc,
          id: saved._id,
          author: getUser.bind(this, saved.author),
        };
      } catch (err) {
        return err;
      }
    },
  },
};
