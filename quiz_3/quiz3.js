// quiz3.js

const questions = [
  "I enjoy getting into the details of how things work.",
  "As a rule, adapting ideas to people’s needs is easy for me.",
  "I enjoy working with abstract ideas.",
  "Technical things fascinate me.",
  "Being able to understand others is the most important part of my work.",
  "Seeing the big picture comes easy for me.",
  "One of my skills is being good at making things work.",
  "My main concern is to have a supportive communication climate.",
  "I am intrigued by complex organizational problems.",
  "Following directions and filling out forms comes easily for me.",
  "Understanding the social fabric of the organization is important to me.",
  "I would enjoy working out strategies for my organization’s growth.",
  "I am good at completing the things I’ve been assigned to do.",
  "Getting all parties to work together is a challenge I enjoy.",
  "Creating a mission statement is rewarding work.",
  "I understand how to do the basic things required of me.",
  "I am concerned with how my decisions affect the lives of others.",
  "Thinking about organizational values and philosophy appeals to me."
];

const categories = {
  technical: [1, 4, 7, 10, 13, 16],
  human: [2, 5, 8, 11, 14, 17],
  conceptual: [3, 6, 9, 12, 15, 18]
};

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById("questions");
  questions.forEach((q, i) => {
    const num = i + 1;
    const div = document.createElement("div");
    div.className = "question";
    const questionLabel = document.createElement("label");
    questionLabel.innerHTML = `<strong>${num}.</strong> ${q}`;
    questionLabel.style.marginBottom = "10px";
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
});

let chartInstance = null;

function calculateScores() {
  const form = document.getElementById("skillsForm");
  if (!form.checkValidity()) {
    alert("Please answer all questions before submitting.");
    return;
  }
  const formData = new FormData(form);
  let scores = { technical: 0, human: 0, conceptual: 0 };
  for (const [key, val] of formData.entries()) {
    const num = parseInt(key.substring(1));
    const score = parseInt(val);
    for (const cat in categories) {
      if (categories[cat].includes(num)) {
        scores[cat] += score;
      }
    }
  }
  const resultDiv = document.getElementById("results");
  const scoreDiv = document.getElementById("scores");
  scoreDiv.innerHTML = "";
  for (const cat in scores) {
    const categoryName = cat.charAt(0).toUpperCase() + cat.slice(1);
    scoreDiv.innerHTML += `
      <div class="score-line">
        <strong>${categoryName} skill:</strong> ${scores[cat]} out of 30
      </div>`;
  }
  resultDiv.style.display = "block";
  drawRadarChart(scores);
  showInterpretation(scores);
  resultDiv.scrollIntoView({ behavior: "smooth" });
}

function drawRadarChart(scores) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Technical', 'Human', 'Conceptual'],
      datasets: [{
        label: 'Leadership Skills',
        data: [scores.technical, scores.human, scores.conceptual],
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: '#667eea',
        borderWidth: 3,
        pointBackgroundColor: ['#48bb78', '#667eea', '#764ba2'],
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top', labels: { color: '#2d3748', font: { size: 14, weight: '600' }, padding: 20 } },
        title: { display: true, text: 'Leadership Skills Radar Chart', color: '#2d3748', font: { size: 16, weight: 'bold' }, padding: { top: 10, bottom: 20 } }
      },
      scales: {
        r: {
          beginAtZero: true,
          min: 6,
          max: 30,
          ticks: { stepSize: 6, display: true, color: '#4a5568', font: { size: 12, weight: '600' } },
          grid: { display: true, color: 'rgba(102, 126, 234, 0.2)', lineWidth: 2 },
          angleLines: { display: true, color: 'rgba(102, 126, 234, 0.3)', lineWidth: 2 },
          pointLabels: { display: true, font: { size: 14, weight: 'bold' }, color: '#2d3748', padding: 10 }
        }
      },
      elements: { line: { borderWidth: 2 }, point: { radius: 6, hoverRadius: 8 } }
    }
  });
}

function showInterpretation(scores) {
  const ranges = [
    { min: 23, max: 30, label: 'High Range' },
    { min: 14, max: 22, label: 'Moderate Range' },
    { min: 6, max: 13, label: 'Low Range' }
  ];
  let html = '<h3>Scoring Interpretation</h3><ul>';
  for (const cat in scores) {
    const val = scores[cat];
    const range = ranges.find(r => val >= r.min && val <= r.max);
    html += `<li><strong>${cat.charAt(0).toUpperCase() + cat.slice(1)} skill:</strong> ${val} (${range ? range.label : 'Out of range'})</li>`;
  }
  html += '</ul>';
  html += `<p>The scores you received on the skills inventory provide information about your leadership skills in three areas. By comparing the differences between your scores, you can determine where you have leadership strengths and where you have leadership weaknesses.</p>`;
  document.getElementById("interpretation").innerHTML = html;
}
