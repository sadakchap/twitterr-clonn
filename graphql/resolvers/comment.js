const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth");
const { getUser } = require("./mergerFunction");

module.exports = {
  Mutation: {
    createComment: async (_, args, context) => {
      const user = checkAuth(context);
      const { postId, body } = args;
      if (body.trim() === "") {
        throw new UserInputError("Comment body can not be Empty!");
      }
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not Found!");
        }
        const comment = {
          name: user.name,
          username: user.username,
          body,
          createdAt: new Date().toISOString(),
        };
        post.comments.unshift(comment);
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
    deleteComment: async (_, { postId, commentId }, context) => {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not Found!");
        }
        const commentIdx = post.comments.findIndex(
          (comment) => comment._id.toString() === commentId
        );
        if (commentIdx < 0) {
          // comment doesnt exists
          throw new UserInputError("Comment not Found");
        }
        const comment = post.comments[commentIdx];
        if (comment.username !== user.username) {
          throw new AuthenticationError("Unauthorizied Access Denied!");
        }
        post.comments.splice(commentIdx, 1);
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
