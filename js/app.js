const PASSWORD = "24@04Wh20a25";

// Afficher/Masquer mot de passe
document.getElementById("togglePassword").addEventListener("change", function () {
  const passwordField = document.getElementById("password");
  passwordField.type = this.checked ? "text" : "password";
});

// Entrée valide le mot de passe
document.getElementById("password").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    checkPassword();
  }
});

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === PASSWORD) {
    document.getElementById("password-container").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    loadScores();
  } else {
    document.getElementById("error").textContent = "Mot de passe incorrect.";
  }
}

async function loadScores() {
  const res = await fetch("data/scores.json");
  const data = await res.json();
  const tbody = document.getElementById("ranking-body");

  data.sort((a, b) => b.score - a.score);
  tbody.innerHTML = "";

  data.forEach((member, index) => {
    const { grade, progress } = getGrade(member.score);

    const row = document.createElement("tr");

    const cells = [
      { label: "Rang", value: index + 1 },
      { label: "Nom", value: member.name },
      { label: "Score", value: `${member.score} XP` },
      {
        label: "Progression",
        value: `<div class='progress-bar'><div class='progress-bar-fill' style='width:${progress}%;'></div></div>`
      },
      { label: "Grade", value: grade }
    ];

    cells.forEach(cellData => {
      const cell = document.createElement("td");
      cell.innerHTML = cellData.value;
      cell.setAttribute("data-label", cellData.label);
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}

function getGrade(score) {
  const levels = [
    ["Newbie I", 0], ["Newbie II", 50], ["Newbie III", 100], ["Newbie IV", 150], ["Newbie V", 200],
    ["Kiddie I", 250], ["Kiddie II", 300], ["Kiddie III", 350], ["Kiddie IV", 400], ["Kiddie V", 450],
    ["Hunter I", 500], ["Hunter II", 550], ["Hunter III", 600], ["Hunter IV", 650], ["Hunter V", 700],
    ["Seeker I", 750], ["Seeker II", 800], ["Seeker III", 850], ["Seeker IV", 900], ["Seeker V", 950],
    ["Explorer I", 1000], ["Explorer II", 1050], ["Explorer III", 1100], ["Explorer IV", 1150], ["Explorer V", 1200],
    ["Operator I", 1250], ["Operator II", 1300], ["Operator III", 1350], ["Operator IV", 1400], ["Operator V", 1450],
  ];

  let grade = "???", lower = 0, upper = 1500;

  for (let i = levels.length - 1; i >= 0; i--) {
    if (score >= levels[i][1]) {
      grade = levels[i][0];
      lower = levels[i][1];
      upper = levels[i + 1] ? levels[i + 1][1] : lower + 50;
      break;
    }
  }

  const progress = Math.min(100, ((score - lower) / (upper - lower)) * 100);
  return { grade, progress };
}
