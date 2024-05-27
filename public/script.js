let sounds = [];
let currentSound = null;
let currentSoundFolder = null;
let audio = null;
let score = 0;
let totalQuestions = 0;
let correctAnswers = 0;

// Fetch folders and populate the dropdown
fetch("/folders")
  .then((response) => response.json())
  .then((folders) => {
    const folderSelect = document.getElementById("folder-select");
    folders.forEach((folder) => {
      const option = document.createElement("option");
      option.value = folder;
      option.text = folder;
      folderSelect.add(option);
    });

    // Add event listener for folder selection change
    folderSelect.addEventListener("change", () => {
      if (currentSound) {
        totalQuestions++;
        const selectedFolder = folderSelect.value;
        console.log("Selected folder:", selectedFolder); // Debugging log
        console.log("Current sound folder:", currentSoundFolder); // Debugging log

        if (selectedFolder === currentSoundFolder) {
          correctAnswers++;
          score++;
        }
        document.getElementById(
          "sound-name"
        ).innerText = `${currentSoundFolder}`;
        updateResult();
      }
    });
  })
  .catch((error) => console.error("Error fetching folders:", error));

// Fetch sounds
fetch("/sounds")
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
    console.log("Playing sound:", currentSound); // Debugging log
    console.log("Sound folder:", currentSoundFolder); // Debugging log
    playSound(currentSound);
    document.getElementById("sound-name").innerText = ""; // Resetting the display
    document.getElementById("folder-select").value = "";
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

// Reset the game
document.getElementById("reset").addEventListener("click", () => {
  score = 0;
  totalQuestions = 0;
  correctAnswers = 0;
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("result").innerText =
    "0 correct answers out of 0 questions";
  document.getElementById("sound-name").innerText = "";
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

// Update result display
function updateResult() {
  document.getElementById(
    "result"
  ).innerText = `${correctAnswers} / ${totalQuestions}`;
}
