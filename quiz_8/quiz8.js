const questions = [
  "I have a clear understanding of where my group is going.",
  "I always give others positive feedback when they perform well.",
  "I paint an interesting picture of the future for our group.",
  "I give special recognition to group members when their work is very good.",
  "I am always seeking new opportunities for the group.",
  "I commend others when they do a better than average job.",
  "I inspire others with my plans for the future.",
  "I frequently acknowledge others’ good performance."
];

const scoringConfig = {
  transformational: { items: [1, 3, 5, 7], color: '#667eea' },
  transactional: { items: [2, 4, 6, 8], color: '#48bb78' }
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

let chartInstances = { bar: null, doughnut: null };

function calculateScores() {
  const form = document.getElementById("leadershipForm");
  if (!form.checkValidity()) {
    alert("Please answer all questions before submitting.");
    return;
  }
  const formData = new FormData(form);
  let scores = { transformational: 0, transactional: 0 };
  for (const style in scoringConfig) {
    scoringConfig[style].items.forEach(itemNum => {
      scores[style] += parseInt(formData.get(`q${itemNum}`));
    });
  }
  displayScores(scores);
  drawBarChart(scores);
  drawDoughnutChart(scores);
  showInterpretation(scores);
  document.getElementById("results").style.display = "block";
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

function displayScores(scores) {
  const scoreDiv = document.getElementById("scores");
  scoreDiv.innerHTML = "";
  for (const style in scores) {
    const score = scores[style];
    const preference = score > 12 ? "Higher" : "Lower";
    const color = scoringConfig[style].color;
    scoreDiv.innerHTML += `
      <div class="score-line" style="border-left-color: ${color}">
        <strong>${style.charAt(0).toUpperCase() + style.slice(1)}:</strong> ${score} / 20 (${preference} Preference)
      </div>
    `;
  }
}

function drawBarChart(scores) {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  if (chartInstances.bar) chartInstances.bar.destroy();
  chartInstances.bar = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Transformational', 'Transactional'],
      datasets: [{
        label: 'Leadership Style Score',
        data: [scores.transformational, scores.transactional],
        backgroundColor: [scoringConfig.transformational.color, scoringConfig.transactional.color],
        borderColor: ['#5a67d8', '#38a169'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
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

function drawDoughnutChart(scores) {
  const canvas = document.getElementById('doughnutChart');
  if (!canvas) return;
  if (chartInstances.doughnut) chartInstances.doughnut.destroy();
  chartInstances.doughnut = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Transformational', 'Transactional'],
      datasets: [{
        data: [scores.transformational, scores.transactional],
        backgroundColor: [scoringConfig.transformational.color, scoringConfig.transactional.color],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      }
    }
  });
}

function showInterpretation(scores) {
  const interpretationDiv = document.getElementById("interpretation");
  interpretationDiv.innerHTML = `
    <h3>Interpretation</h3>
    <ul>
      <li><strong>Transformational Leadership:</strong> Your score of ${scores.transformational} indicates a ${scores.transformational > 12 ? 'higher' : 'lower'} preference for identifying new opportunities and inspiring others with a vision of the future.</li>
      <li><strong>Transactional Leadership:</strong> Your score of ${scores.transactional} indicates a ${scores.transactional > 12 ? 'higher' : 'lower'} preference for delivering rewards to followers contingent on their performance.</li>
    </ul>
    <p>Scores above 12 indicate a higher preference for that leadership style. Many effective leaders use a combination of both styles depending on the situation and their followers.</p>
  `;
}
