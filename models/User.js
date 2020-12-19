const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    bio: String,
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    profile_pic: String,
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
