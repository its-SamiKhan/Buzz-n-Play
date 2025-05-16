const board = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");
const startButton = document.getElementById("start-game");
const difficultySelect = document.getElementById("difficulty");

let deck = [];
let gridSize = 4; // Default is 4x4
let revealedCards = [];
let matchedCards = 0;
let timer = null;
let timeElapsed = 0;

// Array of image file paths (Add your personalized images here)
const images = [
   "images/img10.png",
   "images/img11.png",
  "images/img18.png",
  "images/img13.png",
  "images/img20.png",
  "images/img15.png",
  "images/img16.png",
  "images/img17.png",
  "images/img12.png",
  "images/img19.png",
  "images/img14.png",
  "images/img21.png"
];

// Start the game
startButton.addEventListener("click", () => {
  gridSize = parseInt(difficultySelect.value);
  resetGame();
  startTimer();
  initializeBoard();
});

// Reset the game state
function resetGame() {
  clearInterval(timer);
  timer = null;
  timeElapsed = 0;
  timerDisplay.textContent = "Time: 0s";
  matchedCards = 0;
  revealedCards = [];
  deck = [];
  messageDisplay.textContent = "";
}

// Start the timer
function startTimer() {
  timer = setInterval(() => {
    timeElapsed++;
    timerDisplay.textContent = `Time: ${timeElapsed}s`;
  }, 1000);
}

// Initialize the board
function initializeBoard() {
  const totalCards = gridSize * gridSize;
  const numPairs = totalCards / 2;

  // Create a shuffled deck with pairs of images
  const selectedImages = images.slice(0, numPairs);
  deck = [...selectedImages, ...selectedImages].sort(() => Math.random() - 0.5);

  // Set the board grid size
  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  // Create card elements
  board.innerHTML = "";
  deck.forEach((imagePath, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;

    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = "Memory Card";

    card.appendChild(img);
    card.addEventListener("click", () => revealCard(card));
    board.appendChild(card);
  });
}

// Reveal a card
function revealCard(card) {
  const index = card.dataset.index;

  if (revealedCards.length < 2 && !card.classList.contains("revealed")) {
    card.classList.add("revealed");
    revealedCards.push(card);

    if (revealedCards.length === 2) {
      checkMatch();
    }
  }
}

// Check if two revealed cards match
function checkMatch() {
  const [card1, card2] = revealedCards;
  const index1 = card1.dataset.index;
  const index2 = card2.dataset.index;

  if (deck[index1] === deck[index2]) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedCards += 2;

    if (matchedCards === deck.length) {
      endGame();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("revealed");
      card2.classList.remove("revealed");
    }, 1000);
  }

  revealedCards = [];
}

// End the game
function endGame() {
  clearInterval(timer);
  messageDisplay.textContent = `Congratulations! You completed the game in ${timeElapsed}s.`;
}