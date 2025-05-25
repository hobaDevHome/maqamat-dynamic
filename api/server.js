const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// API to get folders
app.get("/api/folders", (req, res) => {
  const soundsPath = path.join(__dirname, "../public/sounds");
  fs.readdir(soundsPath, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).send("Error reading folders");
    const folders = files
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    res.json(folders);
  });
});

// ✅ نقلنا ده برا
app.get("/api/maqam-keys", (req, res) => {
  const keysPath = path.join(__dirname, "../public/maqam-keys");
  fs.readdir(keysPath, (err, files) => {
    if (err) return res.status(500).send("Error reading maqam keys folder");
    const mp3Files = files.filter((file) => file.endsWith(".mp3"));
    res.json(mp3Files);
  });
});

// API to get all mp3s
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

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
