const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Helper function to get all files recursively from the sounds folder
function getAllSoundFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllSoundFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.relative("public/sounds", dirPath + "/" + file));
    }
  });

  return arrayOfFiles;
}

// Route to fetch all sound files
app.get("/sounds", (req, res) => {
  const soundsDir = path.join(__dirname, "public", "sounds");
  const allSounds = getAllSoundFiles(soundsDir);
  res.json(allSounds);
});

// Route to fetch all folders
app.get("/folders", (req, res) => {
  const soundsDir = path.join(__dirname, "public", "sounds");
  fs.readdir(soundsDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error("Error reading folders:", err);
      res.status(500).send("Error reading folders");
    } else {
      const folders = files
        .filter((file) => file.isDirectory())
        .map((folder) => folder.name);
      res.json(folders);
    }
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
