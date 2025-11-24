var express = require("express");
var router = express.Router();
var fs = require("fs").promises;
const app = express();
var path = require("path");

app.use(express.json());

/* POST for login page */
router.post("/", async function (req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const usersFilePath = path.join(__dirname, "..", "users.json");
    const content = await fs.readFile(usersFilePath, "utf8");
    const users = JSON.parse(content);

    const user = users[username];

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.json({
      id: user.id,
      username: username,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
