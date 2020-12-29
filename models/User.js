const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: String,
    bio: String,
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    profile_pic: String,
    background_pic: String,
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
