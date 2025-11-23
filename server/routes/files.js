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
      const obj = { name: file };
      if (stats.isDirectory()) {
        resArr.push(file + ": directory");
      } else if (stats.isFile()) {
        resArr.push(file + ": file");
      }
    }
    res.status(200).send(resArr);
  } catch (err) {
    res.status(400).send("something went wrong", err);
  }
});

//delete  a file
router.delete("/:username/:fileName", async (req, res) => {
  try {
    const basePath = path.join(
      __dirname,
      "..",
      "public",
      "users",
      req.params.username
    );

    const files = await fs.readdir(basePath);

    const file = files.find((t) => t === req.params.fileName);
    if (!file) {
      return res.status(404).send("File not found");
    }

    const fullPath = path.join(basePath, file);
    await fs.unlink(fullPath);

    res.status(200).send(`Deleted: ${file}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
