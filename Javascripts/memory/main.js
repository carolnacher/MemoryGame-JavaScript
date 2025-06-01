// Importing required modules
import { levels } from './levels.js';                         
import { setupGame, setCurrentLevel } from './gameLogic.js';  
import { resetScore } from './scoreSystem.js';                
import { getMoves, getTime, getScore, getStarHTML } from './scoreSystem.js'; 

// Set the default level to easy
let currentLevel = levels.easy;

// Event listener for the reset button
document.getElementById('resetButton').addEventListener('click', () => {
  // Hide the winner message (in case it's visible)
  document.getElementById('winnerMessage').classList.remove('show');
  // Reset the score (moves and timer)
  resetScore();
  // Start a new game with the current level
  setupGame();
});

// Add click event listeners to all difficulty buttons
document.querySelectorAll('.difficulty-buttons button').forEach(button => {
  button.addEventListener('click', function() {
    // Hide the winner message when changing difficulty
    document.getElementById('winnerMessage').classList.remove('show');
    
    // Determine selected level based on button text
    currentLevel = this.textContent === 'Easy' ? levels.easy :
                   this.textContent === 'Medium' ? levels.medium :
                   levels.hard;

    // Set the new current level in the game logic
    setCurrentLevel(currentLevel);
    // Set up the game with the selected level
    setupGame();
  });
});

// Function to display the winner message with score details
function showWinnerMessage(levelName) {
  const score = getScore();  // Get star score (1–3 based on moves & time)

  winnerMessage.innerHTML = `
    🎉 ¡You Won! ${getStarHTML(score)}<br>
    Level: ${levelName}<br>
    Movements: ${getMoves()}<br>
    Time: ${getTime()}s<br>
    Escore: ${getStarHTML(score)}
  `;

  // Show the message container
  winnerMessage.classList.add('show');
}

// Initialize game on page load
setCurrentLevel(currentLevel); // Set default level (easy)
setupGame();                   // Start the game
