const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    content: String,
    to: String,
    from: String,
    reactions: [{ type: Schema.Types.ObjectId, ref: "Reaction" }],
  },
  { timestamps: true }
);

module.exports = model("Message", messageSchema);
