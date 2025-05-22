import { shuffle } from './utils.js';
import { levels } from './levels.js';
import { incrementMoves, resetScore, startTimer, stopTimer, getScore, getMoves, getTime } from './scoreSystem.js';

const grid = document.querySelector('.grid');
let currentLevel = levels.easy;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let gameStarted = false;

export function setCurrentLevel(level) {
  currentLevel = level;
}

export function setupGame() {
  resetScore();
  gameStarted = false;
  stopTimer();
  
  grid.innerHTML = '';
  grid.className = 'grid'; // Resetear clases
  
  if (currentLevel === levels.easy) {
    grid.classList.add('easy');
  } else if (currentLevel === levels.medium) {
    grid.classList.add('medium');
  } else {
    grid.classList.add('hard');
  }

  const shuffledEmojis = shuffle([...currentLevel]);
  
  shuffledEmojis.forEach(emoji => {
  const card = document.createElement('div');
  card.className = 'item';
  card.innerHTML = `<span class="emoji">${emoji}</span>`;

  card.addEventListener('click', handleCardClick);
  grid.appendChild(card);
});

}

function handleCardClick() {
  if (lockBoard) return;
  if (this === firstCard) return;
  
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }
  
  this.classList.add('boxOpen');
  
  if (!firstCard) {
    firstCard = this;
    return;
  }
  
  secondCard = this;
  incrementMoves();
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.innerHTML === secondCard.innerHTML;
  
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.classList.add('boxMatch');
  secondCard.classList.add('boxMatch');
  
  resetBoard();
  
  if (document.querySelectorAll('.boxMatch').length === currentLevel.length) {
    stopTimer();
    showWinnerMessage();
  }
}

function unflipCards() {
  lockBoard = true;
  
  setTimeout(() => {
    firstCard.classList.remove('boxOpen');
    secondCard.classList.remove('boxOpen');
    
    resetBoard();
  }, 500);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function showWinnerMessage() {
  const stars = getScore();
  const winnerMessage = document.getElementById('winnerMessage');
  winnerMessage.classList.add('show');
  winnerMessage.innerHTML = `🎉 ¡Ganaste! ${'⭐️'.repeat(stars)}<br>
  Nivel: ${
    currentLevel === levels.easy ? 'Fácil' :
    currentLevel === levels.medium ? 'Medio' : 'Difícil'
  }<br>
  Movimientos: ${getMoves()}<br>
  Tiempo: ${getTime()}s<br>
  Puntuación: ${'⭐️'.repeat(stars)}`;
  createConfetti();
}
function createConfetti() {
  const container = document.createElement('div');
  container.classList.add('confetti-container');
  document.body.appendChild(container);

  const total = 30; // Cantidad de estrellitas

  for (let i = 0; i < total; i++) {
    const confetti = document.createElement('span');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = 3 + Math.random() * 2 + 's'; // Duración entre 3 y 5 segundos
    confetti.style.fontSize = (12 + Math.random() * 18) + 'px'; // Tamaño aleatorio
    confetti.textContent = '⭐️'; 
    container.appendChild(confetti);

    // Animación delay para que caigan desfasados
    confetti.style.animationDelay = (Math.random() * 5) + 's';
  }

  // Opcional: eliminar las estrellitas después de un tiempo para limpiar el DOM
  setTimeout(() => {
    container.remove();
  }, 8000);
}

// Llamás a esta función cuando ganás el juego
createConfetti();


export { currentLevel };
