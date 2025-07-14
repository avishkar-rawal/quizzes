// SLII® Situational Leadership Questionnaire

const scenarios = [
  {
    id: 1,
    title: "Budget Consolidation Project",
    description: "Because of budget restrictions imposed on your department, it is necessary to consolidate. You are thinking of asking a highly capable and experienced member of your department to take charge of the consolidation. This person has worked in all areas of your department and has the trust and respect of most of the staff. She is very willing to help with the consolidation.",
    options: [
      { id: 'A', text: "Assign the project to her and let her determine how to accomplish it.", style: 'S4' },
      { id: 'B', text: "Assign the task to her, indicate to her precisely what must be done, and supervise her work closely.", style: 'S1' },
      { id: 'C', text: "Assign the task to her and provide support and encouragement as needed.", style: 'S3' },
      { id: 'D', text: "Assign the task to her and indicate to her precisely what must be done but make sure you incorporate her suggestions.", style: 'S2' }
    ],
    correctAnswer: 'A',
    explanation: "This person is at Development Level 4 (high competence, high commitment), which calls for a delegative approach (S4): low supportive–low directive leadership."
  },
  {
    id: 2,
    title: "Inexperienced Employee Follow-through",
    description: "You have recently been made a department head of the new regional office. In getting to know your departmental staff, you have noticed that one of your inexperienced employees is not following through on assigned tasks. She is enthusiastic about her new job and wants to get ahead in the organization.",
    options: [
      { id: 'A', text: "Discuss the lack of follow-through with her and explain the alternative ways this problem can be solved.", style: 'S2' },
      { id: 'B', text: "Specify what she must do to complete the tasks but incorporate any suggestions she may have.", style: 'S2' },
      { id: 'C', text: "Define the steps necessary for her to complete the assigned tasks and monitor her performance frequently.", style: 'S1' },
      { id: 'D', text: "Let her know about the lack of follow-through and give her more time to improve her performance.", style: 'S3' }
    ],
    correctAnswer: 'C',
    explanation: "This follower is at Development Level 1 (low competence, high commitment). The SLII® approach prescribes directing (S1) leadership: high directive, low supportive."
  },
  {
    id: 3,
    title: "Team Morale and Performance Issues",
    description: "Because of a new and very important unit project, for the past three months you have made sure that your staff members understood their responsibilities and expected level of performance, and you have supervised them closely. Due to some recent project setbacks, your staff members have become somewhat discouraged. Their morale has dropped, and so has their performance.",
    options: [
      { id: 'A', text: "Continue to direct and closely supervise their performance.", style: 'S1' },
      { id: 'B', text: "Give the group members more time to overcome the setbacks but occasionally check their progress.", style: 'S4' },
      { id: 'C', text: "Continue to define group activities but involve the group members more in decision making and incorporate their ideas.", style: 'S2' },
      { id: 'D', text: "Participate in the group members' problem-solving activities and encourage and support their efforts to overcome the project setbacks.", style: 'S3' }
    ],
    correctAnswer: 'C',
    explanation: "The followers have developed some competence but lost motivation due to setbacks (Development Level 2). The correct response is a coaching style (S2): high directive, high supportive."
  },
  {
    id: 4,
    title: "Sales Campaign Assignment",
    description: "As a director of the sales department, you have asked a member of your staff to take charge of a new sales campaign. You have worked with this person on other sales campaigns, and you know he has the job knowledge and experience to be successful at new assignments. However, he seems a little unsure about his ability to do the job.",
    options: [
      { id: 'A', text: "Assign the new sales campaign to him and let him function on his own.", style: 'S4' },
      { id: 'B', text: "Set goals and objectives for this new assignment but consider his suggestions and involve him in decision making.", style: 'S2' },
      { id: 'C', text: "Listen to his concerns but assure him he can do the job and support his efforts.", style: 'S3' },
      { id: 'D', text: "Tell him exactly what the new campaign involves and what you expect of him, and supervise his performance closely.", style: 'S1' }
    ],
    correctAnswer: 'C',
    explanation: "This person has high competence but variable commitment/confidence (Development Level 3). The appropriate style is supporting (S3): low directive, high supportive."
  }
];

const styleDescriptions = {
  S1: { name: "Directing", description: "High Directive, Low Supportive - Provide clear instructions and close supervision", color: '#f56565' },
  S2: { name: "Coaching", description: "High Directive, High Supportive - Direct and explain while encouraging input", color: '#ecc94b' },
  S3: { name: "Supporting", description: "Low Directive, High Supportive - Encourage and facilitate decision-making", color: '#48bb78' },
  S4: { name: "Delegating", description: "Low Directive, Low Supportive - Turn over responsibility for decisions", color: '#667eea' }
};

let chartInstances = {
  style: null,
  radar: null
};

document.addEventListener('DOMContentLoaded', function() {
  generateQuestions();
  setupChartTabs();
});

function generateQuestions() {
  const container = document.getElementById("questions");
  if (!container) return;
  
  scenarios.forEach((scenario, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    
    const scenarioDiv = document.createElement("div");
    scenarioDiv.className = "scenario";
    scenarioDiv.innerHTML = `<strong>${scenario.title}</strong><br><br>${scenario.description}`;
    
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "answer-options";
    
    scenario.options.forEach(option => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "answer-option";
      
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `scenario${scenario.id}`;
      input.value = option.style;
      input.id = `s${scenario.id}_${option.id}`;
      // input.required = true; // HTML5 validation, not strictly needed for our manual check

      // Create a label for the text part, associating it with the input
      // This improves accessibility and click handling.
      const labelTextNode = document.createElement('label');
      labelTextNode.htmlFor = input.id; // Associate label with input ID
      labelTextNode.innerHTML = `<span class="option-label">${option.id}.</span> ${option.text}`;
      
      optionDiv.appendChild(input);
      optionDiv.appendChild(labelTextNode); // Append the actual label element
      
      // Event listener on the entire optionDiv
      optionDiv.addEventListener('click', function() {
        // Ensure the radio button associated with this div is checked
        if (!input.checked) {
          input.checked = true;
        }

        // Update visual 'selected' state for all options in this specific scenario's group
        const allRadioInputsInGroup = document.querySelectorAll(`input[name="scenario${scenario.id}"]`);
        allRadioInputsInGroup.forEach(radioInGroup => {
          const parentDiv = radioInGroup.closest('.answer-option');
          if (parentDiv) {
            if (radioInGroup.checked) {
              parentDiv.classList.add('selected');
            } else {
              parentDiv.classList.remove('selected');
            }
          }
        });
      });
      
      optionsDiv.appendChild(optionDiv);
    });
    
    questionDiv.appendChild(scenarioDiv);
    questionDiv.appendChild(optionsDiv);
    container.appendChild(questionDiv);
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

function calculateScores() {
  // Check if all questions are answered
  let allAnswered = true;
  scenarios.forEach(scenario => {
    const selected = document.querySelector(`input[name="scenario${scenario.id}"]:checked`);
    if (!selected) {
      allAnswered = false;
    }
  });
  
  if (!allAnswered) {
    alert("Please answer all questions before submitting.");
    return;
  }
  
  let styleScores = { S1: 0, S2: 0, S3: 0, S4: 0 };
  let userAnswers = {};
  
  scenarios.forEach(scenario => {
    const selected = document.querySelector(`input[name="scenario${scenario.id}"]:checked`);
    if (selected) {
      styleScores[selected.value]++;
      userAnswers[scenario.id] = selected.value;
    }
  });
  
  displayResults(styleScores, userAnswers);
  createStyleChart(styleScores);
  createRadarChart(styleScores);
  showCorrectAnswers(userAnswers);
  showInterpretation(styleScores);
  
  document.getElementById("results").style.display = "block";
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

function displayResults(styleScores, userAnswers) {
  const scoreDiv = document.getElementById("scores");
  const totalQuestions = scenarios.length;
  let correctCount = 0;
  
  scenarios.forEach(scenario => {
    const userAnswer = userAnswers[scenario.id];
    const correctStyle = scenario.options.find(opt => opt.id === scenario.correctAnswer).style;
    if (userAnswer === correctStyle) correctCount++;
  });
  
  const dominantStyle = Object.keys(styleScores).reduce((a, b) => 
    styleScores[a] > styleScores[b] ? a : b
  );
  
  scoreDiv.innerHTML = `
    <div class="score-line" style="border-left-color: #48bb78">
      <strong>Overall Accuracy:</strong> ${correctCount}/${totalQuestions} scenarios answered correctly (${Math.round((correctCount/totalQuestions)*100)}%)
    </div>
    <div class="score-line" style="border-left-color: ${styleDescriptions[dominantStyle].color}">
      <strong>Dominant Style:</strong> ${styleDescriptions[dominantStyle].name} (${styleScores[dominantStyle]}/${totalQuestions} selections)
    </div>
  `;
  
  const styleSummary = document.getElementById("styleSummary");
  styleSummary.innerHTML = `
    <h4>Your Leadership Style Preferences:</h4>
    <div class="dominant-style">${styleDescriptions[dominantStyle].name}</div>
    <p>${styleDescriptions[dominantStyle].description}</p>
  `;
}

function createStyleChart(styleScores) {
  const canvas = document.getElementById('styleChart');
  if (!canvas) return;
  
  if (chartInstances.style) {
    chartInstances.style.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  chartInstances.style = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(styleScores).map(style => 
        `${style} - ${styleDescriptions[style].name}`
      ),
      datasets: [{
        data: Object.values(styleScores),
        backgroundColor: Object.keys(styleScores).map(style => styleDescriptions[style].color),
        borderWidth: 3,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: { size: 12 }
          }
        }
      }
    }
  });
}

function createRadarChart(styleScores) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  
  if (chartInstances.radar) {
    chartInstances.radar.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  chartInstances.radar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['S1 - Directing', 'S2 - Coaching', 'S3 - Supporting', 'S4 - Delegating'],
      datasets: [{
        label: 'Your Leadership Style Usage',
        data: [styleScores.S1, styleScores.S2, styleScores.S3, styleScores.S4],
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: '#667eea',
        borderWidth: 3,
        pointBackgroundColor: ['#f56565', '#ecc94b', '#48bb78', '#667eea'],
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 4,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

function showCorrectAnswers(userAnswers) {
  const container = document.getElementById("correctAnswers");
  let html = '';
  
  scenarios.forEach(scenario => {
    const userAnswer = userAnswers[scenario.id];
    const correctOption = scenario.options.find(opt => opt.id === scenario.correctAnswer);
    const userOption = scenario.options.find(opt => opt.style === userAnswer);
    const isCorrect = userAnswer === correctOption.style;
    
    html += `
      <div class="correct-answer-item ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="answer-status ${isCorrect ? 'correct' : 'incorrect'}">
          ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
        </div>
        <h4>${scenario.title}</h4>
        <p><strong>Your Answer:</strong> ${userOption ? scenario.options.find(opt => opt.style === userAnswer).id : 'N/A'} - ${styleDescriptions[userAnswer].name}</p>
        <p><strong>Correct Answer:</strong> ${scenario.correctAnswer} - ${styleDescriptions[correctOption.style].name}</p>
        <p><strong>Explanation:</strong> ${scenario.explanation}</p>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function showInterpretation(styleScores) {
  const totalQuestions = scenarios.length;
  const flexibility = Object.values(styleScores).filter(score => score > 0).length;
  
  let interpretation = `
    <h3>Your SLII® Leadership Assessment Interpretation</h3>
    <p>Your results provide insights into your leadership style preferences and adaptability:</p>
    <ul>
      <li><strong>Style Flexibility:</strong> You used ${flexibility} out of 4 possible leadership styles</li>
      <li><strong>Adaptability:</strong> ${flexibility >= 3 ? 'High - You adapt your style to different situations' : 'Moderate - Consider developing more style flexibility'}</li>
    </ul>
    <h4>Understanding the SLII® Model:</h4>
    <p>The SLII® model suggests that effective leaders adapt their style based on the follower's development level:</p>
    <ul>
      <li><strong>D1 (Low Competence, High Commitment):</strong> Needs S1 - Directing</li>
      <li><strong>D2 (Some Competence, Low Commitment):</strong> Needs S2 - Coaching</li>
      <li><strong>D3 (High Competence, Variable Commitment):</strong> Needs S3 - Supporting</li>
      <li><strong>D4 (High Competence, High Commitment):</strong> Needs S4 - Delegating</li>
    </ul>
  `;
  
  document.getElementById("interpretation").innerHTML = interpretation;
}
