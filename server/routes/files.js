var express = require("express");
var router = express.Router();
var fs = require("fs").promises;
var path = require("path");

var express = require("express");
var router = express.Router();
var fs = require("fs").promises;
var path = require("path");

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

      if (stats.isDirectory()) resArr.push(file + ": directory");
      if (stats.isFile()) resArr.push(file + ": file");
    }

    res.status(200).send(resArr);
  } catch (err) {
    console.error(err);
    res.status(400).send("something went wrong");
  }
});

// show file content
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
      return res.status(404).send("File not found");
    }

    if (stats.isDirectory()) {
      return res.status(400).send("Cannot read a directory");
    }

    const content = await fs.readFile(fullPath, "utf8");
    res.status(200).send(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
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

    await fs.unlink(fullPath); // throws if not found
    res.status(200).send(`Deleted: ${req.params.fileName}`);
  } catch (err) {
    if (err.code === "ENOENT") {
      return res.status(404).send("File not found");
    }
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;

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

      if (stats.isDirectory()) resArr.push(file + ": directory");
      if (stats.isFile()) resArr.push(file + ": file");
    }

    res.status(200).send(resArr);
  } catch (err) {
    console.error(err);
    res.status(400).send("something went wrong");
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

    await fs.unlink(fullPath);
    res.status(200).send(`Deleted: ${req.params.fileName}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
