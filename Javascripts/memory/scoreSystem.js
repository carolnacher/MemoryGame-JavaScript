
// Counter for the number of moves made by the player,
// Reference to the timer (setInterval)
// and the Elapsed time in seconds

let moves = 0;           
let timer = null;        
let timeElapsed = 0;    

// This function resets the move count and timer
export function resetScore() {
  moves = 0;             
  timeElapsed = 0;      
  if (timer) clearInterval(timer);  // Stop the timer if it's running
}

// Increments the number of moves
export function incrementMoves() {
  moves++;
}

// Starts the timer and calls an update callback every second
export function startTimer(updateCallback) {
  timeElapsed = 0;       // Reset time
  timer = setInterval(() => {
    timeElapsed++;       // Increase time by 1 every second
    if (updateCallback) updateCallback(timeElapsed);  // Call the update function, if provided
  }, 1000);
}

// Stops the timer
export function stopTimer() {
  if (timer) clearInterval(timer);  // Stop the timer if it's running
}

// Returns a score based on number of moves and elapsed time
export function getScore() {
  if (moves <= 15 && timeElapsed <= 60) return 3;     // Best score
  if (moves <= 20 && timeElapsed <= 120) return 2;    // Medium score
  return 1;                                           // Minimum score
}

// Returns the number of moves made
export function getMoves() {
  return moves;
}

// Returns the elapsed time in seconds
export function getTime() {
  return timeElapsed;
}

// Returns HTML with colored stars based on the score
export function getStarHTML(score) {
  return `
    <span style="color:${score >= 1 ? 'gold' : '#ccc'}">⭐️</span>
    <span style="color:${score >= 2 ? 'gold' : '#ccc'}">⭐️</span>
    <span style="color:${score >= 3 ? 'gold' : '#ccc'}">⭐️</span>
  `;
}
