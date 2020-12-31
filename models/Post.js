const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    body: String,
    username: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        username: String,
        createdAt: String,
      },
    ],
    comments: [
      {
        name: String,
        username: String,
        body: String,
        createdAt: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);
