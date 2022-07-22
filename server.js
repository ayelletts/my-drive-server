const express = require("express"),
  app = express(),
  router = express.Router(),
  filesRouter = require("./Routes/filesRouter"),
  port = 3000,
  cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/files", filesRouter);
app.listen(port, () => console.log(`*** app listening on port ${port}! ***`));
