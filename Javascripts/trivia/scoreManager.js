export function saveScore(name, score, time) {
  const scores = JSON.parse(localStorage.getItem("triviaScores")) || [];

 // Add the new object with time
  scores.push({ name, score, time });

  // In this part, the score is sorted by descending order, and if there is a tie, the one with the shortest time is taken.
  scores.sort((a, b) => {
    if (b.score === a.score) {
      return a.time - b.time;
    }
    return b.score - a.score;
  });

  const top3 = scores.slice(0, 3);
  localStorage.setItem("triviaScores", JSON.stringify(top3));
}

/* This feature displays the trivia game leaderboard using scores stored in local storage.
* - If no scores are found, a message is displayed indicating that there are no scores yet.
* - If scores exist, they are displayed in a ranked list with names, points, and time.
* - Clears the trivia options, comments, and timer, and hides the "Next Question" button.*/

export function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("triviaScores")) || [];

  if (scores.length === 0) {
    document.getElementById("triviaQuestion").innerHTML = "<h2>There are no scores yet</h2>";
  } else {
    let html = "<h2>🏆 Best Escores</h2><ol>";
    scores.forEach(s => {

      const timeStr = typeof s.time === 'number' ? ` - ⏱ ${s.time}s` : '';
      html += `<li>${s.name} - ${s.score} pts${timeStr}</li>`;
    });
    html += "</ol>";
    document.getElementById("triviaQuestion").innerHTML = html;
  }


  document.getElementById("triviaOptions").innerHTML = "";
  document.getElementById("triviaFeedback").textContent = "";
  document.getElementById("triviaTimer").textContent = "";
  document.getElementById("nextQuestionBtn").style.display = "none";
}
