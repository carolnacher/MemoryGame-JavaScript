// Import utility functions and the scoring system
import { shuffle } from './utils.js';
import { levels } from './levels.js';
import {
  incrementMoves,
  resetScore,
  startTimer,
  stopTimer,
  getScore,
  getMoves,
  getTime
} from './scoreSystem.js';

// Select the grid container from the DOM
const grid = document.querySelector('.grid');

// Game state variables to controle the game.
let currentLevel = levels.easy;  // Default difficulty level: easy
let firstCard = null;            // First selected card
let secondCard = null;           // Second selected card
let lockBoard = false;           // Prevents further clicks while checking cards
let gameStarted = false;         // To track if the game has started (to start timer)

// Sets the current game level when a new level is selected.
export function setCurrentLevel(level) {
  currentLevel = level;
}

// this function Sets up and resets the game board
export function setupGame() {
  resetScore();            // here Reset moves and score
  gameStarted = false;
  stopTimer();             // here Stop the timer if it's running

  grid.innerHTML = '';     // then Clear the grid
  grid.className = 'grid'; // and Reset grid classes

  // Apply the corresponding class based on the current level
  if (currentLevel === levels.easy) {
    grid.classList.add('easy');
  } else if (currentLevel === levels.medium) {
    grid.classList.add('medium');
  } else {
    grid.classList.add('hard');
  }

  // This part is in charge to Duplicate, shuffle, and render the cards
  const shuffledEmojis = shuffle([...currentLevel]);

  shuffledEmojis.forEach(emoji => {
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `<span class="emoji">${emoji}</span>`;

    card.addEventListener('click', handleCardClick); // Add click event
    grid.appendChild(card); // Add card to the grid
  });
}

// Handles the card click event
function handleCardClick() {
  if (lockBoard) return;          // Do nothing if the board is locked
  if (this === firstCard) return; // Ignore if the same card is clicked again

  if (!gameStarted) {
    startTimer();     // Start timer on first move
    gameStarted = true;
  }

  this.classList.add('boxOpen'); // Reveal the card

  if (!firstCard) {
    firstCard = this; // Save first selected card
    return;
  }

  secondCard = this;   // Save second selected card
  incrementMoves();    // Increase the move counter
  checkForMatch();     // Check if cards match
}

// Compares the two selected cards to see if they match
function checkForMatch() {
  const isMatch = firstCard.innerHTML === secondCard.innerHTML;
  isMatch ? disableCards() : unflipCards();
}

// If there's a match, lock the cards in the open state
function disableCards() {
  firstCard.classList.add('boxMatch');
  secondCard.classList.add('boxMatch');

  resetBoard(); // Reset selections to continue the game

  // Check if all cards are matched to end the game
  if (document.querySelectorAll('.boxMatch').length === currentLevel.length) {
    stopTimer();
    showWinnerMessage(); // Display winning message
  }
}

// If not a match, flip the cards back after a short delay
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('boxOpen');
    secondCard.classList.remove('boxOpen');

    resetBoard(); // Allow new selections
  }, 500);
}

// Reset selected cards and unlock the board
function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Displays the winner message when the game ends
function showWinnerMessage() {
  const stars = getScore(); // Get the number of stars
  const winnerMessage = document.getElementById('winnerMessage');
  winnerMessage.classList.add('show');
  winnerMessage.innerHTML = `🎉 You won! ${'⭐️'.repeat(stars)}<br>
    Level: ${
      currentLevel === levels.easy ? 'Easy' :
      currentLevel === levels.medium ? 'Medium' : 'Hard'
    }<br>
    Moves: ${getMoves()}<br>
    Time: ${getTime()}s<br>
    Score: ${'⭐️'.repeat(stars)}`;

  createConfetti(); // Show celebratory animation
}

// Creates confetti animation with falling stars
function createConfetti() {
  const container = document.createElement('div');
  container.classList.add('confetti-container');
  document.body.appendChild(container);

  const total = 30; // Number of confetti pieces

  for (let i = 0; i < total; i++) {
    const confetti = document.createElement('span');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = 3 + Math.random() * 2 + 's';
    confetti.style.fontSize = (12 + Math.random() * 18) + 'px';
    confetti.textContent = '⭐️';
    container.appendChild(confetti);

    // Add random delay so stars fall at different times
    confetti.style.animationDelay = (Math.random() * 5) + 's';
  }

  // Optional: remove confetti from DOM after 8 seconds
  setTimeout(() => {
    container.remove();
  }, 8000);
}

// Optional initial call (can be removed or moved)
// createConfetti();

// Export the current level (useful in other modules)
export { currentLevel };
