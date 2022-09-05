const filesLogic = require("../BL/filesLogic");
const express = require("express"),
  router = express.Router(),
  multer = require("multer");
// upload = multer();
const filesController = require("../DAL/filesController");

const multerFilter = (req, file, cb) => {
  const fileSize = parseInt(req.headers["content-length"]);
  if (fileSize > 300000) {
    req.fileValidationError = "File too big, allowed size up to 300KB";
    return cb(null, false, req.fileValidationError);
  }
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    req.fileValidationError = "Forbidden file type, only pdf allowed";
    return cb(null, false, req.fileValidationError);
  }
};

const upload = multer({
  fileFilter: multerFilter,
  limits: { fileSize: 300000 },
});
//get root content
router.post("/", async (req, res) => {
  // console.log("filesRouter get content folder:", req.body.folder);
  try {
    // const rootContent = filesLogic.getRootContent(req.body.folder);
    const rootContent = filesLogic.getRootContent("root");
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
    const rootContent = filesLogic.getRootContent("root");
    // console.log("filesRouter get content folder:", rootContent);

    if (!rootContent || rootContent.length === 0) {
      res.status(201).send([]);
    } else {
      res.status(200).send(rootContent);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/rename", filesLogic.isValidRename, async (req, res) => {
  // console.log("filesRouter rename");
  try {
    await filesLogic.rename(req.body.oldName, req.body.newName);
    const rootContent = filesLogic.getRootContent("root");
    // console.log("----------------rootContent:", rootContent);

    if (!rootContent || rootContent.length === 0) {
      res.status(201).send([]);
    } else {
      res.status(200).send(rootContent);
    }
  } catch (err) {
    // console.log("err catching ");
    res.status(err.status).send(err.message);
  }
});

router.post("/deleteFolder", filesLogic.isValidFolderName, async (req, res) => {
  // console.log("filesRouter deleteFolder", req.body.folderName);
  try {
    filesLogic.deleteFolder(req.body.folderName);
    const rootContent = filesLogic.getRootContent("root");
    // console.log("filesRouter get content folder:", rootContent);

    if (!rootContent || rootContent.length === 0) {
      res.status(201).send([]);
    } else {
      res.status(200).send(rootContent);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/create", filesLogic.isValid, async (req, res) => {
  // console.log("filesRouter create");
  try {
    filesLogic.createFile(req.body.filename, req.body.content);
    const rootContent = filesLogic.getRootContent("root");
    // console.log("filesRouter get content folder:", rootContent);

    if (!rootContent || rootContent.length === 0) {
      res.status(201).send([]);
    } else {
      res.status(200).send(rootContent);
    }
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
    const rootContent = filesLogic.getRootContent("root");
    // console.log("filesRouter get content folder:", rootContent);

    if (!rootContent || rootContent.length === 0) {
      res.status(201).send([]);
    } else {
      res.status(200).send(rootContent);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/download/", (req, res) => {
  console.log("filesRouter download", req.body);
  const filePath = req.body.filename;

  // res.set({
  //   "Content-Type": "application/octet-stream",
  // });

  res.download(filePath, (err) => {
    if (err) {
      res.send({
        error: err,
        msg: "Problem downloading the file",
      });
    }
  });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  // console.log("filesRouter upload body: ", req.body.filename);
  try {
    if (req.fileValidationError) {
      res.status(550).send(req.fileValidationError);
    } else {
      filesLogic.uploadFile(req.body.folder, req.file);
      const rootContent = filesLogic.getRootContent("root");
      // console.log("filesRouter get content folder:", rootContent);

      if (!rootContent || rootContent.length === 0) {
        res.status(201).send([]);
      } else {
        res.status(200).send(rootContent);
      }
    }
  } catch (err) {
    console.log("filesRouter error", err);
    res.status(500).send(err);
  }
});

module.exports = router;
