const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static("public"));

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (path.extname(file) === ".mp3") {
        arrayOfFiles.push(
          path.join(path.relative("public/sounds", dirPath), file)
        );
      }
    }
  });

  return arrayOfFiles;
}

function getFolders(dirPath) {
  const files = fs.readdirSync(dirPath);
  return files.filter((file) =>
    fs.statSync(path.join(dirPath, file)).isDirectory()
  );
}

app.get("/sounds", (req, res) => {
  const soundsDir = path.join(__dirname, "public/sounds");
  const mp3Files = getAllFiles(soundsDir);
  res.json(mp3Files);
});

app.get("/folders", (req, res) => {
  const soundsDir = path.join(__dirname, "public/sounds");
  const folders = getFolders(soundsDir);
  res.json(folders);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
