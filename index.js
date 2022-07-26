const express = require("express"),
  app = express(),
  router = express.Router(),
  filesRouter = require("./Routes/filesRouter"),
  port = 3000,
  cors = require("cors");

require("dotenv").config();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  console.log("in get");
  res.status(200).send("isAlive");
});

app.use("/files", filesRouter);

app.listen(process.env.PORT || port, () =>
  console.log(`*** app listening on port ${port}! ***`)
);
