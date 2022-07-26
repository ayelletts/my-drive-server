const express = require("express"),
  app = express(),
  router = express.Router(),
  filesRouter = require("./Routes/filesRouter"),
  port = 3000,
  cors = require("cors");

require("dotenv").config();
app.use(cors());

app.use(express.json());

app.get("/", (res) => {
  console.log("in get");
  res.send("isAlive");
});

app.use("/files", filesRouter);

app.listen(port, () => console.log(`*** app listening on port ${port}! ***`));
