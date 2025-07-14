const questions = [
  "I know where I stand with my leader (follower) and usually know how satisfied my leader (follower) is with what I do.",
  "My leader (follower) understands my job problems and needs.",
  "My leader (follower) recognizes my potential.",
  "Regardless of how much formal authority my leader (follower) has built into their position, my leader (follower) will use their power to help me solve problems in my work.",
  "Again, regardless of the amount of formal authority my leader (follower) has, they would “bail me out” at their expense.",
  "I have enough confidence in my leader (follower) that I would defend and justify their decision if they were not present to do so.",
  "I have an extremely effective working relationship with my leader (follower)."
];

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

let chartInstances = { bar: null, gauge: null };

function calculateScores() {
  const form = document.getElementById("lmxForm");
  if (!form.checkValidity()) {
    alert("Please answer all questions before submitting.");
    return;
  }
  const formData = new FormData(form);
  let total = 0;
  let perQuestion = [];
  for (let i = 1; i <= questions.length; i++) {
    const val = parseInt(formData.get(`q${i}`));
    total += val;
    perQuestion.push(val);
  }
  displayScores(total);
  drawBarChart(perQuestion);
  drawGaugeChart(total);
  showInterpretation(total);
  document.getElementById("results").style.display = "block";
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

function drawBarChart(perQuestion) {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  if (chartInstances.bar) chartInstances.bar.destroy();
  chartInstances.bar = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: questions.map((q, i) => `Q${i+1}`),
      datasets: [{
        label: 'Your Score',
        data: perQuestion,
        backgroundColor: perQuestion.map(val =>
          val >= 4 ? '#48bb78' : val === 3 ? '#ecc94b' : '#f56565'
        ),
        borderColor: '#667eea',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 1,
          max: 5,
          ticks: { stepSize: 1 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function drawGaugeChart(total) {
  const canvas = document.getElementById('gaugeChart');
  if (!canvas) return;
  if (chartInstances.gauge) chartInstances.gauge.destroy();

  // Gauge chart using Chart.js "doughnut" with rotation and cutout
  let color;
  if (total >= 25) color = "#48bb78";
  else if (total >= 20) color = "#ecc94b";
  else color = "#f56565";

  chartInstances.gauge = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Score', ''],
      datasets: [{
        data: [total, 35 - total],
        backgroundColor: [color, '#e2e8f0'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      rotation: -90,
      circumference: 180,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        title: {
          display: true,
          text: `${total} / 35`,
          color: color,
          font: { size: 24, weight: 'bold' },
          padding: { top: 10, bottom: 0 }
        }
      }
    }
  });
}

function displayScores(total) {
  const scoreDiv = document.getElementById("scores");
  let range, color;
  if (total >= 25) { range = "High"; color = "#48bb78"; }
  else if (total >= 20) { range = "Moderate"; color = "#ecc94b"; }
  else { range = "Low"; color = "#f56565"; }
  scoreDiv.innerHTML = `
    <div class="score-line" style="border-left-color: ${color}">
      <strong>Total LMX-7 Score:</strong> ${total} / 35 (${range})
    </div>
  `;
}

function showInterpretation(total) {
  let interp = '';
  if (total >= 25) {
    interp = `<strong>High-quality LMX:</strong> You have a strong, partnership-like relationship with your leader/follower.`;
  } else if (total >= 20) {
    interp = `<strong>Moderate LMX:</strong> Your relationship is average. There may be room to strengthen your leader–member exchange.`;
  } else {
    interp = `<strong>Low-quality LMX:</strong> Your relationship is less effective. Consider ways to build trust, support, and communication.`;
  }
  document.getElementById("interpretation").innerHTML = `
    <h3>Interpretation</h3>
    <p>${interp}</p>
    <ul>
      <li>High (25–35): Strong, high-quality leader–member exchange</li>
      <li>Moderate (20–24): Moderate quality</li>
      <li>Low (7–19): Lower quality, more transactional or distant relationship</li>
    </ul>
    <p>LMX-7 helps you reflect on the quality of your working relationships. Higher scores indicate more trust, respect, and mutual obligation.</p>
  `;
}
