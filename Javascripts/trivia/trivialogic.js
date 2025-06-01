
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

//This  function is in charge to select the difficulty of the questions.
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

//the function is in charge to show the questions

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
  // this part the code prevent the user ansewer more than one time.
  if (document.getElementById("nextQuestionBtn").style.display === "block") {
    return;
  }

  stopTimer();
  totalTime += (15 - timeLeft);

  const current = questions[currentIndex];

  const feedbackEl = document.getElementById("triviaFeedback");
  if (selectedOption === current.answer) {
    score++;
    feedbackEl.textContent = "✅ ¡Congratulations is correct!";
    feedbackEl.style.color = "green";
  } else if (selectedOption === null) {
    feedbackEl.textContent = "⏰ Time's up. The correct answer was: " + current.answer;
    feedbackEl.style.color = "orange";
  } else {
    feedbackEl.textContent = "❌ Incorrect. The correct answer is: " + current.answer;
    feedbackEl.style.color = "red";
  }

  //this is charge to show the next question.
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

//this functions stop the timer when the user answer the question or when the time is over.
function stopTimer() {
  clearInterval(timer);
}

document.getElementById("nextQuestionBtn").addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    
    document.getElementById("customPrompt").classList.remove("hidden");
  }
});


// when the user clicks the submit button the name are saved and the score are saved.
document.getElementById("submitNameBtn").addEventListener("click", () => {
  const name = document.getElementById("playerName").value.trim();
  console.log("Name:", name);
  console.log("Current score:", score);
  if (name) {
    saveScore(name, score, totalTime);
    showLeaderboard();
    document.getElementById("customPrompt").classList.add("hidden");
    document.getElementById("restartBtn").style.display = "block";
    document.getElementById("difficultyButtons").style.display = "none";
  } else {
    alert("Congratulations, you've completed the trivia! Please enter your name.");
  }
});


document.getElementById("restartBtn").addEventListener("click", () => {
  // Restart the state of the game
  currentIndex = 0;
  score = 0;
  questions = [];

  // hidden the element by default
  document.getElementById("triviaQuestion").textContent = "";
  document.getElementById("triviaOptions").innerHTML = "";
  document.getElementById("triviaFeedback").textContent = "";
  document.getElementById("nextQuestionBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";



  // the buttons are hidden by default
  document.getElementById("difficultyButtons").style.display = "block";
});

document.getElementById("triviaTimer").textContent = '';

