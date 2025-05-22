export function saveScore(name, score, time) {
  const scores = JSON.parse(localStorage.getItem("triviaScores")) || [];

  // Agregar el nuevo objeto con time
  scores.push({ name, score, time });

  // Ordenar por score descendente, y si hay empate, por menor time
  scores.sort((a, b) => {
    if (b.score === a.score) {
      return a.time - b.time;
    }
    return b.score - a.score;
  });

  // Guardar sólo top 3
  localStorage.setItem("triviaScores", JSON.stringify(scores.slice(0, 3)));
}


export function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("triviaScores")) || [];

  if (scores.length === 0) {
    document.getElementById("triviaQuestion").innerHTML = "<h2>No hay puntajes aún</h2>";
  } else {
    let html = "<h2>🏆 Mejores puntajes</h2><ol>";
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
