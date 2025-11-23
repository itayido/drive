var express = require("express");
var router = express.Router();
var fs = require("fs").promises;
const app = express();
var path = require("path");

app.use(express.json());

/* GET files page */
router.get("/:username", async function (req, res) {
  try {
    const basePath = path.join(
      __dirname,
      "..",
      "public",
      "users",
      req.params.username
    );
    const files = await fs.readdir(basePath);
    const resArr = [];
    for (const file of files) {
      const fullPath = path.join(basePath, file);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        resArr.push(file + ": directory");
      } else if (stats.isFile()) {
        resArr.push(file + ": file");
      }
    }
    res.send(resArr);
  } catch (err) {
    res.send("something went wrong", err);
  }
});

module.exports = router;
