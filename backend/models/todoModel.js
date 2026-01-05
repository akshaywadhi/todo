const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    image: {
      url: String,
      public_id: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
