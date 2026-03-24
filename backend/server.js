require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// 🔌 Socket.IO setup
const io = require("socket.io")(server, {
  cors: { origin: "*" }
});

// 🗄️ Connect Database
connectDB();

// 🧩 Middlewares
app.use(cors());
app.use(express.json());

// 📡 Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bet", require("./routes/betRoutes")(io));

// 🔌 Socket Connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});


// =======================================
// 🔥 RESULT ENGINE (AUTO SIMULATION)
// =======================================

const Bet = require("./models/Bet");
const User = require("./models/User");

setInterval(async () => {
  try {
    console.log("⏳ Running result engine...");

    const bets = await Bet.find({ status: "PENDING" });

    if (bets.length === 0) {
      console.log("No pending bets");
      return;
    }

    for (let bet of bets) {
      const user = await User.findById(bet.userId);

      if (!user) continue;

      // 🎲 Random result (simulation)
      const isWin = Math.random() > 0.5;

      if (isWin) {
        bet.status = "WON";

        const winnings = bet.amount * bet.odds;
        user.coins += winnings;

        console.log(`✅ User ${user._id} WON ₹${winnings}`);
      } else {
        bet.status = "LOST";

        console.log(`❌ User ${user._id} LOST ₹${bet.amount}`);
      }

      await bet.save();
      await user.save();

      // 📡 Real-time updates
      io.emit("bet:update", bet);
      io.emit("wallet:update", {
        userId: user._id,
        coins: user.coins
      });
    }

  } catch (err) {
    console.error("❌ Result Engine Error:", err.message);
  }

}, 30000); // ⏱️ runs every 30 sec


// =======================================
// 🚀 START SERVER
// =======================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
