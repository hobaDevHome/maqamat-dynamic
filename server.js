const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/sounds", (req, res) => {
  const soundsDir = path.join(__dirname, "public/sounds");
  fs.readdir(soundsDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }
    const mp3Files = files.filter((file) => path.extname(file) === ".mp3");
    res.json(mp3Files);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
