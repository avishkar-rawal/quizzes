const questions = [
    {
        category: "One-on-One",
        behaviors: [
            "I begin our interaction by showing interest in the other person (e.g., asking questions, sharing something personal, and inviting the other person to share as well).",
            "I make eye contact with the person.",
            "I face the individual I am speaking with.",
            "I put away all distractions such as my cell phone.",
            "I eliminate physical or technological barriers between us, such as sitting behind my desk and/or keeping my camera off.",
            "I ask open-ended questions to learn about the other person.",
            "I regularly designate time for people to come and talk to me.",
            "I treat each and every person with respect and dignity.",
            "I recognize and reward employees/people according to their individual motivations."
        ]
    },
    {
        category: "Teams (as leader)",
        behaviors: [
            "I identify unique skill sets of team members.",
            "I use the full range of talents on my team to achieve work objectives.",
            "I ask everyone on the team for input and through different means (in person, via email, pulse checks, etc.).",
            "I ask everyone on the team what and how they want to contribute.",
            "I configure project teams to include people who do not regularly interact with one another.",
            "I provide different members of the team with leadership opportunities.",
            "I seek feedback from others and make changes based on that feedback."
        ]
    },
    {
        category: "Teams (as facilitator)",
        behaviors: [
            "I prepare an agenda and send it out ahead of a meeting so that people can prepare and better participate.",
            "I utilize a process in which everyone gives feedback and input at times (e.g., nominal group technique, round-robin discussion, online real-time data collection tools).",
            "When possible, I ask team members to provide updates rather than being the only one to speak.",
            "I adapt physical arrangements such as seating and/or technology that allows people to interact with one another.",
            "When someone new joins the team or when a team is forming, I ask for everyone's preferred names, pronunciations, and pronouns.",
            "I encourage conflicting views and/or dissension within team discussions.",
            "I create \"airtime\" limits so that outspoken people do not dominate the conversation."
        ]
    },
    {
        category: "Teams (as participant)",
        behaviors: [
            "We rotate roles in team meetings each time (time keeper, note-taker, action item capturer, etc.).",
            "If a colleague is interrupted by someone, I will say that I would like to hear the colleague finish the thought, prompting the group to go back to let that person finish speaking.",
            "I come prepared to share my thoughts and ideas.",
            "If a colleague has been silent during the meeting, I will encourage the colleague to share by saying something like \"I would love to hear what you are thinking about this issue.\""
        ]
    },
    {
        category: "Mentor/Protégé",
        behaviors: [
            "I ask my protégé about preferred work style and communication cadence.",
            "I discuss and develop a list of expectations with my protégé such that we are both able to clarify expectations of one another early in the relationship.",
            "Rather than assume I know what is best, I start meetings with my protégé by asking how our time together can be most useful for the protégé."
        ]
    }
];

let currentQuestionIndex = 0;
let currentChart = null;
let currentChartType = 'bar';
let chartData = null;

function initializeQuiz() {
    renderQuestions();
    document.getElementById('leadershipForm').addEventListener('submit', calculateScores);
    document.getElementById('randomSelectBtn').addEventListener('click', randomSelectAnswers);
    
    // Chart tab functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentChartType = e.target.dataset.chart;
            if (chartData) {
                createChart(chartData.scores, chartData.totalNoCount);
            }
        });
    });
}

function renderQuestions() {
    const tbody = document.getElementById('checklist-body');
    let questionIndex = 0;
    
    questions.forEach((section, sectionIndex) => {
        section.behaviors.forEach((behavior, behaviorIndex) => {
            const row = document.createElement('tr');
            
            // Category cell (only show for first behavior in each category)
            const categoryCell = document.createElement('td');
            if (behaviorIndex === 0) {
                categoryCell.textContent = section.category;
                categoryCell.className = 'interaction-cell';
                categoryCell.rowSpan = section.behaviors.length;
            } else {
                categoryCell.style.display = 'none';
            }
            
            // Behavior cell
            const behaviorCell = document.createElement('td');
            behaviorCell.textContent = behavior;
            behaviorCell.className = 'behavior-cell';
            
            // Yes cell
            const yesCell = document.createElement('td');
            yesCell.className = 'response-cell';
            const yesRadio = document.createElement('input');
            yesRadio.type = 'radio';
            yesRadio.name = `question_${questionIndex}`;
            yesRadio.value = 'yes';
            yesRadio.required = true;
            yesCell.appendChild(yesRadio);
            
            // No cell
            const noCell = document.createElement('td');
            noCell.className = 'response-cell';
            const noRadio = document.createElement('input');
            noRadio.type = 'radio';
            noRadio.name = `question_${questionIndex}`;
            noRadio.value = 'no';
            noRadio.required = true;
            noCell.appendChild(noRadio);
            
            if (behaviorIndex === 0) {
                row.appendChild(categoryCell);
            }
            row.appendChild(behaviorCell);
            row.appendChild(yesCell);
            row.appendChild(noCell);
            
            tbody.appendChild(row);
            questionIndex++;
        });
    });
}

function calculateScores(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const scores = {
        'One-on-One': { total: 9, noCount: 0 },
        'Teams (as leader)': { total: 7, noCount: 0 },
        'Teams (as facilitator)': { total: 7, noCount: 0 },
        'Teams (as participant)': { total: 4, noCount: 0 },
        'Mentor/Protégé': { total: 3, noCount: 0 }
    };
    
    let totalNoCount = 0;
    let questionIndex = 0;
    
    questions.forEach(section => {
        section.behaviors.forEach(() => {
            const answer = formData.get(`question_${questionIndex}`);
            if (answer === 'no') {
                scores[section.category].noCount++;
                totalNoCount++;
            }
            questionIndex++;
        });
    });
    
    displayResults(scores, totalNoCount);
}

function displayResults(scores, totalNoCount) {
    const resultDiv = document.querySelector('.result');
    resultDiv.style.display = 'block';
    
    // Store chart data
    chartData = { scores, totalNoCount };
    
    // Update overall score display
    document.getElementById('total-score').textContent = totalNoCount;
    document.getElementById('score-interpretation').textContent = getScoreLevel(totalNoCount);
    
    // Update score circle color based on performance
    const scoreCircle = document.querySelector('.score-circle');
    if (totalNoCount <= 9) {
        scoreCircle.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
    } else if (totalNoCount <= 19) {
        scoreCircle.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
    } else {
        scoreCircle.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
    }
    
    // Scroll to results
    resultDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Display score breakdown
    const scoreBreakdown = document.getElementById('score-breakdown');
    scoreBreakdown.innerHTML = Object.entries(scores).map(([category, score]) => `
        <div class="score-category">
            <h4>${category}: ${score.noCount} out of ${score.total}</h4>
            <p>${getCategoryFeedback(score.noCount, score.total)}</p>
        </div>
    `).join('');
    
    // Create chart
    createChart(scores, totalNoCount);
    
    // BOOKMARK: Recommendations functionality disabled
    // To restore, uncomment the following line:
    // generateRecommendations(scores, totalNoCount);
}

function getScoreLevel(score) {
    if (score <= 9) return "Exemplary Leader";
    if (score <= 19) return "Developing Leader";
    return "Emerging Leader";
}

function getCategoryFeedback(noCount, total) {
    const percentage = (noCount / total) * 100;
    if (percentage === 0) return "Excellent! You demonstrate all inclusive behaviors in this area.";
    if (percentage <= 33) return "Great performance with minor areas for improvement.";
    if (percentage <= 66) return "Good foundation with several opportunities for growth.";
    return "Significant opportunity for development in this area.";
}

function createChart(scores, totalNoCount) {
    const ctx = document.getElementById('resultChart').getContext('2d');
    
    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }
    
    const categories = Object.keys(scores);
    const noScores = categories.map(cat => scores[cat].noCount);
    const yesScores = categories.map(cat => scores[cat].total - scores[cat].noCount);
    
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
    
    if (currentChartType === 'bar') {
        currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [
                    {
                        label: 'Yes Responses',
                        data: yesScores,
                        backgroundColor: '#27ae60',
                        borderColor: '#229954',
                        borderWidth: 2,
                        borderRadius: 5
                    },
                    {
                        label: 'No Responses',
                        data: noScores,
                        backgroundColor: '#e74c3c',
                        borderColor: '#c0392b',
                        borderWidth: 2,
                        borderRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Inclusive Leadership Behaviors by Category',
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true }
                }
            }
        });
    } else if (currentChartType === 'pie') {
        currentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: noScores,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Number of "No" Responses by Category',
                        font: { size: 16, weight: 'bold' }
                    }
                }
            }
        });
    } else if (currentChartType === 'radar') {
        const maxScores = categories.map(cat => scores[cat].total);
        currentChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: categories,
                datasets: [
                    {
                        label: 'Your "Yes" Responses',
                        data: yesScores,
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: '#3498db',
                        borderWidth: 3,
                        pointBackgroundColor: '#3498db',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    },
                    {
                        label: 'Maximum Possible "Yes"',
                        data: maxScores,
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderColor: '#2ecc71',
                        borderWidth: 2,
                        pointBackgroundColor: '#2ecc71',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Number of "Yes" Responses - Performance Overview',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: Math.max(...maxScores),
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// BOOKMARK: Recommendations functions kept for easy restoration
/*
function generateRecommendations(scores, totalNoCount) {
    const recommendations = [];
    
    // Find categories with highest no counts
    const sortedCategories = Object.entries(scores)
        .sort(([,a], [,b]) => b.noCount - a.noCount)
        .slice(0, 2);
    
    sortedCategories.forEach(([category, score]) => {
        if (score.noCount > 0) {
            recommendations.push({
                category,
                suggestion: getCategorySuggestion(category, score.noCount)
            });
        }
    });
    
    // Overall recommendation
    if (totalNoCount > 15) {
        recommendations.unshift({
            category: "Overall Development",
            suggestion: "Consider attending inclusive leadership training programs or workshops to build foundational skills across all areas."
        });
    }
    
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = recommendations.length > 0 ? 
        recommendations.map(rec => `
            <div class="recommendation-item">
                <h5>${rec.category}</h5>
                <p>${rec.suggestion}</p>
            </div>
        `).join('') : 
        '<div class="recommendation-item"><h5>Excellent Work!</h5><p>You demonstrate strong inclusive leadership behaviors across all categories. Continue to model these behaviors and mentor others.</p></div>';
}

function getCategorySuggestion(category, noCount) {
    const suggestions = {
        "One-on-One": "Practice active listening techniques and schedule regular check-ins with team members to build stronger individual relationships.",
        "Teams (as leader)": "Focus on identifying and leveraging diverse talents within your team. Create opportunities for all team members to contribute meaningfully.",
        "Teams (as facilitator)": "Develop structured meeting processes that ensure everyone has a voice. Consider using facilitation techniques like round-robin discussions.",
        "Teams (as participant)": "Be more intentional about supporting colleagues during meetings. Practice speaking up when others are interrupted or overlooked.",
        "Mentor/Protégé": "Establish clear communication preferences and expectations early in mentoring relationships. Focus on understanding rather than directing."
    };
    return suggestions[category] || "Focus on developing more inclusive behaviors in this area.";
}
*/

function randomSelectAnswers() {
    const totalQuestions = questions.reduce((sum, section) => sum + section.behaviors.length, 0);
    
    for (let i = 0; i < totalQuestions; i++) {
        const randomChoice = Math.random() < 0.5 ? 'yes' : 'no';
        const radioButtons = document.querySelectorAll(`input[name="question_${i}"]`);
        
        radioButtons.forEach(radio => {
            if (radio.value === randomChoice) {
                radio.checked = true;
            }
        });
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeQuiz);
