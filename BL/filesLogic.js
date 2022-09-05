const filesController = require("../DAL/filesController");

exports.getRootContent = (folder) => {
  //console.log("filesLogic getRootContent");
  return filesController.readDirectory(folder);
};

exports.createFile = (filename, content) => {
  // console.log("filesLogic create");

  filesController.createFile(filename, content);
};

exports.readFile = (filename) => {
  // console.log("filesLogic read");

  return filesController.readFile(filename);
};

exports.downloadFile = (filename) => {
  // console.log("filesLogic downloadFile");

  return filesController.downloadFile(filename);
};

exports.updateFile = (filename, content) => {
  // console.log("filesLogic update");

  filesController.updateFile(filename, content);
};

exports.deleteFile = (filename) => {
  // console.log("filesLogic delete");

  filesController.deleteFile(filename);
};

exports.createFolder = (folderName) => {
  // console.log("filesLogic createFolder");

  filesController.createFolder(folderName);
};

exports.rename = async (oldName, newName) => {
  // console.log("filesLogic rename", oldName, newName);
  try {
    await filesController.rename(oldName, newName);
  } catch (err) {
    // console.log("++++++++++++++++ err", err);
    throw err;
  }
};

exports.deleteFolder = (folderName) => {
  // console.log("filesLogic deleteFolder", folderName);

  filesController.deleteFolder(folderName);
};

exports.uploadFile = (folder, filename) => {
  // console.log("filesLogic upload folder: ", folder, "file", filename);

  filesController.saveFile(folder, filename);
};

const isValidFolder = (folderName = "") => {
  return ["/", "\\", "*", ":", "|", "?", "<", ">", '"'].find((char) =>
    folderName.includes(char) ? false : true
  );
};

const isValidFilename = (filename = "") => {
  return ["/", "\\", "*", ":", "|", "?", "<", ">", '"'].find((char) =>
    filename.includes(char) ? false : true
  );
};

const isValidExtension = (filename = "") => {
  let ext = filename.slice(filename.lastIndexOf(".") + 1);

  // console.log("ext:", ext);
  return [
    "csv",
    "doc",
    "pdf",
    "txt",
    "png",
    "jpg",
    "jpeg",
    "js",
    "html",
    "css",
    "jsx",
    "ts",
    "json",
  ].find((char) => (ext.toLowerCase() == char ? true : false));
};

exports.isValid = (req, res, next) => {
  const filename = req.body.filename;
  // console.log("filename:", filename);
  if (isValidExtension(filename) && isValidFilename(filename)) {
    next();
  } else {
    res.status(455).send("file name or extension not valid");
  }
};

exports.isValidFolderName = (req, res, next) => {
  const folderName = req.body.folderName;
  // console.log("folderName:", folderName);
  if (isValidFolder(folderName)) {
    next();
  } else {
    res.status(455).send("folder name not valid");
  }
};

exports.isValidRename = (req, res, next) => {
  const oldName = req.body.oldName;
  const newName = req.body.newName;
  // console.log("folderName:", folderName);
  if (isValidFilename(oldName) && isValidFilename(newName)) {
    next();
  } else {
    res.status(455).send("folder name not valid for rename");
  }
};
