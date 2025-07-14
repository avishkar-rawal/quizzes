const questions = [
  "I can list my three greatest weaknesses.",
  "My actions reflect my core values.",
  "I seek others’ opinions before making up my own mind.",
  "I openly share my feelings with others.",
  "I can list my three greatest strengths.",
  "I do not allow group pressure to control me.",
  "I listen closely to the ideas of those who disagree with me.",
  "I let others know who I truly am as a person.",
  "I seek feedback as a way of understanding who I really am as a person.",
  "Other people know where I stand on controversial issues.",
  "I do not emphasize my own point of view at the expense of others.",
  "I rarely present a “false” front to others.",
  "I accept the feelings I have about myself.",
  "My morals guide what I do as a leader.",
  "I listen very carefully to the ideas of others before making decisions.",
  "I admit my mistakes to others."
];

const scoringConfig = {
  selfAwareness: { items: [1, 5, 9, 13], color: '#667eea', label: 'Self-Awareness' },
  internalizedMoral: { items: [2, 6, 10, 14], color: '#48bb78', label: 'Internalized Moral Perspective' },
  balancedProcessing: { items: [3, 7, 11, 15], color: '#ecc94b', label: 'Balanced Processing' },
  relationalTransparency: { items: [4, 8, 12, 16], color: '#f56565', label: 'Relational Transparency' }
};

document.addEventListener('DOMContentLoaded', function() {
  generateQuestions();
  setupChartTabs();
});

function generateQuestions() {
  const container = document.getElementById("questions");
  if (!container) return;
  questions.forEach((q, i) => {
    const num = i + 1;
    const div = document.createElement("div");
    div.className = "question";
    const questionLabel = document.createElement("label");
    questionLabel.innerHTML = `<strong>${num}.</strong> ${q}`;
    div.appendChild(questionLabel);
    const radioGroup = document.createElement("div");
    radioGroup.className = "radio-group";
    [1, 2, 3, 4, 5].forEach((val) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const span = document.createElement("span");
      input.type = "radio";
      input.name = `q${num}`;
      input.value = val;
      input.required = true;
      span.textContent = val;
      input.addEventListener('change', function() {
        const allLabels = radioGroup.querySelectorAll('label');
        allLabels.forEach(l => l.classList.remove('checked'));
        if (this.checked) {
          label.classList.add('checked');
        }
      });
      label.appendChild(input);
      label.appendChild(span);
      radioGroup.appendChild(label);
    });
    div.appendChild(radioGroup);
    container.appendChild(div);
  });
}

function setupChartTabs() {
  const tabs = document.querySelectorAll('.chart-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const views = document.querySelectorAll('.chart-view');
      views.forEach(v => v.classList.remove('active'));
      const targetView = document.getElementById(`${tab.dataset.chart}-view`);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });
}

let chartInstances = { radar: null, bar: null };

function calculateScores() {
  const form = document.getElementById("leadershipForm");
  if (!form.checkValidity()) {
    alert("Please answer all questions before submitting.");
    return;
  }
  const formData = new FormData(form);
  let scores = {};
  for (const style in scoringConfig) {
    scores[style] = 0;
    scoringConfig[style].items.forEach(itemNum => {
      scores[style] += parseInt(formData.get(`q${itemNum}`));
    });
  }
  displayScores(scores);
  drawRadarChart(scores);
  drawBarChart(scores);
  showInterpretation(scores);
  document.getElementById("results").style.display = "block";
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

function displayScores(scores) {
  const scoreDiv = document.getElementById("scores");
  scoreDiv.innerHTML = "";
  for (const style in scores) {
    const score = scores[style];
    const level = score >= 16 ? "High" : "Low";
    const color = score >= 16 ? '#48bb78' : '#f56565';
    scoreDiv.innerHTML += `
      <div class="score-line" style="border-left-color: ${color}">
        <strong>${scoringConfig[style].label}:</strong> ${score} / 20 (${level})
      </div>
    `;
  }
}

function drawRadarChart(scores) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  if (chartInstances.radar) chartInstances.radar.destroy();
  chartInstances.radar = new Chart(canvas.getContext('2d'), {
    type: 'radar',
    data: {
      labels: Object.values(scoringConfig).map(s => s.label),
      datasets: [{
        label: 'Your Scores',
        data: Object.values(scores),
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: '#667eea',
        borderWidth: 3,
        pointBackgroundColor: Object.values(scoringConfig).map(s => s.color),
        pointBorderColor: '#fff',
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 4,
          max: 20,
          ticks: { stepSize: 4 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function drawBarChart(scores) {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  if (chartInstances.bar) chartInstances.bar.destroy();
  chartInstances.bar = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: Object.values(scoringConfig).map(s => s.label),
      datasets: [{
        label: 'Dimension Score',
        data: Object.values(scores),
        backgroundColor: Object.values(scoringConfig).map(s => s.color),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          min: 4,
          max: 20,
          ticks: { stepSize: 4 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function showInterpretation(scores) {
  const interpretationDiv = document.getElementById("interpretation");
  interpretationDiv.innerHTML = `
    <h3>Interpretation of Your Scores</h3>
    <p>Your scores indicate your strengths across the four components of authentic leadership. Scores of 16-20 are considered high, while scores 15 and below are low.</p>
    <ul>
      <li><strong>Self-Awareness (${scores.selfAwareness}/20):</strong> Reflects your understanding of your own strengths, weaknesses, and values.</li>
      <li><strong>Internalized Moral Perspective (${scores.internalizedMoral}/20):</strong> Shows how you use your internal moral standards to guide your behavior.</li>
      <li><strong>Balanced Processing (${scores.balancedProcessing}/20):</strong> Indicates your ability to analyze information objectively and explore others' opinions before making a decision.</li>
      <li><strong>Relational Transparency (${scores.relationalTransparency}/20):</strong> Pertains to being open and honest in presenting your true self to others.</li>
    </ul>
    <p>By comparing your scores, you can determine which components of authentic leadership are your strengths and which may be areas for development.</p>
  `;
}
