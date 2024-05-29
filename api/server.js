const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "../public")));

// API endpoint to get sound folders
app.get("/api/folders", (req, res) => {
  const soundsPath = path.join(__dirname, "../public/sounds");
  fs.readdir(soundsPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading folders");
    }
    const folders = files
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    res.json(folders);
  });
});

// API endpoint to get sound files
app.get("/api/sounds", (req, res) => {
  const soundsPath = path.join(__dirname, "../public/sounds");
  const soundFiles = [];

  const readFilesRecursively = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach((file) => {
      if (file.isDirectory()) {
        readFilesRecursively(path.join(dir, file.name));
      } else if (file.name.endsWith(".mp3")) {
        soundFiles.push(
          path
            .relative(soundsPath, path.join(dir, file.name))
            .replace(/\\/g, "/")
        );
      }
    });
  };

  readFilesRecursively(soundsPath);
  res.json(soundFiles);
});

// Serve the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
