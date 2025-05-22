
import { saveScore, showLeaderboard } from './scoreManager.js';

let allQuestions = [];
let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15; // segundos por pregunta

let totalTime = 0;

function startTimer() {
  timeLeft = 15;
  document.getElementById("triviaTimer").textContent = `⏱ Tiempo: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("triviaTimer").textContent = `⏱ Tiempo: ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timer);
      totalTime += 15;
      checkAnswer(null); // se acabó el tiempo, respuesta incorrecta
    }
  }, 1000);
}



function loadQuestions() {
  fetch('Json/trivia.json')
    .then(response => response.json())
    .then(data => {
      allQuestions = data;
      // Activar botones de dificultad cuando ya tenemos las preguntas
      document.getElementById("difficultyButtons").style.display = "block";
    })
    .catch(error => {
      console.error("Error al cargar las preguntas:", error);
    });
}


window.onload = loadQuestions;

// Filtra por dificultad y comienza el juego
function selectDifficulty(level) {
  document.getElementById("difficultyButtons").style.display = "none";
  questions = allQuestions.filter(q => q.difficulty === level);
  currentIndex = 0;
  if (questions.length > 0) {
    showQuestion();
  } else {
    document.getElementById("triviaQuestion").textContent = "No hay preguntas disponibles para este nivel.";
    document.getElementById("triviaOptions").innerHTML = "";
  }
}
function showQuestion() {
  const current = questions[currentIndex];
  document.getElementById("triviaQuestion").textContent = current.question;

  const optionsContainer = document.getElementById("triviaOptions");
  optionsContainer.innerHTML = '';

  current.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => {
      checkAnswer(option);
      stopTimer();
    };
    optionsContainer.appendChild(button);
  });

  document.getElementById("triviaFeedback").textContent = '';
  /*document.getElementById("nextQuestionBtn").style.display = "none";*/

  startTimer();
}

window.selectDifficulty = selectDifficulty;
function checkAnswer(selectedOption) {
  // Evitar que se pueda responder dos veces
  if (document.getElementById("nextQuestionBtn").style.display === "block") {
    return;
  }

  stopTimer();
  totalTime += (15 - timeLeft);

  const current = questions[currentIndex];

  const feedbackEl = document.getElementById("triviaFeedback");
  if (selectedOption === current.answer) {
    score++;
    feedbackEl.textContent = "✅ ¡Correcto!";
    feedbackEl.style.color = "green";
  } else if (selectedOption === null) {
    feedbackEl.textContent = "⏰ Se acabó el tiempo. La respuesta correcta era: " + current.answer;
    feedbackEl.style.color = "orange";
  } else {
    feedbackEl.textContent = "❌ Incorrecto. La respuesta correcta es: " + current.answer;
    feedbackEl.style.color = "red";
  }

  // Mostrar botón siguiente
  setTimeout(() => {
    currentIndex++;
    if (currentIndex < questions.length) {
      showQuestion();
    } else {
      document.getElementById("playerName").value = "";
      document.getElementById("customPrompt").classList.remove("hidden");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

document.getElementById("nextQuestionBtn").addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    // Mostrar modal personalizado
    document.getElementById("customPrompt").classList.remove("hidden");
  }
});


// Al hacer clic en "Guardar"
document.getElementById("submitNameBtn").addEventListener("click", () => {
  const name = document.getElementById("playerName").value.trim();
  console.log("Nombre ingresado:", name);
  console.log("Puntaje actual:", score);
  if (name) {
    saveScore(name, score, totalTime);
    showLeaderboard();
    document.getElementById("customPrompt").classList.add("hidden");
    document.getElementById("restartBtn").style.display = "block";
    document.getElementById("difficultyButtons").style.display = "none";
  } else {
    alert("Por favor, ingresá tu nombre.");
  }
});


document.getElementById("restartBtn").addEventListener("click", () => {
  // Reiniciar estado
  currentIndex = 0;
  score = 0;
  questions = [];

  // Ocultar elementos del juego
  document.getElementById("triviaQuestion").textContent = "";
  document.getElementById("triviaOptions").innerHTML = "";
  document.getElementById("triviaFeedback").textContent = "";
  document.getElementById("nextQuestionBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";



  // Mostrar botones de dificultad
  document.getElementById("difficultyButtons").style.display = "block";
});

document.getElementById("triviaTimer").textContent = '';

