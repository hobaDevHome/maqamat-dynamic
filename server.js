const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "temp/" }); // Temporary upload directory

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Endpoint to fetch folders
app.get("/folders", (req, res) => {
  const soundsDir = path.join(__dirname, "sounds");
  fs.readdir(soundsDir, (err, folders) => {
    if (err) {
      console.error("Error reading folders:", err);
      res.status(500).send("Error reading folders");
    } else {
      res.json(folders);
    }
  });
});

// Endpoint to fetch sounds
app.get("/sounds", (req, res) => {
  const soundsDir = path.join(__dirname, "sounds");
  let soundFiles = [];

  const readSounds = (dir) => {
    const subDirs = fs.readdirSync(dir);
    subDirs.forEach((subDir) => {
      const subDirPath = path.join(dir, subDir);
      const files = fs.readdirSync(subDirPath);
      files.forEach((file) => {
        if (path.extname(file) === ".mp3") {
          soundFiles.push(`${subDir}/${file}`);
        }
      });
    });
  };

  readSounds(soundsDir);
  res.json(soundFiles);
});

// Endpoint to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  const subfolder = req.body.subfolder;

  if (file && subfolder) {
    const tempFilePath = file.path;
    const originalFileName = file.originalname;
    const targetFolderPath = path.join(__dirname, `sounds/${subfolder}`);

    // Create subfolder if it doesn't exist
    if (!fs.existsSync(targetFolderPath)) {
      fs.mkdirSync(targetFolderPath, { recursive: true });
    }

    const targetFilePath = path.join(targetFolderPath, originalFileName);

    // Move file to target folder
    fs.renameSync(tempFilePath, targetFilePath, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        res.status(500).send("Error moving file");
      } else {
        console.log("File uploaded successfully");
        res.sendStatus(200);
      }
    });
  } else {
    res.status(400).send("Missing file or subfolder");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
