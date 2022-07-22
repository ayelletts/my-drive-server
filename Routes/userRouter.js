const userLogic = require("../userLogic");
const express = require("express"),
  router = express.Router();

router.get("/user", async (req, res) => {
  console.log("userRouter");
  try {
    res.send(userLogic.getUsers());
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
