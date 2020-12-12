const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    bio: String,
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
