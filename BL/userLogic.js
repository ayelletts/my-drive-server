const fs = require("fs");

exports.getUsers = () => {
  console.log("userLogic");

  if (fs.existsSync("data/user.json")) {
    const res = fs.readFileSync("data/user.json", "utf-8");
    return res;
  }
};
