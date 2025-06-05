// quiz1.js

const questions = [
  "When I think of leadership, I think of a person with special personality traits.",
  "Much like playing the piano or tennis, leadership is a learned ability.",
  "Leadership requires knowledge and know-how.",
  "Leadership is about what people do rather than who they are.",
  "Followers can influence the leadership process as much as leaders.",
  "Leadership is about the process of influencing others.",
  "Some people are born to be leaders.",
  "Some people have the natural ability to be leaders.",
  "The key to successful leadership is having the right skills.",
  "Leadership is best described by what leaders do.",
  "Leaders and followers share in the leadership process.",
  "Leadership is a series of actions directed toward positive ends.",
  "A person needs to have certain traits to be an effective leader.",
  "Everyone has the capacity to be a leader.",
  "Effective leaders are competent in their roles.",
  "The essence of leadership is performing tasks and dealing with people.",
  "Leadership is about the common purposes of leaders and followers.",
  "Leadership does not rely on the leader alone but is a process involving the leader, followers, and the situation.",
  "People become great leaders because of their traits.",
  "People can develop the ability to lead.",
  "Effective leaders have competence and knowledge.",
  "Leadership is about how leaders work with people to accomplish goals.",
  "Effective leadership is best explained by the leader–follower relationship.",
  "Leaders influence and are influenced by followers.",
];

const categories = {
  trait: [1, 7, 13, 19],
  ability: [2, 8, 14, 20],
  skill: [3, 9, 15, 21],
  behavior: [4, 10, 16, 22],
  relationship: [5, 11, 17, 23],
  process: [6, 12, 18, 24],
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing quiz');

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
      input.required = true; // each question is mandatory
      span.textContent = val;

      // Add event listener to handle checked state
      input.addEventListener('change', function() {
        // Remove checked class from all labels in this group
        const allLabels = radioGroup.querySelectorAll('label');
        allLabels.forEach(l => l.classList.remove('checked'));

        // Add checked class to the selected label
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
});

let chartInstance = null;

function calculateScores() {
  console.log('calculateScores function called');

  const form = document.getElementById("leadershipForm");
  if (!form.checkValidity()) {
    alert("Please answer all questions before submitting.");
    return;
  }

  const formData = new FormData(form);
  let scores = {
    trait: 0,
    ability: 0,
    skill: 0,
    behavior: 0,
    relationship: 0,
    process: 0,
  };

  for (const [key, val] of formData.entries()) {
    const num = parseInt(key.substring(1));
    const score = parseInt(val);
    for (const cat in categories) {
      if (categories[cat].includes(num)) {
        scores[cat] += score;
      }
    }
  }

  console.log('Calculated scores:', scores);

  // Display numeric scores
  const resultDiv = document.getElementById("results");
  const scoreDiv = document.getElementById("scores");
  scoreDiv.innerHTML = "";
  for (const cat in scores) {
    const categoryName = cat.charAt(0).toUpperCase() + cat.slice(1);
    scoreDiv.innerHTML += `
      <div class="score-line">
        <strong>${categoryName} emphasis:</strong> ${scores[cat]} out of 20
      </div>`;
  }
  resultDiv.style.display = "block";

  // Draw radar chart
  console.log('About to draw radar chart');
  drawRadarChart(scores);

  // Show interpretation
  showInterpretation(scores);

  // Scroll into view
  resultDiv.scrollIntoView({ behavior: "smooth" });
}

function drawRadarChart(scores) {
  console.log('drawRadarChart called with scores:', scores);

  const canvas = document.getElementById('radarChart');

  // Check if canvas exists
  if (!canvas) {
    console.error('Canvas element with id "radarChart" not found');
    console.log('Available elements with "chart" in id:',
      Array.from(document.querySelectorAll('[id*="chart"]')).map(el => el.id));
    return;
  }

  console.log('Canvas found:', canvas);
  console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
  console.log('Canvas parent:', canvas.parentElement);

  const ctx = canvas.getContext('2d');

  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }

  console.log('Chart.js version:', Chart.version);

  // Destroy existing chart if it exists
  if (chartInstance) {
    console.log('Destroying existing chart instance');
    chartInstance.destroy();
    chartInstance = null;
  }

  try {
    // Set canvas size explicitly
    canvas.width = 400;
    canvas.height = 400;

    chartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Trait', 'Ability', 'Skill', 'Behavior', 'Relationship', 'Process'],
        datasets: [{
          label: 'Leadership Dimensions',
          data: [
            scores.trait,
            scores.ability,
            scores.skill,
            scores.behavior,
            scores.relationship,
            scores.process
          ],
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: '#667eea',
          borderWidth: 3,
          pointBackgroundColor: [
            '#e53e3e', // Red for Trait
            '#38a169', // Green for Ability
            '#3182ce', // Blue for Skill
            '#d69e2e', // Yellow for Behavior
            '#805ad5', // Purple for Relationship
            '#dd6b20'  // Orange for Process
          ],
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointHoverBackgroundColor: [
            '#e53e3e', '#38a169', '#3182ce', '#d69e2e', '#805ad5', '#dd6b20'
          ],
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#2d3748',
              font: {
                size: 14,
                weight: '600'
              },
              padding: 20
            }
          },
          title: {
            display: true,
            text: 'Leadership Dimensions Radar Chart',
            color: '#2d3748',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          }
        },
        scales: {
          r: {
            beginAtZero: false,
            min: 4,
            max: 20,
            ticks: {
              stepSize: 4,
              display: true,
              backdropColor: 'rgba(255, 255, 255, 0.9)',
              color: '#4a5568',
              font: {
                size: 12,
                weight: '600'
              }
            },
            grid: {
              display: true,
              color: 'rgba(102, 126, 234, 0.2)',
              lineWidth: 2
            },
            angleLines: {
              display: true,
              color: 'rgba(102, 126, 234, 0.3)',
              lineWidth: 2
            },
            pointLabels: {
              display: true,
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#2d3748',
              padding: 10
            }
          }
        },
        elements: {
          line: {
            borderWidth: 2
          },
          point: {
            radius: 6,
            hoverRadius: 8
          }
        }
      }
    });

    console.log('Radar chart created successfully', chartInstance);

    // Force a resize to ensure proper rendering
    setTimeout(() => {
      if (chartInstance) {
        chartInstance.resize();
      }
    }, 100);

  } catch (error) {
    console.error('Error creating radar chart:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

function showInterpretation(scores) {
  const highestScore = Math.max(...Object.values(scores));
  const highestDim = Object.keys(scores).find(
    (key) => scores[key] === highestScore
  );

  const interpretations = {
    trait:
      "You believe leadership comes from special personality traits and natural gifts. You see leaders as having unique qualities that set them apart.",
    ability:
      "You view leadership as a learned skill that can be developed. You believe anyone can become a leader through practice and learning.",
    skill:
      "You think leadership requires specific knowledge and competence. You emphasize the importance of having the right skills and know-how.",
    behavior:
      "You focus on what leaders do rather than who they are. You believe leadership is about actions and behaviors.",
    relationship:
      "You see leadership as centered on communication between leaders and followers. You believe it's about building connections and relationships.",
    process:
      "You view leadership as involving leaders, followers, and situations working together. You see it as a collaborative process.",
  };

  const highestScoreDiv = document.getElementById("highest-score");
  const nameCap = highestDim.charAt(0).toUpperCase() + highestDim.slice(1);
  highestScoreDiv.innerHTML = `
    <strong>Your Highest Score: ${nameCap} (${highestScore}/20)</strong><br>
    ${interpretations[highestDim]}
  `;
}
