const { log } = require("console");
const fs = require("fs");
const path = require("path");
const https = require("https"); // or 'https' for https:// URLs

function download(req, res) {
  try {
    let pathParts = req.body.filename.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const fileURL = req.body.filename;
    const stream = fs.createReadStream(fileURL);
    res.set({
      "Content-Disposition": `attachment; filename='${fileName}'`,
      "Content-Type": "application/pdf",
    });
    stream.pipe(res);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
}

function downloadFile(filename) {
  console.log("controller downloadFile", filename);
  let ext = filename.slice(filename.lastIndexOf(".") + 1);

  try {
    https.get("66666.jpeg", (res) => {
      // Image will be stored at this path
      const path = `${__dirname}/myDriveFiles/file.${ext}`;
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on("finish", () => {
        filePath.close();
        console.log("Download Completed");
      });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function createFile(filename, content = "") {
  try {
    if (!isExist(filename)) {
      fs.writeFileSync(filename, content);
    } else {
      throw { status: 500, message: "file already exists" };
    }
  } catch (error) {
    throw error;
  }
}

function readFile(filename) {
  try {
    if (isExist(filename)) {
      return fs.readFileSync(filename, "utf-8");
    } else {
      throw { status: 500, message: "file not found" };
    }
  } catch (error) {
    throw error;
  }
}

function updateFile(filename, content) {
  try {
    if (isExist(filename)) {
      fs.appendFileSync(filename, content);
    } else {
      throw { status: 500, message: "file not found" };
    }
  } catch (error) {
    throw error;
  }
}

function deleteFile(filename) {
  try {
    // console.log("controller deleteFile filename:", filename);
    if (isExist(filename)) {
      // console.log("exists filename:", filename);

      fs.unlinkSync(filename);
    } else {
      // console.log("not exist filename:", filename);

      throw { status: 500, message: "file not found" };
    }
  } catch (error) {
    throw error;
  }
}

function deleteFolder(folderName) {
  try {
    // console.log("controller deleteFile filename:", folderName);
    if (isExist(folderName)) {
      // console.log("exists filename:", folderName);

      fs.rmSync(folderName, { recursive: true, force: true });
    } else {
      // console.log("not exist filename:", folderName);

      throw { status: 500, message: "folder not found" };
    }
  } catch (error) {
    // console.log(error);
    throw error;
  }
}

function saveFile(folder, file) {
  // console.log("controller saveFile folder:", folder, "file", file);
  try {
    if (!isExist(file.originalname)) {
      fs.writeFileSync(`./${folder}/ ${file.originalname}`, file.buffer);
    } else {
      throw { status: 500, message: "file already exists" };
    }
  } catch (error) {
    throw error;
  }
}

function readDirectory(path) {
  const dirContent = [];
  try {
    return getAllFiles(`./${path}`, dirContent);
  } catch (error) {
    // console.log("controller readDirectory error", error);

    throw error;
  }
}

function createFolder(folder) {
  // console.log("controller createFolder", folder);
  try {
    if (!isExist(folder)) fs.mkdirSync(folder);
    else throw { status: 500, message: "folder already exists" };
  } catch (error) {
    // console.log(error);
    throw error;
  }
}

async function rename(oldName, newName) {
  // console.log("controller rename", oldName, newName);
  try {
    if (!isExist(oldName))
      throw { status: 500, message: "source folder not found" };
    if (isExist(newName))
      throw { status: 500, message: "destination folder already exist" };
    fs.renameSync(oldName, newName);
  } catch (error) {
    // console.log("************************************", error);
    throw {
      status: 502,
      message: "Rename not permitted, please check permissions",
    };
  }
}

const getAllFiles = function (dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);
  const fsObj = {};
  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles.push({
        name: file,
        type: "Folder",
        parent: dirPath,
      });
      getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      // console.log("*************", file);
      if (fs.statSync(dirPath + "/" + file).isFile()) {
        arrayOfFiles.push({
          name: file,
          type: "File",
          parent: dirPath,
        });
      }
    }
  });

  return arrayOfFiles;
};

const isExist = (filename) => {
  return fs.existsSync(filename);
};

module.exports = {
  createFile,
  readFile,
  updateFile,
  deleteFile,
  saveFile,
  isExist,
  readDirectory,
  createFolder,
  rename,
  deleteFolder,
  download,
};
