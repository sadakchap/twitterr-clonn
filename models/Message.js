const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    content: String,
    to: String,
    from: String,
  },
  { timestamps: true }
);

module.exports = model("Message", messageSchema);
