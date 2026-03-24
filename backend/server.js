require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" }
});

connectDB();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bet", require("./routes/betRoutes")(io));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
