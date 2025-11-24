var express = require("express");
var router = express.Router();
var fs = require("fs/promises");
var path = require("path");

var express = require("express");
var router = express.Router();
var fs = require("fs").promises;
var path = require("path");

//get all files
router.get("/:username", async (req, res) => {
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

      if (stats.isDirectory()) resArr.push({ name: file, type: "directory" });
      if (stats.isFile()) resArr.push({ name: file, type: "file" });
    }

    res.status(200).send(resArr);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send({ error: "Something went wrong", details: err.message });
  }
});

// get file content
router.get("/:username/:fileName", async (req, res) => {
  try {
    const fullPath = path.join(
      __dirname,
      "..",
      "public",
      "users",
      req.params.username,
      req.params.fileName
    );

    let stats;
    try {
      stats = await fs.stat(fullPath);
    } catch {
      return res
        .status(404)
        .send({ error: "file not found", details: err.message });
    }

    if (stats.isDirectory()) {
      return res
        .status(400)
        .send({ error: "cannot read the directory", details: err.message });
    }

    const content = await fs.readFile(fullPath, "utf8");
    res.status(200).send(content);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "Something went wrong", details: err.message });
  }
});

// delete a file
router.delete("/:username/:fileName", async (req, res) => {
  try {
    const fullPath = path.join(
      __dirname,
      "..",
      "public",
      "users",
      req.params.username,
      req.params.fileName
    );

    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
      return res.status(200).send(`Deleted directory: ${fileName}`);
    }

    if (stats.isFile()) {
      await fs.unlink(fullPath);
      return res.status(200).send(`Deleted file: ${fileName}`);
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "Something went wrong", details: err.message });
  }
});

module.exports = router;
