const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    body: String,
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
        username: String,
        body: String,
        createdAt: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);
