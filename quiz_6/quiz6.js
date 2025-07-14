const questions = [
  "I let followers know what is expected of them.",
  "I maintain a friendly working relationship with followers.",
  "I consult with followers when facing a problem.",
  "I listen receptively to followers’ ideas and suggestions.",
  "I inform followers about what needs to be done and how it needs to be done.",
  "I let followers know that I expect them to perform at their highest level.",
  "I act without consulting my followers.", // Reverse
  "I do little things to make it pleasant to be a member of the group.",
  "I ask followers to follow standard rules and regulations.",
  "I set goals for followers’ performance that are quite challenging.",
  "I say things that hurt followers’ personal feelings.", // Reverse
  "I ask for suggestions from followers concerning how to carry out assignments.",
  "I encourage continual improvement in followers’ performance.",
  "I explain the level of performance that is expected of followers.",
  "I help followers overcome problems that stop them from carrying out their tasks.",
  "I show that I have doubts about followers’ ability to meet most objectives.", // Reverse
  "I ask followers for suggestions on what assignments should be made.",
  "I give vague explanations of what is expected of followers on the job.", // Reverse
  "I consistently set challenging goals for followers to attain.",
  "I behave in a manner that is thoughtful of followers’ personal needs."
];

const scoringConfig = {
  directive: { items: [1, 5, 9, 14, 18], color: '#E53E3E' }, // Red
  supportive: { items: [2, 8, 11, 15, 20], color: '#38A169' }, // Green
  participative: { items: [3, 4, 7, 12, 17], color: '#3182CE' }, // Blue
  achievement: { items: [6, 10, 13, 16, 19], color: '#D69E2E' } // Yellow
};
const reverseScoreItems = [7, 11, 16, 18];

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

    [1, 2, 3, 4, 5, 6, 7].forEach((val) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const span = document.createElement("span");
      input.type = "radio";
      input.name = `q${num}`;
      input.value = val;
      input.required = true;
      span.textContent = val;

      input.addEventListener('change', function() {
        const allLabelsInGroup = radioGroup.querySelectorAll('label');
        allLabelsInGroup.forEach(l => l.classList.remove('checked'));
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
      
      const targetViewId = `${tab.dataset.chart}-view`;
      const targetView = document.getElementById(targetViewId);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });
}

let chartInstances = { 
  radar: null, 
  pie: null // Updated from doughnut
};

function calculateScores() {
  const form = document.getElementById("pathGoalForm");
  if (!form.checkValidity()) {
    alert("Please answer all questions before submitting.");
    return;
  }

  const formData = new FormData(form);
  let rawScores = {};
  for (let i = 1; i <= questions.length; i++) {
    rawScores[i] = parseInt(formData.get(`q${i}`));
  }

  let finalScores = { directive: 0, supportive: 0, participative: 0, achievement: 0 };

  for (const style in scoringConfig) {
    scoringConfig[style].items.forEach(itemNum => {
      let score = rawScores[itemNum];
      if (reverseScoreItems.includes(itemNum)) {
        score = 8 - score; 
      }
      finalScores[style] += score;
    });
  }
  
  displayScores(finalScores);
  drawRadarChart(finalScores);
  drawPieChart(finalScores); // Renamed from drawDoughnutChart
  showInterpretation(finalScores);

  const resultDiv = document.getElementById("results");
  resultDiv.style.display = "block";
  resultDiv.scrollIntoView({ behavior: "smooth" });
}

function getScoreCategory(score) {
    if (score >= 29) return { label: 'High', color: '#48bb78' };
    if (score >= 18) return { label: 'Moderate', color: '#ecc94b' };
    return { label: 'Low', color: '#f56565' };
}

function displayScores(scores) {
  const scoreDiv = document.getElementById("scores");
  scoreDiv.innerHTML = ""; 
  for (const style in scores) {
    const score = scores[style];
    const category = getScoreCategory(score);
    const styleName = style.charAt(0).toUpperCase() + style.slice(1);
    scoreDiv.innerHTML += `
      <div class="score-line" style="border-left-color: ${category.color};">
        <strong>${styleName} Style:</strong> ${score} / 35 (${category.label})
      </div>`;
  }
}

function drawRadarChart(scores) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (chartInstances.radar) chartInstances.radar.destroy();

  chartInstances.radar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Directive', 'Supportive', 'Participative', 'Achievement-Oriented'],
      datasets: [{
        label: 'Your Leadership Styles',
        data: [scores.directive, scores.supportive, scores.participative, scores.achievement],
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: '#667eea',
        borderWidth: 3,
        pointBackgroundColor: [scoringConfig.directive.color, scoringConfig.supportive.color, scoringConfig.participative.color, scoringConfig.achievement.color],
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true, // Start at 0 for better comparison from baseline
          min: 0, // Min possible score is 5, but 0 makes graph cleaner
          max: 35, // Max possible score
          ticks: { stepSize: 5 }
        }
      },
      plugins: { legend: { position: 'top' } }
    }
  });
}

function drawPieChart(scores) { // Renamed from drawDoughnutChart
  const canvas = document.getElementById('pieChart'); // Renamed from doughnutChart
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (chartInstances.pie) chartInstances.pie.destroy(); // Updated from doughnut

  const labels = Object.keys(scores).map(style => style.charAt(0).toUpperCase() + style.slice(1));
  const data = Object.values(scores);
  const backgroundColors = Object.keys(scores).map(style => scoringConfig[style].color);

  chartInstances.pie = new Chart(ctx, { // Updated from doughnut
    type: 'pie', // Changed from 'doughnut' to 'pie'
    data: {
      labels: labels,
      datasets: [{
        label: 'Style Proportions',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Leadership Style Proportions'
        }
      }
    }
  });
}

function showInterpretation(scores) {
  const interpretationDiv = document.getElementById("interpretation");
  let html = `<h3>Interpreting Your Path-Goal Leadership Styles</h3>
              <p>Your scores indicate your preference for different leadership styles. Understanding these can help you adapt your approach to various situations and follower needs.</p><ul>`;

  const interpretations = {
    directive: "<strong>Directive:</strong> You tend to provide clear expectations, specific guidance, and standards of performance. This style is often effective when tasks are ambiguous or followers are inexperienced.",
    supportive: "<strong>Supportive:</strong> You focus on creating a friendly and supportive work environment, showing concern for followers' well-being and needs. This can boost morale and is helpful when tasks are stressful or monotonous.",
    participative: "<strong>Participative:</strong> You prefer to consult with followers, involving them in decision-making and considering their ideas. This style can increase motivation and is useful when followers are knowledgeable and want to be involved.",
    achievement: "<strong>Achievement-Oriented:</strong> You set challenging goals, expect high performance, and show confidence in followers' abilities. This style is effective for motivating skilled followers who thrive on challenges."
  };

  for (const style in scores) {
    const score = scores[style];
    const category = getScoreCategory(score);
    html += `<li><strong>${style.charAt(0).toUpperCase() + style.slice(1)} (${category.label}):</strong> ${interpretations[style]}</li>`;
  }
  html += `</ul><p>Effective leaders often use a mix of these styles, adapting to the specific needs of their followers and the situation at hand. Consider how your dominant styles align with your current leadership challenges and where developing other styles might be beneficial.</p>`;
  interpretationDiv.innerHTML = html;
}

function drawDoughnutChart(scores) {
  const canvas = document.getElementById('doughnutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (chartInstances.doughnut) chartInstances.doughnut.destroy();

  const labels = Object.keys(scores).map(style => style.charAt(0).toUpperCase() + style.slice(1));
  const data = Object.values(scores);
  const backgroundColors = Object.keys(scores).map(style => scoringConfig[style].color);

  chartInstances.doughnut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Style Proportions',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Leadership Style Proportions'
        }
      }
    }
  });
}

function drawPolarAreaChart(scores) {
  const canvas = document.getElementById('polarAreaChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (chartInstances.polarArea) chartInstances.polarArea.destroy();
  
  const labels = Object.keys(scores).map(style => style.charAt(0).toUpperCase() + style.slice(1));
  const data = Object.values(scores);
  const backgroundColors = Object.keys(scores).map(style => scoringConfig[style].color.replace(')', ', 0.7)').replace('rgb', 'rgba')); // Add alpha

  chartInstances.polarArea = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: labels,
      datasets: [{
        label: 'Style Magnitudes',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: Object.keys(scores).map(style => scoringConfig[style].color),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 35,
          ticks: { stepSize: 5, backdropColor: 'rgba(255, 255, 255, 0.75)' }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Leadership Style Magnitudes'
        }
      }
    }
  });
}

function drawVerticalBarChart(scores) {
  const canvas = document.getElementById('verticalBarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (chartInstances.verticalBar) chartInstances.verticalBar.destroy();

  const labels = Object.keys(scores).map(style => style.charAt(0).toUpperCase() + style.slice(1));
  const data = Object.values(scores);
  const backgroundColors = data.map(score => getScoreCategory(score).color);


  chartInstances.verticalBar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Your Scores',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace(')', ', 1)').replace('rgb', 'rgba')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 35,
          title: { display: true, text: 'Score (out of 35)' }
        },
        x: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Leadership Style Scores (Vertical)'
        },
        annotation: {
            annotations: {
              lowModerateLine: {
                type: 'line',
                yMin: 17.5, yMax: 17.5,
                borderColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderDash: [5,5],
                label: { content: 'Low | Moderate', display: true, position: 'end', font: {size: 10}, yAdjust: -10 }
              },
              moderateHighLine: {
                type: 'line',
                yMin: 28.5, yMax: 28.5,
                borderColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderDash: [5,5],
                label: { content: 'Moderate | High', display: true, position: 'end', font: {size: 10}, yAdjust: -10 }
              }
            }
          }
      }
    }
  });
}

function showInterpretation(scores) {
  const interpretationDiv = document.getElementById("interpretation");
  let html = `<h3>Interpreting Your Path-Goal Leadership Styles</h3>
              <p>Your scores indicate your preference for different leadership styles. Understanding these can help you adapt your approach to various situations and follower needs.</p><ul>`;

  const interpretations = {
    directive: "<strong>Directive:</strong> You tend to provide clear expectations, specific guidance, and standards of performance. This style is often effective when tasks are ambiguous or followers are inexperienced.",
    supportive: "<strong>Supportive:</strong> You focus on creating a friendly and supportive work environment, showing concern for followers' well-being and needs. This can boost morale and is helpful when tasks are stressful or monotonous.",
    participative: "<strong>Participative:</strong> You prefer to consult with followers, involving them in decision-making and considering their ideas. This style can increase motivation and is useful when followers are knowledgeable and want to be involved.",
    achievement: "<strong>Achievement-Oriented:</strong> You set challenging goals, expect high performance, and show confidence in followers' abilities. This style is effective for motivating skilled followers who thrive on challenges."
  };

  for (const style in scores) {
    const score = scores[style];
    const category = getScoreCategory(score);
    html += `<li><strong>${style.charAt(0).toUpperCase() + style.slice(1)} (${category.label}):</strong> ${interpretations[style]}</li>`;
  }
  html += `</ul><p>Effective leaders often use a mix of these styles, adapting to the specific needs of their followers and the situation at hand. Consider how your dominant styles align with your current leadership challenges and where developing other styles might be beneficial.</p>`;
  interpretationDiv.innerHTML = html;
}
