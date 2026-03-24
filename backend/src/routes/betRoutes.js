const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { placeBet } = require("../controllers/betController");

module.exports = (io) => {
  router.post("/", auth, placeBet(io));
  return router;
};
