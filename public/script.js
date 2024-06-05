let sounds = [];
let currentSound = null;
let currentSoundFolder = null;
let audio = null;
let score = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let folderStats = {};

// Fetch folders and populate the dropdown
fetch("/api/folders")
  .then((response) => response.json())
  .then((folders) => {
    const folderSelect = document.getElementById("folder-select");
    folders.forEach((folder) => {
      const option = document.createElement("option");
      option.value = folder;
      option.text = folder;
      option.classList.add("option-item");
      folderSelect.add(option);

      // Initialize folder stats
      folderStats[folder] = { correct: 0, total: 0 };
    });
  })
  .catch((error) => console.error("Error fetching folders:", error));

// Fetch sounds
fetch("/api/sounds")
  .then((response) => response.json())
  .then((data) => {
    sounds = data;
  })
  .catch((error) => console.error("Error fetching sound files:", error));

// Play a random sound
document.getElementById("play").addEventListener("click", () => {
  if (sounds.length > 0) {
    let randomIndex = Math.floor(Math.random() * sounds.length);
    currentSound = sounds[randomIndex];
    let parts = currentSound.split(/[/\\]/); // Handle both forward and backward slashes
    currentSoundFolder = parts[0]; // Extracting the first subfolder
    playSound(currentSound);
    document.getElementById("sound-name").innerText = "Maqam:"; // Resetting the display

    // Reset dropdown menu

    const folderSelect = document.getElementById("folder-select");
    folderSelect.value = "";
    folderSelect.disabled = false;
  } else {
    console.error("No sounds available");
  }
});

// Replay the current sound
document.getElementById("replay").addEventListener("click", () => {
  if (currentSound) {
    playSound(currentSound);
  } else {
    console.error("No sound to replay");
  }
});

// Handle folder selection and check answer
document.getElementById("folder-select").addEventListener("change", (event) => {
  const selectedFolder = event.target.value;
  if (currentSoundFolder) {
    totalQuestions++;
    folderStats[selectedFolder].total++;
    if (selectedFolder === currentSoundFolder) {
      correctAnswers++;
      folderStats[selectedFolder].correct++;
    }
    if (currentSound) {
      stopSound(currentSound);
    }
    updateStats();
    document.getElementById(
      "sound-name"
    ).innerText = `Maqam: ${currentSoundFolder}`;
    event.target.disabled = true;
  }
});

// Reset the game
document.getElementById("reset").addEventListener("click", () => {
  totalQuestions = 0;
  correctAnswers = 0;
  for (let folder in folderStats) {
    folderStats[folder].correct = 0;
    folderStats[folder].total = 0;
  }

  document.getElementById("result").innerText = "0  / 0 ";
  document.getElementById("folder-results").innerHTML = "";
  document.getElementById("sound-name").innerHTML = "Maqam:";
  if (currentSound) {
    stopSound(currentSound);
  }
});

// Play the sound
function playSound(sound) {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  audio = new Audio(`sounds/${sound}`);
  audio.play();
}

function stopSound(sound) {
  console.log("sotp");
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

// Update stats display
function updateStats() {
  document.getElementById(
    "result"
  ).innerText = `${correctAnswers} / ${totalQuestions} `;

  const folderResults = document.getElementById("folder-results");
  folderResults.innerHTML = "";
  for (let folder in folderStats) {
    const stats = folderStats[folder];
    const result = document.createElement("div");
    result.innerText = `${folder} : ${stats.correct}  /  ${stats.total} `;
    result.classList.add("folder-result-line");
    folderResults.appendChild(result);
  }
}
