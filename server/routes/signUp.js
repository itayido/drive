var express = require("express");
var router = express.Router();
var fs = require("fs").promises;
const app = express();
var path = require("path");

app.use(express.json());

/* POST for Sign Up page */
router.post("/", async function (req, res) {
  try {
    const { username, password, email, name } = req.body;

    if (!username || !password || !email || !name) {
      return res.status(400).json({ message: "All information required" });
    }

    const usersFilePath = path.join(__dirname, "..", "users.json");

    const content = await fs.readFile(usersFilePath, "utf8");
    const users = JSON.parse(content);

    if (users[username]) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newId = Object.keys(users).length + 1;

    users[username] = {
      id: newId,
      email,
      password,
      name,
    };

    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    const basePath = path.join(__dirname, "..", "public", "users", username);
    await fs.mkdir(basePath);

    const basePath1 = path.join(
      __dirname,
      "..",
      "public",
      "users",
      username,
      "new"
    );
    await fs.mkdir(basePath1);

    return res.json({
      id: newId,
      username,
      email,
      name,
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
