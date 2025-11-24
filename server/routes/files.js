var express = require("express");
var router = express.Router();
var fs = require("fs/promises");
var path = require("path");

// get file's info
router.get("/:username/*/:fileName/info", async (req, res) => {
  try {
    const subPath = req.params[0] || "";

    const fullPath = path.join(
      __dirname,
      "..",
      "public",
      "users",
      req.params.username,
      subPath,
      req.params.fileName
    );

    const stats = await fs.stat(fullPath);

    res.status(200).json({
      sizeBytes: stats.size,
      lastModified: stats.mtime,
      created: stats.birthtime,
    });
  } catch (err) {
    res.status(404).json({ error: "File not found" });
  }
});

router.get("/:username/*/:fileName", async (req, res) => {
  try {
    const { username, fileName } = req.params;
    const subPath = req.params[0] || "";

    const fullPath = path.join(
      __dirname,
      "..",
      "public",
      "users",
      username,
      subPath,
      fileName
    );

    let stats;
    try {
      stats = await fs.stat(fullPath);
    } catch (err) {
      return res
        .status(404)
        .send({ error: "file not found", details: err.message });
    }

    if (stats.isDirectory()) {
      return res.status(400).send({ error: "cannot read the directory" });
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

//get all files
router.get("/:username/*", async (req, res) => {
  try {
    const username = req.params.username;
    const subPath = req.params[0] || "";

    const basePath = path.join(
      __dirname,
      "..",
      "public",
      "users",
      username,
      subPath
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

// delete a file
router.delete("/:username/*/:fileName", async (req, res) => {
  try {
    const username = req.params.username;
    const subPath = req.params[0] || "";
    const fullPath = path.join(
      __dirname,
      "..",
      "public",
      "users",
      username,
      subPath,
      req.params.fileName
    );
    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
      return res.status(200).send(`Deleted directory`);
    }

    if (stats.isFile()) {
      await fs.unlink(fullPath);
      return res.status(200).send(`Deleted file`);
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: "something went wrong", details: err.message });
  }
});

// rename a file
router.put("/:username/*/:fileName", async (req, res) => {
  try {
    const { username, fileName } = req.params;
    const subPath = req.params[0] || "";
    const { newName } = req.body;

    if (!newName || typeof newName !== "string") {
      return res.status(400).json({ error: "Missing or invalid Name" });
    }

    const basePath = path.join(
      __dirname,
      "..",
      "public",
      "users",
      username,
      subPath
    );
    const oldPath = path.join(basePath, fileName);
    const newPath = path.join(basePath, newName);

    await fs.rename(oldPath, newPath);

    res.status(200).json({
      message: "File renamed successfully.",
      oldName: fileName,
      newName: newName,
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      return res.status(404).json({ error: "File not found." });
    }

    res
      .status(500)
      .json({ error: "Could not rename file.", details: err.message });
  }
});

// copy a file
router.post("/:username/:fileName/copy", async (req, res) => {
  try {
    const { username, fileName } = req.params;

    const basePath = path.join(__dirname, "..", "public", "users", username);
    const sourcePath = path.join(basePath, fileName);

    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);

    let copyName = `${name}-copy${ext}`;
    let destPath = path.join(basePath, copyName);

    let counter = 1;
    while (true) {
      try {
        await fs.access(destPath);
        copyName = `${name} - copy (${counter})${ext}`;
        destPath = path.join(basePath, copyName);
        counter++;
      } catch (err) {
        if (err.code === "ENOENT") {
          break;
        }
        throw err;
      }
    }

    await fs.copyFile(sourcePath, destPath);

    res.status(200).json({
      message: "File copied successfully.",
      original: fileName,
      newFile: copyName,
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      return res.status(404).json({ error: "Source file not found." });
    }

    res
      .status(500)
      .json({ error: "Could not copy file.", details: err.message });
  }
});

module.exports = router;
