const mongoose = require("mongoose");

const BetSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  match: String,
  prediction: String,
  odds: Number,
  amount: Number,
  status: {
    type: String,
    enum: ["PENDING", "WON", "LOST"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("Bet", BetSchema);
