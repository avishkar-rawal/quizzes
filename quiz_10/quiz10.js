document.addEventListener('DOMContentLoaded', () => {
    let chartInstances = { radar: null, bar: null };
    
    const questions = [
        { id: 1, text: "Others would seek help from the leader if they had a personal problem." },
        { id: 2, text: "The leader emphasizes the importance of giving back to the community." },
        { id: 3, text: "The leader can tell if something work-related is going wrong." },
        { id: 4, text: "The leader gives others the responsibility to make important decisions about their own jobs." },
        { id: 5, text: "The leader makes others’ career development a priority." },
        { id: 6, text: "The leader cares more about others’ success than their own." },
        { id: 7, text: "The leader holds high ethical standards." },
        { id: 8, text: "The leader cares about others’ personal well-being." },
        { id: 9, text: "The leader is always interested in helping people in the community." },
        { id: 10, text: "The leader is able to think through complex problems." },
        { id: 11, text: "The leader encourages others to handle important work decisions on their own." },
        { id: 12, text: "The leader is interested in making sure others reach their career goals." },
        { id: 13, text: "The leader puts others’ best interests above their own." },
        { id: 14, text: "The leader is always honest." },
        { id: 15, text: "The leader takes time to talk to others on a personal level." },
        { id: 16, text: "The leader is involved in community activities." },
        { id: 17, text: "The leader has a thorough understanding of the organization and its goals." },
        { id: 18, text: "The leader gives others the freedom to handle difficult situations in the way they feel(s) is best." },
        { id: 19, text: "The leader provides others with work experiences that enable them to develop new skills." },
        { id: 20, text: "The leader sacrifices their own interests to meet others’ needs." },
        { id: 21, text: "The leader would not compromise ethical principles in order to meet success." },
        { id: 22, text: "The leader can recognize when others are feeling down without asking them." },
        { id: 23, text: "The leader encourages others to volunteer in the community." },
        { id: 24, text: "The leader can solve work problems with new or creative ideas." },
        { id: 25, text: "If others need to make important decisions at work, they do not need to consult the leader." },
        { id: 26, text: "The leader wants to know about others’ career goals." },
        { id: 27, text: "The leader does what they can to make others’ jobs easier." },
        { id: 28, text: "The leader values honesty more than profits." }
    ];

    const leadershipForm = document.getElementById('leadershipForm');
    const resultDiv = document.querySelector('.result');
    const scoreBreakdownDiv = document.getElementById('score-breakdown');
    const questionsDiv = document.getElementById('questions');
    const randomFillBtn = document.getElementById('randomFillBtn');

    function renderQuestions() {
        let questionsHTML = '';
        questions.forEach(q => {
            questionsHTML += `
                <div class="question">
                    <p>${q.id}. ${q.text}</p>
                    <div class="radio-group">
                        ${[1, 2, 3, 4, 5, 6, 7].map(i => `
                            <input type="radio" id="q${q.id}o${i}" name="q${q.id}" value="${i}" required>
                            <label for="q${q.id}o${i}">${i}</label>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        questionsDiv.innerHTML = questionsHTML;
    }

    // Add random fill functionality
    randomFillBtn.addEventListener('click', () => {
        questions.forEach(q => {
            const randomValue = Math.floor(Math.random() * 7) + 1; // Random value from 1-7
            const radioButton = document.querySelector(`input[name="q${q.id}"][value="${randomValue}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
        });
    });

    leadershipForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(leadershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        return {
            'Emotional Healing': answers.q1 + answers.q8 + answers.q15 + answers.q22,
            'Creating Value for the Community': answers.q2 + answers.q9 + answers.q16 + answers.q23,
            'Conceptual Skills': answers.q3 + answers.q10 + answers.q17 + answers.q24,
            'Empowering': answers.q4 + answers.q11 + answers.q18 + answers.q25,
            'Helping Followers Grow and Succeed': answers.q5 + answers.q12 + answers.q19 + answers.q26,
            'Putting Followers First': answers.q6 + answers.q13 + answers.q20 + answers.q27,
            'Behaving Ethically': answers.q7 + answers.q14 + answers.q21 + answers.q28
        };
    }

    function getScoreInterpretation(score) {
        if (score >= 23) return 'High range';
        if (score >= 14) return 'Moderate range';
        return 'Low range';
    }    function displayResults(scores) {
        resultDiv.style.display = 'block';

        let breakdownHTML = '';
        for (const [key, value] of Object.entries(scores)) {
            const interpretation = getScoreInterpretation(value);
            const color = value >= 23 ? '#48bb78' : value >= 14 ? '#f6e05e' : '#f56565';
            breakdownHTML += `<div class="score-line" style="border-left-color: ${color}"><strong>${key}:</strong> ${value} / 28 (${interpretation})</div>`;
        }
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderCharts(scores);
        setupChartTabs();
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }    function renderCharts(scores) {
        // Destroy existing charts if they exist
        if (chartInstances.radar) chartInstances.radar.destroy();
        if (chartInstances.bar) chartInstances.bar.destroy();

        // Create shorter labels for better display
        const shortLabels = {
            'Emotional Healing': 'Emotional Healing',
            'Creating Value for the Community': 'Community Value',
            'Conceptual Skills': 'Conceptual Skills',
            'Empowering': 'Empowering',
            'Helping Followers Grow and Succeed': 'Follower Growth',
            'Putting Followers First': 'Followers First',
            'Behaving Ethically': 'Ethical Behavior'
        };

        const labels = Object.keys(scores).map(key => shortLabels[key]);
        const data = Object.values(scores);

        // Radar Chart
        const radarCtx = document.getElementById('resultChart').getContext('2d');
        chartInstances.radar = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Your Scores',
                    data: data,
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(102, 126, 234, 1)',
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 28,
                        pointLabels: { 
                            font: { size: 12 },
                            callback: function(label) {
                                // Wrap long labels
                                if (label.length > 12) {
                                    const words = label.split(' ');
                                    if (words.length > 2) {
                                        return [words.slice(0, 2).join(' '), words.slice(2).join(' ')];
                                    }
                                }
                                return label;
                            }
                        },
                        ticks: { 
                            stepSize: 7,
                            showLabelBackdrop: false 
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Bar Chart
        const barCtx = document.getElementById('barChart').getContext('2d');
        chartInstances.bar = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Scores',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(199, 199, 199, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(199, 199, 199, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 28,
                        ticks: {
                            stepSize: 4
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function setupChartTabs() {
        const tabs = document.querySelectorAll('.chart-tab');
        const views = document.querySelectorAll('.chart-view');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                views.forEach(view => view.classList.remove('active'));
                document.getElementById(`${tab.dataset.chart}-view`).classList.add('active');
            });
        });
    }

    renderQuestions();
});
