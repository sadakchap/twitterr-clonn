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
    notifications: [
      {
        link: String,
        read: {
          type: Boolean,
          default: false,
        },
        verb: String, // liked, commented, tagged
        message: String,
        username: String,
        name: String,
        createdAt: String,
      },
    ],
    profile_pic: String,
    background_pic: String,
    website: String,
    location: String,
    dob: Date,
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
