const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["ADMIN", "DL", "MDL", "SMDL", "USER"],
    default: "USER"
  },
  coins: { type: Number, default: 1000 },
  createdBy: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
