const Bet = require("../models/Bet");
const User = require("../models/User");

exports.placeBet = (io) => async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.coins < req.body.amount)
    return res.status(400).send("Not enough coins");

  user.coins -= req.body.amount;
  await user.save();

  const bet = await Bet.create({
    ...req.body,
    userId: user._id
  });

  io.emit("wallet:update", user);
  io.emit("bet:update", bet);

  res.send(bet);
};
