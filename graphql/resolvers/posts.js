const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const User = require("../../models/User");
const checkAuth = require("../../utils/checkAuth");
const { getUser } = require("./mergerFunction");

module.exports = {
  Query: {
    getPosts: async () => {
      const posts = await Post.find().sort({ createdAt: -1 });
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
    createPost: async (_, { body, mentionedUsers }, context) => {
      const { user } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Post body can not be Empty!");
      }
      const post = new Post({
        body,
        username: user.username,
        author: user.id,
      });
      try {
        const newPost = await post.save();
        const author = await User.findById(user.id);
        author.posts.push(newPost);
        await author.save();

        if (mentionedUsers && mentionedUsers.length) {
          console.log("comming here");
          // bulk write to users notifications
          const newNotification = {
            link: `/tweet/${post.id}`,
            verb: "tagged", // liked, commented, tagged
            message: `${user.name} mentioned you in their tweet!`,
            username: user.username,
            name: user.name,
            createdAt: new Date().toISOString(),
          };
          const bulkOperations = [];
          mentionedUsers.forEach((mentionedUser) => {
            if (mentionedUser !== user.username) {
              bulkOperations.push({
                updateOne: {
                  filter: { username: mentionedUser },
                  update: { $push: { notifications: newNotification } },
                  upsert: true,
                },
              });
            }
          });
          User.bulkWrite(bulkOperations);
        }

        return {
          ...newPost._doc,
          id: newPost._id,
          author: getUser.bind(this, newPost.author),
        };
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    deletePost: async (_, { postId }, context) => {
      const { user } = checkAuth(context);
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
      const { user } = checkAuth(context);
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
      const { user } = checkAuth(context);
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

          // push notification in post author user model
          if (post.username !== user.username) {
            const postAuthor = await User.findById(post.author);
            if (!postAuthor) {
              throw new UserInputError("WTH, how did it happened!");
            }
            postAuthor.notifications.unshift({
              link: `/tweet/${post.id}`,
              verb: "liked", // liked, commented, tagged
              message: `${user.name} liked your tweet!`,
              username: user.username,
              name: user.name,
              createdAt: new Date().toISOString(),
            });
            postAuthor.save();
          }
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
