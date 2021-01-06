const { Schema, model } = require("mongoose");

const reactionSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Reaction", reactionSchema);
