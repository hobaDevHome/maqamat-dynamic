let sounds = [];
let currentSound = null;
let audio = null;

fetch("/sounds")
  .then((response) => response.json())
  .then((data) => {
    sounds = data;
  })
  .catch((error) => console.error("Error fetching sound files:", error));

document.getElementById("play").addEventListener("click", () => {
  if (sounds.length > 0) {
    let randomIndex = Math.floor(Math.random() * sounds.length);
    currentSound = sounds[randomIndex];
    playSound(currentSound);
    document.getElementById("sound-name").innerText = "";
  } else {
    console.error("No sounds available");
  }
});

document.getElementById("replay").addEventListener("click", () => {
  if (currentSound) {
    playSound(currentSound);
  }
});

document.getElementById("reveal").addEventListener("click", () => {
  if (currentSound) {
    document.getElementById("sound-name").innerText = currentSound;
  }
});

function playSound(sound) {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  audio = new Audio(`sounds/${sound}`);
  audio.play();
}
