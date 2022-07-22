const filesLogic = require("../BL/filesLogic");
const express = require("express"),
  router = express.Router(),
  multer = require("multer"),
  upload = multer();

//get root content
router.post("/", async (req, res) => {
  // console.log("filesRouter get content folder:", req.body.folder);
  try {
    const rootContent = filesLogic.getRootContent(req.body.folder);
    // console.log("filesRouter get content folder:", rootContent);

    if (!rootContent || rootContent.length === 0) {
      res.status(201).send([]);
    } else {
      res.status(200).send(rootContent);
    }
  } catch (err) {
    console.log("filesRouter get filed error: " + err.message);
    res.status(500).send(err);
  }
});

router.post("/newFolder", filesLogic.isValidFolderName, async (req, res) => {
  // console.log("filesRouter newFolder");
  try {
    filesLogic.createFolder(req.body.folderName);
    res.status(200).send(`Folder ${req.body.folderName} created`);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/rename", filesLogic.isValidRename, async (req, res) => {
  // console.log("filesRouter rename");
  try {
    filesLogic.rename(req.body.oldName, req.body.newName);
    res
      .status(200)
      .send(`Folder ${req.body.oldName} renamed to  ${req.body.newName}`);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/deleteFolder", filesLogic.isValidFolderName, async (req, res) => {
  // console.log("filesRouter deleteFolder", req.body.folderName);
  try {
    filesLogic.deleteFolder(req.body.folderName);
    res.status(200).send(`Folder ${req.body.folderName} deleted`);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/create", filesLogic.isValid, async (req, res) => {
  // console.log("filesRouter create");
  try {
    filesLogic.createFile(req.body.filename, req.body.content);
    res.status(200).send(`File ${req.body.filename} created`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// send file name in body so that it will work with isValid req.body statement
router.get("/read", filesLogic.isValid, async (req, res) => {
  // console.log("filesRouter read req params:", req.body);
  try {
    res.send(filesLogic.readFile(req.body.filename));
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/update", filesLogic.isValid, async (req, res) => {
  // console.log("filesRouter update");
  try {
    filesLogic.updateFile(req.body.filename, req.body.content);
    res.status(200).send(`File ${req.body.filename} updated`);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/delete", filesLogic.isValid, async (req, res) => {
  // console.log("filesRouter delete", req.body.filename);
  try {
    filesLogic.deleteFile(req.body.filename);
    res.status(200).send(`File ${req.body.filename} deleted`);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/download", async (req, res) => {
  console.log("filesRouter download", req.body.filename);
  try {
    // filesLogic.downloadFile(req.body.filename);
    res.status(200).send(`File ${req.body.filename} downloaded`);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  // console.log("filesRouter upload");
  try {
    filesLogic.uploadFile(req.body.folder, req.file);
    res.status(200).send(`File ${req.body.name} uploaded`);
  } catch (err) {
    console.log("filesRouter error", err);
    res.status(500).send(err);
  }
});

module.exports = router;
