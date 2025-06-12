// quiz4.js - Leadership Behavior Questionnaire

const questions = [
  "Tells group members what they are supposed to do.",
  "Acts friendly with members of the group.",
  "Sets standards of performance for group members.",
  "Helps others in the group feel comfortable.",
  "Makes suggestions about how to solve problems.",
  "Responds favorably to suggestions made by others.",
  "Makes their perspective clear to others.",
  "Treats others fairly.",
  "Develops a plan of action for the group.",
  "Behaves in a predictable manner toward group members.",
  "Defines role responsibilities for each group member.",
  "Communicates actively with group members.",
  "Clarifies their own role within the group.",
  "Shows concern for the well-being of others.",
  "Provides a plan for how the work is to be done.",
  "Shows flexibility in making decisions.",
  "Provides criteria for what is expected of the group.",
  "Discloses thoughts and feelings to group members.",
  "Encourages group members to do high-quality work.",
  "Helps group members get along with each other."
];

// Industry leader average scores for comparison
const leaderAverages = {
  task: 42, // Example value
  relationship: 40 // Example value
};

// Categories - odd questions are for task, even for relationship
const categories = {
  task: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  relationship: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
};

// Initialize the quiz when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing quiz');
  
  // Generate the quiz questions
  generateQuestions();
  
  // Set up the chart tabs functionality
  setupChartTabs();
});

// Generate quiz questions dynamically
function generateQuestions() {
  const container = document.getElementById("questions");
  if (!container) {
    console.error('Questions container not found');
    return;
  }
  
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
  
  console.log('Quiz questions initialized');
}

// Set up chart tabs
function setupChartTabs() {
  const tabs = document.querySelectorAll('.chart-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all views
      const views = document.querySelectorAll('.chart-view');
      views.forEach(v => v.classList.remove('active'));
      
      // Show the selected view
      const targetView = document.getElementById(`${tab.dataset.chart}-view`);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });
}

// Chart instances to keep track of them
let chartInstances = {
  quadrant: null,
  bar: null
};

// Calculate scores and display results
function calculateScores() {
  const form = document.getElementById("leadershipForm");
  if (!form.checkValidity()) {
    alert("Please answer all questions before submitting.");
    return;
  }
  
  const formData = new FormData(form);
  let scores = { task: 0, relationship: 0 };
  
  for (const [key, val] of formData.entries()) {
    const num = parseInt(key.substring(1));
    const score = parseInt(val);
    
    if (categories.task.includes(num)) {
      scores.task += score;
    } else if (categories.relationship.includes(num)) {
      scores.relationship += score;
    }
  }
  
  console.log('Calculated scores:', scores);
  
  // Display scores
  displayScores(scores);
  
  // Create charts
  createQuadrantChart(scores, leaderAverages);
  createBarChart(scores, leaderAverages);
  
  // Show interpretation
  showInterpretation(scores);
  
  // Display results section
  const resultDiv = document.getElementById("results");
  resultDiv.style.display = "block";
  resultDiv.scrollIntoView({ behavior: "smooth" });
}

// Display scores in the result section
function displayScores(scores) {
  const scoreDiv = document.getElementById("scores");
  scoreDiv.innerHTML = "";
  
  // Define score ranges
  const ranges = [
    { min: 40, max: 50, label: 'High Range', color: '#48bb78' },
    { min: 30, max: 39, label: 'Moderate Range', color: '#ecc94b' },
    { min: 10, max: 29, label: 'Low Range', color: '#f56565' }
  ];
  
  // Display score for each category
  for (const cat in scores) {
    const categoryName = cat.charAt(0).toUpperCase() + cat.slice(1);
    const score = scores[cat];
    const range = ranges.find(r => score >= r.min && score <= r.max) || 
                  { label: 'Out of range', color: '#a0aec0' };
    
    scoreDiv.innerHTML += `
      <div class="score-line" style="border-left-color: ${range.color}">
        <strong>${categoryName} orientation:</strong> ${score} out of 50 (${range.label})
      </div>`;
  }
}

// Create quadrant chart (scatter plot)
function createQuadrantChart(scores, leaderAverages) {
  const canvas = document.getElementById('quadrantChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Destroy existing chart if it exists
  if (chartInstances.quadrant) {
    chartInstances.quadrant.destroy();
    chartInstances.quadrant = null;
  }
  
  const data = {
    datasets: [
      {
        label: 'Your Score',
        data: [{x: scores.task, y: scores.relationship}],
        backgroundColor: 'rgba(72, 187, 120, 0.7)',
        borderColor: 'rgba(72, 187, 120, 1)',
        pointRadius: 10,
        pointHoverRadius: 12
      },
      {
        label: 'Industry Leader Average',
        data: [{x: leaderAverages.task, y: leaderAverages.relationship}],
        backgroundColor: 'rgba(102, 126, 234, 0.7)',
        borderColor: 'rgba(102, 126, 234, 1)',
        pointRadius: 10,
        pointHoverRadius: 12
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 10,
        max: 50,
        title: {
          display: true,
          text: 'Task Orientation',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        min: 10,
        max: 50,
        title: {
          display: true,
          text: 'Relationship Orientation',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const point = context.raw;
            return `Task: ${point.x}, Relationship: ${point.y}`;
          }
        }
      },
      annotation: {
        annotations: {
          xLine: {
            type: 'line',
            xMin: 30,
            xMax: 30,
            yMin: 10,
            yMax: 50,
            borderColor: 'rgba(0, 0, 0, 0.3)',
            borderWidth: 1,
            borderDash: [5, 5]
          },
          yLine: {
            type: 'line',
            xMin: 10,
            xMax: 50,
            yMin: 30,
            yMax: 30,
            borderColor: 'rgba(0, 0, 0, 0.3)',
            borderWidth: 1,
            borderDash: [5, 5]
          },
          q1Label: {
            type: 'label',
            xValue: 40,
            yValue: 40,
            content: ['High Task', 'High Relationship'],
            font: {
              size: 12
            }
          },
          q2Label: {
            type: 'label',
            xValue: 20,
            yValue: 40,
            content: ['Low Task', 'High Relationship'],
            font: {
              size: 12
            }
          },
          q3Label: {
            type: 'label',
            xValue: 20,
            yValue: 20,
            content: ['Low Task', 'Low Relationship'],
            font: {
              size: 12
            }
          },
          q4Label: {
            type: 'label',
            xValue: 40,
            yValue: 20,
            content: ['High Task', 'Low Relationship'],
            font: {
              size: 12
            }
          }
        }
      }
    }
  };
  
  chartInstances.quadrant = new Chart(ctx, {
    type: 'scatter',
    data: data,
    options: options
  });
}

// Create bar chart
function createBarChart(scores, leaderAverages) {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Destroy existing chart if it exists
  if (chartInstances.bar) {
    chartInstances.bar.destroy();
    chartInstances.bar = null;
  }
  
  chartInstances.bar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Task Orientation', 'Relationship Orientation'],
      datasets: [
        {
          label: 'Your Score',
          data: [scores.task, scores.relationship],
          backgroundColor: [
            'rgba(72, 187, 120, 0.7)',
            'rgba(72, 187, 120, 0.7)'
          ],
          borderColor: [
            'rgba(72, 187, 120, 1)',
            'rgba(72, 187, 120, 1)'
          ],
          borderWidth: 1
        },
        {
          label: 'Industry Leader Average',
          data: [leaderAverages.task, leaderAverages.relationship],
          backgroundColor: [
            'rgba(102, 126, 234, 0.7)',
            'rgba(102, 126, 234, 0.7)'
          ],
          borderColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(102, 126, 234, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: 10,
          max: 50,
          title: {
            display: true,
            text: 'Score',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        annotation: {
          annotations: {
            highLine: {
              type: 'line',
              yMin: 40,
              yMax: 40,
              borderColor: '#48bb78',
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: 'High',
                display: true,
                position: 'end'
              }
            },
            modLine: {
              type: 'line',
              yMin: 30,
              yMax: 30,
              borderColor: '#ecc94b',
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: 'Moderate',
                display: true,
                position: 'end'
              }
            }
          }
        }
      }
    }
  });
}

// Show interpretation of scores
function showInterpretation(scores) {
  const ranges = [
    { min: 40, max: 50, label: 'High Range' },
    { min: 30, max: 39, label: 'Moderate Range' },
    { min: 10, max: 29, label: 'Low Range' }
  ];
  
  // Get range for each score
  const taskRange = ranges.find(r => scores.task >= r.min && scores.task <= r.max);
  const relationshipRange = ranges.find(r => scores.relationship >= r.min && scores.relationship <= r.max);
  
  // Determine leadership style based on scores
  let leadershipStyle = '';
  if (scores.task >= 40 && scores.relationship >= 40) {
    leadershipStyle = 'Team Leader';
  } else if (scores.task >= 40 && scores.relationship < 30) {
    leadershipStyle = 'Authoritarian Leader';
  } else if (scores.task < 30 && scores.relationship >= 40) {
    leadershipStyle = 'Country Club Leader';
  } else if (scores.task < 30 && scores.relationship < 30) {
    leadershipStyle = 'Impoverished Leader';
  } else {
    leadershipStyle = 'Middle-of-the-Road Leader';
  }
  
  // Create the HTML for the interpretation
  let html = `
    <h3>Your Leadership Behavior Profile</h3>
    <p>Your results indicate the following:</p>
    <ul>
      <li><strong>Task orientation:</strong> ${scores.task}/50 (${taskRange?.label || 'Undefined'})</li>
      <li><strong>Relationship orientation:</strong> ${scores.relationship}/50 (${relationshipRange?.label || 'Undefined'})</li>
    </ul>
    <p><strong>Your dominant leadership style appears to be:</strong> ${leadershipStyle}</p>
    <h4>What This Means:</h4>
    <p>The score you receive for task refers to the degree to which you help others by defining their roles and letting them know what is expected of them. This factor describes your tendencies to be task directed toward others when you are in a leadership position.</p>
    <p>The score you receive for relationship is a measure of the degree to which you try to make followers feel comfortable with themselves, each other, and the group itself. It represents a measure of how people oriented you are.</p>
    <p>As you interpret your responses, consider if there are ways you could change your behavior to shift the emphasis you give to tasks and relationships depending on your leadership goals and the needs of your team.</p>
  `;
  
  document.getElementById("interpretation").innerHTML = html;
}
