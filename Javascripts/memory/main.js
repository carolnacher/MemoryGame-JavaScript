import { levels } from './levels.js';
import { setupGame, setCurrentLevel } from './gameLogic.js';
import { resetScore } from './scoreSystem.js';
import { getMoves, getTime, getScore, getStarHTML } from './scoreSystem.js';

let currentLevel = levels.easy;

document.getElementById('resetButton').addEventListener('click', () => {
  document.getElementById('winnerMessage').classList.remove('show');
  resetScore();
  setupGame();
});

document.querySelectorAll('.difficulty-buttons button').forEach(button => {
  button.addEventListener('click', function() {
    document.getElementById('winnerMessage').classList.remove('show');
    
    currentLevel = this.textContent === 'Fácil' ? levels.easy :
                   this.textContent === 'Medio' ? levels.medium :
                   levels.hard;
    setCurrentLevel(currentLevel);
    setupGame();
  });
});

function showWinnerMessage(levelName) {
  const score = getScore();
winnerMessage.innerHTML = `
  🎉 ¡Ganaste! ${getStarHTML(score)}<br>
  Nivel: ${levelName}<br>
  Movimientos: ${getMoves()}<br>
  Tiempo: ${getTime()}s<br>
  Puntuación: ${getStarHTML(score)}
`;
  winnerMessage.classList.add('show');
}

// Inicializar juego
setCurrentLevel(currentLevel);
setupGame();



