let moves = 0;
let timer = null;
let timeElapsed = 0;

export function resetScore() {
  moves = 0;
  timeElapsed = 0;
  if (timer) clearInterval(timer);
}

export function incrementMoves() {
  moves++;
}

export function startTimer(updateCallback) {
  timeElapsed = 0;
  timer = setInterval(() => {
    timeElapsed++;
    if (updateCallback) updateCallback(timeElapsed);
  }, 1000);
}

export function stopTimer() {
  if (timer) clearInterval(timer);
}

export function getScore() {
  if (moves <= 15 && timeElapsed <= 60) return 3;
  if (moves <= 20 && timeElapsed <= 120) return 2;
  return 1;
}

export function getMoves() {
  return moves;
}

export function getTime() {
  return timeElapsed;
}

export function getStarHTML(score) {
  return `
    <span style="color:${score >= 1 ? 'gold' : '#ccc'}">⭐️</span>
    <span style="color:${score >= 2 ? 'gold' : '#ccc'}">⭐️</span>
    <span style="color:${score >= 3 ? 'gold' : '#ccc'}">⭐️</span>
  `;
}
