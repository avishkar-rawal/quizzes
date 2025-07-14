document.addEventListener('DOMContentLoaded', () => {
    let scatterChart = null;
    
    // Style descriptions
    const styleDescriptions = {
        exemplary: {
            title: "Exemplary Follower",
            description: "Exemplary followers score high in both independent thinking and active engagement. They exhibit independent, critical thinking, separate from the group or leader. They are actively engaged, using their talents for the benefit of the organization, even when confronted with bureaucracy or other noncontributing members. Up to 35% of people are categorized as exemplary followers."
        },
        alienated: {
            title: "Alienated Follower", 
            description: "Alienated followers score high in independent thinking but low in active engagement. This means that they think independently and critically, but are not active in carrying out the role of a follower. They might disengage from the group at times and may view themselves as victims who have received unfair treatment. Approximately 15%–25% of people are categorized as alienated followers."
        },
        conformist: {
            title: "Conformist Follower",
            description: "Conformist followers often say \"yes\" when they really want to say \"no.\" Low in independent thinking and high in active engagement, they willingly take orders and are eager to please others. They believe that the leader's position of power entitles the leader to followers' obedience. They do not question the social order and find comfort in structure. Approximately 20%–30% of people are categorized as conformist followers."
        },
        pragmatist: {
            title: "Pragmatist Follower",
            description: "With independent thinking and active engagement styles that fall between high and low, pragmatic followers are most comfortable in the middle of the road and tend to adhere to a motto of \"better safe than sorry.\" They will question a leader's decisions, but not too often or too openly. They perform required tasks, but seldom do more than is asked or expected. Approximately 25%–35% of people are categorized as pragmatist followers."
        },
        passive: {
            title: "Passive Follower",
            description: "With low independent thinking and low active engagement behaviors, passive followers are the opposite of exemplary followers, looking to the leader to do their thinking for them. They do not carry out their assignments with enthusiasm and lack initiative and a sense of responsibility. Approximately 5%–10% of people are categorized as passive followers."
        }
    };

    const questions = [
        { id: 1, text: "Does your work help you fulfill some societal goal or personal dream that is important to you?" },
        { id: 2, text: "Are your personal work goals aligned with the organization's priority goals?" },
        { id: 3, text: "Are you highly committed to and energized by your work and organization, giving them your best ideas and performance?" },
        { id: 4, text: "Does your enthusiasm also spread to and energize your coworkers?" },
        { id: 5, text: "Instead of waiting for or merely accepting what the leader tells you, do you personally identify which organizational activities are most critical for achieving the organization's priority goals?" },
        { id: 6, text: "Do you actively develop a distinctive competence in those critical activities so that you become more valuable to the leader and the organization?" },
        { id: 7, text: "When starting a new job or assignment, do you promptly build a record of successes in tasks that are important to the leader?" },
        { id: 8, text: "Can the leader give you a difficult assignment without the benefit of much supervision, knowing that you will meet your deadline with highest-quality work and that you will \"fill in the cracks\" if need be?" },
        { id: 9, text: "Do you take the initiative to seek out and successfully complete assignments that go above and beyond your job?" },
        { id: 10, text: "When you are not the leader of a group project, do you still contribute at a high level, often doing more than your share?" },
        { id: 11, text: "Do you independently think up and champion new ideas that will contribute significantly to the leader's or the organization's goals?" },
        { id: 12, text: "Do you try to solve the tough problems (technical or organizational), rather than look to the leader to do it for you?" },
        { id: 13, text: "Do you help out other coworkers, making them look good, even when you don't get any credit?" },
        { id: 14, text: "Do you help the leader or group see both the upside potential and downside risks of ideas or plans, playing the devil's advocate if need be?" },
        { id: 15, text: "Do you understand the leader's needs, goals, and constraints, and work hard to help meet them?" },
        { id: 16, text: "Do you actively and honestly own up to your strengths and weaknesses rather than put off evaluation?" },
        { id: 17, text: "Do you make a habit of internally questioning the wisdom of the leader's decision rather than just doing what you are told?" },
        { id: 18, text: "When the leader asks you to do something that runs contrary to your professional or personal preferences, do you say \"no\" rather than \"yes\"?" },
        { id: 19, text: "Do you act on your own ethical standards rather than the leader's or the group's standards?" },
        { id: 20, text: "Do you assert your views on important issues, even though it might mean conflict with your group or reprisals from the leader?" }
    ];

    const followershipForm = document.getElementById('followershipForm');
    const resultDiv = document.querySelector('.result');
    const scoreBreakdownDiv = document.getElementById('score-breakdown');
    const questionsDiv = document.getElementById('questions');

    // Modal elements
    const modal = document.getElementById('styleModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = document.getElementsByClassName('close')[0];

    function renderQuestions() {
        let questionsHTML = '';
        questions.forEach(q => {
            questionsHTML += `
                <div class="question">
                    <p>${q.id}. ${q.text}</p>
                    <div class="radio-group">
                        ${[0, 1, 2, 3, 4, 5, 6].map(i => `
                            <input type="radio" id="q${q.id}o${i}" name="q${q.id}" value="${i}" required>
                            <label for="q${q.id}o${i}">${i}</label>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        questionsDiv.innerHTML = questionsHTML;
    }

    followershipForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(followershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        // Independent Thinking Score: Questions 1, 5, 11, 12, 14, 16, 17, 18, 19, and 20
        const independentThinking = 
            answers.q1 + answers.q5 + answers.q11 + answers.q12 + answers.q14 + 
            answers.q16 + answers.q17 + answers.q18 + answers.q19 + answers.q20;

        // Active Engagement Score: Questions 2, 3, 4, 6, 7, 8, 9, 10, 13, and 15
        const activeEngagement = 
            answers.q2 + answers.q3 + answers.q4 + answers.q6 + answers.q7 + 
            answers.q8 + answers.q9 + answers.q10 + answers.q13 + answers.q15;

        return {
            independentThinking,
            activeEngagement
        };
    }

    function getFollowershipStyle(independentThinking, activeEngagement) {
        if (independentThinking > 40 && activeEngagement > 40) {
            return { style: 'Exemplary', description: 'You exhibit high independent thinking and high active engagement. You are a valuable follower who thinks critically and contributes actively.' };
        } else if (independentThinking > 40 && activeEngagement < 20) {
            return { style: 'Alienated', description: 'You think independently but are not actively engaged. You may feel disconnected or disillusioned with the organization.' };
        } else if (independentThinking < 20 && activeEngagement > 40) {
            return { style: 'Conformist', description: 'You are actively engaged but don\'t think independently. You tend to follow orders without questioning and seek to please.' };
        } else if (independentThinking >= 20 && independentThinking <= 40 && activeEngagement >= 20 && activeEngagement <= 40) {
            return { style: 'Pragmatist', description: 'You fall in the middle range on both dimensions. You are cautious and tend to play it safe in your followership approach.' };
        } else {
            return { style: 'Passive', description: 'You exhibit low independent thinking and low active engagement. You tend to look to leaders for direction and lack initiative.' };
        }
    }

    function getStyleColor(style) {
        const colors = {
            'Exemplary': '#48bb78',
            'Alienated': '#f56565', 
            'Conformist': '#4299e1',
            'Pragmatist': '#f6e05e',
            'Passive': '#a0aec0'
        };
        return colors[style] || '#a0aec0';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        const { independentThinking, activeEngagement } = scores;
        const followership = getFollowershipStyle(independentThinking, activeEngagement);
        const color = getStyleColor(followership.style);

        let breakdownHTML = `
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Independent Thinking Score:</strong> ${independentThinking} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Active Engagement Score:</strong> ${activeEngagement} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}; background: ${color}20;">
                <strong>Your Followership Style: ${followership.style}</strong><br>
                <em>${followership.description}</em>
            </div>
        `;
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderChart(scores, followership);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function renderChart(scores, followership) {
        if (scatterChart) scatterChart.destroy();

        const ctx = document.getElementById('resultChart').getContext('2d');
        const color = getStyleColor(followership.style);

        scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Your Position',
                    data: [{ x: scores.independentThinking, y: scores.activeEngagement }],
                    backgroundColor: color,
                    borderColor: color,
                    pointRadius: 15,
                    pointHoverRadius: 18
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Independent Thinking Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    },
                    y: {
                        title: { display: true, text: 'Active Engagement Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Your Followership Style: ${followership.style}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    annotation: {
                        annotations: {
                            line1: { type: 'line', xMin: 20, xMax: 20, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line2: { type: 'line', xMin: 40, xMax: 40, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line3: { type: 'line', xMin: 0, xMax: 60, yMin: 20, yMax: 20, borderColor: '#e2e8f0', borderWidth: 2 },
                            line4: { type: 'line', xMin: 0, xMax: 60, yMin: 40, yMax: 40, borderColor: '#e2e8f0', borderWidth: 2 }
                        }
                    }
                }
            }
        });
    }

    // Add modal functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-style')) {
            const style = e.target.getAttribute('data-style');
            const info = styleDescriptions[style];
            modalTitle.textContent = info.title;
            modalDescription.textContent = info.description;
            modal.style.display = 'block';
        }
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    followershipForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(followershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        // Independent Thinking Score: Questions 1, 5, 11, 12, 14, 16, 17, 18, 19, and 20
        const independentThinking = 
            answers.q1 + answers.q5 + answers.q11 + answers.q12 + answers.q14 + 
            answers.q16 + answers.q17 + answers.q18 + answers.q19 + answers.q20;

        // Active Engagement Score: Questions 2, 3, 4, 6, 7, 8, 9, 10, 13, and 15
        const activeEngagement = 
            answers.q2 + answers.q3 + answers.q4 + answers.q6 + answers.q7 + 
            answers.q8 + answers.q9 + answers.q10 + answers.q13 + answers.q15;

        return {
            independentThinking,
            activeEngagement
        };
    }

    function getFollowershipStyle(independentThinking, activeEngagement) {
        if (independentThinking > 40 && activeEngagement > 40) {
            return { style: 'Exemplary', description: 'You exhibit high independent thinking and high active engagement. You are a valuable follower who thinks critically and contributes actively.' };
        } else if (independentThinking > 40 && activeEngagement < 20) {
            return { style: 'Alienated', description: 'You think independently but are not actively engaged. You may feel disconnected or disillusioned with the organization.' };
        } else if (independentThinking < 20 && activeEngagement > 40) {
            return { style: 'Conformist', description: 'You are actively engaged but don\'t think independently. You tend to follow orders without questioning and seek to please.' };
        } else if (independentThinking >= 20 && independentThinking <= 40 && activeEngagement >= 20 && activeEngagement <= 40) {
            return { style: 'Pragmatist', description: 'You fall in the middle range on both dimensions. You are cautious and tend to play it safe in your followership approach.' };
        } else {
            return { style: 'Passive', description: 'You exhibit low independent thinking and low active engagement. You tend to look to leaders for direction and lack initiative.' };
        }
    }

    function getStyleColor(style) {
        const colors = {
            'Exemplary': '#48bb78',
            'Alienated': '#f56565', 
            'Conformist': '#4299e1',
            'Pragmatist': '#f6e05e',
            'Passive': '#a0aec0'
        };
        return colors[style] || '#a0aec0';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        const { independentThinking, activeEngagement } = scores;
        const followership = getFollowershipStyle(independentThinking, activeEngagement);
        const color = getStyleColor(followership.style);

        let breakdownHTML = `
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Independent Thinking Score:</strong> ${independentThinking} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Active Engagement Score:</strong> ${activeEngagement} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}; background: ${color}20;">
                <strong>Your Followership Style: ${followership.style}</strong><br>
                <em>${followership.description}</em>
            </div>
        `;
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderChart(scores, followership);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function renderChart(scores, followership) {
        if (scatterChart) scatterChart.destroy();

        const ctx = document.getElementById('resultChart').getContext('2d');
        const color = getStyleColor(followership.style);

        scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Your Position',
                    data: [{ x: scores.independentThinking, y: scores.activeEngagement }],
                    backgroundColor: color,
                    borderColor: color,
                    pointRadius: 15,
                    pointHoverRadius: 18
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Independent Thinking Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    },
                    y: {
                        title: { display: true, text: 'Active Engagement Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Your Followership Style: ${followership.style}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    annotation: {
                        annotations: {
                            line1: { type: 'line', xMin: 20, xMax: 20, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line2: { type: 'line', xMin: 40, xMax: 40, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line3: { type: 'line', xMin: 0, xMax: 60, yMin: 20, yMax: 20, borderColor: '#e2e8f0', borderWidth: 2 },
                            line4: { type: 'line', xMin: 0, xMax: 60, yMin: 40, yMax: 40, borderColor: '#e2e8f0', borderWidth: 2 }
                        }
                    }
                }
            }
        });
    }

    // Add modal functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-style')) {
            const style = e.target.getAttribute('data-style');
            const info = styleDescriptions[style];
            modalTitle.textContent = info.title;
            modalDescription.textContent = info.description;
            modal.style.display = 'block';
        }
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    followershipForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(followershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        // Independent Thinking Score: Questions 1, 5, 11, 12, 14, 16, 17, 18, 19, and 20
        const independentThinking = 
            answers.q1 + answers.q5 + answers.q11 + answers.q12 + answers.q14 + 
            answers.q16 + answers.q17 + answers.q18 + answers.q19 + answers.q20;

        // Active Engagement Score: Questions 2, 3, 4, 6, 7, 8, 9, 10, 13, and 15
        const activeEngagement = 
            answers.q2 + answers.q3 + answers.q4 + answers.q6 + answers.q7 + 
            answers.q8 + answers.q9 + answers.q10 + answers.q13 + answers.q15;

        return {
            independentThinking,
            activeEngagement
        };
    }

    function getFollowershipStyle(independentThinking, activeEngagement) {
        if (independentThinking > 40 && activeEngagement > 40) {
            return { style: 'Exemplary', description: 'You exhibit high independent thinking and high active engagement. You are a valuable follower who thinks critically and contributes actively.' };
        } else if (independentThinking > 40 && activeEngagement < 20) {
            return { style: 'Alienated', description: 'You think independently but are not actively engaged. You may feel disconnected or disillusioned with the organization.' };
        } else if (independentThinking < 20 && activeEngagement > 40) {
            return { style: 'Conformist', description: 'You are actively engaged but don\'t think independently. You tend to follow orders without questioning and seek to please.' };
        } else if (independentThinking >= 20 && independentThinking <= 40 && activeEngagement >= 20 && activeEngagement <= 40) {
            return { style: 'Pragmatist', description: 'You fall in the middle range on both dimensions. You are cautious and tend to play it safe in your followership approach.' };
        } else {
            return { style: 'Passive', description: 'You exhibit low independent thinking and low active engagement. You tend to look to leaders for direction and lack initiative.' };
        }
    }

    function getStyleColor(style) {
        const colors = {
            'Exemplary': '#48bb78',
            'Alienated': '#f56565', 
            'Conformist': '#4299e1',
            'Pragmatist': '#f6e05e',
            'Passive': '#a0aec0'
        };
        return colors[style] || '#a0aec0';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        const { independentThinking, activeEngagement } = scores;
        const followership = getFollowershipStyle(independentThinking, activeEngagement);
        const color = getStyleColor(followership.style);

        let breakdownHTML = `
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Independent Thinking Score:</strong> ${independentThinking} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Active Engagement Score:</strong> ${activeEngagement} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}; background: ${color}20;">
                <strong>Your Followership Style: ${followership.style}</strong><br>
                <em>${followership.description}</em>
            </div>
        `;
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderChart(scores, followership);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function renderChart(scores, followership) {
        if (scatterChart) scatterChart.destroy();

        const ctx = document.getElementById('resultChart').getContext('2d');
        const color = getStyleColor(followership.style);

        scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Your Position',
                    data: [{ x: scores.independentThinking, y: scores.activeEngagement }],
                    backgroundColor: color,
                    borderColor: color,
                    pointRadius: 15,
                    pointHoverRadius: 18
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Independent Thinking Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    },
                    y: {
                        title: { display: true, text: 'Active Engagement Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Your Followership Style: ${followership.style}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    annotation: {
                        annotations: {
                            line1: { type: 'line', xMin: 20, xMax: 20, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line2: { type: 'line', xMin: 40, xMax: 40, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line3: { type: 'line', xMin: 0, xMax: 60, yMin: 20, yMax: 20, borderColor: '#e2e8f0', borderWidth: 2 },
                            line4: { type: 'line', xMin: 0, xMax: 60, yMin: 40, yMax: 40, borderColor: '#e2e8f0', borderWidth: 2 }
                        }
                    }
                }
            }
        });
    }

    // Add modal functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-style')) {
            const style = e.target.getAttribute('data-style');
            const info = styleDescriptions[style];
            modalTitle.textContent = info.title;
            modalDescription.textContent = info.description;
            modal.style.display = 'block';
        }
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    followershipForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(followershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        // Independent Thinking Score: Questions 1, 5, 11, 12, 14, 16, 17, 18, 19, and 20
        const independentThinking = 
            answers.q1 + answers.q5 + answers.q11 + answers.q12 + answers.q14 + 
            answers.q16 + answers.q17 + answers.q18 + answers.q19 + answers.q20;

        // Active Engagement Score: Questions 2, 3, 4, 6, 7, 8, 9, 10, 13, and 15
        const activeEngagement = 
            answers.q2 + answers.q3 + answers.q4 + answers.q6 + answers.q7 + 
            answers.q8 + answers.q9 + answers.q10 + answers.q13 + answers.q15;

        return {
            independentThinking,
            activeEngagement
        };
    }

    function getFollowershipStyle(independentThinking, activeEngagement) {
        if (independentThinking > 40 && activeEngagement > 40) {
            return { style: 'Exemplary', description: 'You exhibit high independent thinking and high active engagement. You are a valuable follower who thinks critically and contributes actively.' };
        } else if (independentThinking > 40 && activeEngagement < 20) {
            return { style: 'Alienated', description: 'You think independently but are not actively engaged. You may feel disconnected or disillusioned with the organization.' };
        } else if (independentThinking < 20 && activeEngagement > 40) {
            return { style: 'Conformist', description: 'You are actively engaged but don\'t think independently. You tend to follow orders without questioning and seek to please.' };
        } else if (independentThinking >= 20 && independentThinking <= 40 && activeEngagement >= 20 && activeEngagement <= 40) {
            return { style: 'Pragmatist', description: 'You fall in the middle range on both dimensions. You are cautious and tend to play it safe in your followership approach.' };
        } else {
            return { style: 'Passive', description: 'You exhibit low independent thinking and low active engagement. You tend to look to leaders for direction and lack initiative.' };
        }
    }

    function getStyleColor(style) {
        const colors = {
            'Exemplary': '#48bb78',
            'Alienated': '#f56565', 
            'Conformist': '#4299e1',
            'Pragmatist': '#f6e05e',
            'Passive': '#a0aec0'
        };
        return colors[style] || '#a0aec0';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        const { independentThinking, activeEngagement } = scores;
        const followership = getFollowershipStyle(independentThinking, activeEngagement);
        const color = getStyleColor(followership.style);

        let breakdownHTML = `
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Independent Thinking Score:</strong> ${independentThinking} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Active Engagement Score:</strong> ${activeEngagement} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}; background: ${color}20;">
                <strong>Your Followership Style: ${followership.style}</strong><br>
                <em>${followership.description}</em>
            </div>
        `;
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderChart(scores, followership);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function renderChart(scores, followership) {
        if (scatterChart) scatterChart.destroy();

        const ctx = document.getElementById('resultChart').getContext('2d');
        const color = getStyleColor(followership.style);

        scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Your Position',
                    data: [{ x: scores.independentThinking, y: scores.activeEngagement }],
                    backgroundColor: color,
                    borderColor: color,
                    pointRadius: 15,
                    pointHoverRadius: 18
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Independent Thinking Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    },
                    y: {
                        title: { display: true, text: 'Active Engagement Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Your Followership Style: ${followership.style}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    annotation: {
                        annotations: {
                            line1: { type: 'line', xMin: 20, xMax: 20, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line2: { type: 'line', xMin: 40, xMax: 40, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line3: { type: 'line', xMin: 0, xMax: 60, yMin: 20, yMax: 20, borderColor: '#e2e8f0', borderWidth: 2 },
                            line4: { type: 'line', xMin: 0, xMax: 60, yMin: 40, yMax: 40, borderColor: '#e2e8f0', borderWidth: 2 }
                        }
                    }
                }
            }
        });
    }

    // Add modal functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-style')) {
            const style = e.target.getAttribute('data-style');
            const info = styleDescriptions[style];
            modalTitle.textContent = info.title;
            modalDescription.textContent = info.description;
            modal.style.display = 'block';
        }
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    followershipForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(followershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        // Independent Thinking Score: Questions 1, 5, 11, 12, 14, 16, 17, 18, 19, and 20
        const independentThinking = 
            answers.q1 + answers.q5 + answers.q11 + answers.q12 + answers.q14 + 
            answers.q16 + answers.q17 + answers.q18 + answers.q19 + answers.q20;

        // Active Engagement Score: Questions 2, 3, 4, 6, 7, 8, 9, 10, 13, and 15
        const activeEngagement = 
            answers.q2 + answers.q3 + answers.q4 + answers.q6 + answers.q7 + 
            answers.q8 + answers.q9 + answers.q10 + answers.q13 + answers.q15;

        return {
            independentThinking,
            activeEngagement
        };
    }

    function getFollowershipStyle(independentThinking, activeEngagement) {
        if (independentThinking > 40 && activeEngagement > 40) {
            return { style: 'Exemplary', description: 'You exhibit high independent thinking and high active engagement. You are a valuable follower who thinks critically and contributes actively.' };
        } else if (independentThinking > 40 && activeEngagement < 20) {
            return { style: 'Alienated', description: 'You think independently but are not actively engaged. You may feel disconnected or disillusioned with the organization.' };
        } else if (independentThinking < 20 && activeEngagement > 40) {
            return { style: 'Conformist', description: 'You are actively engaged but don\'t think independently. You tend to follow orders without questioning and seek to please.' };
        } else if (independentThinking >= 20 && independentThinking <= 40 && activeEngagement >= 20 && activeEngagement <= 40) {
            return { style: 'Pragmatist', description: 'You fall in the middle range on both dimensions. You are cautious and tend to play it safe in your followership approach.' };
        } else {
            return { style: 'Passive', description: 'You exhibit low independent thinking and low active engagement. You tend to look to leaders for direction and lack initiative.' };
        }
    }

    function getStyleColor(style) {
        const colors = {
            'Exemplary': '#48bb78',
            'Alienated': '#f56565', 
            'Conformist': '#4299e1',
            'Pragmatist': '#f6e05e',
            'Passive': '#a0aec0'
        };
        return colors[style] || '#a0aec0';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        const { independentThinking, activeEngagement } = scores;
        const followership = getFollowershipStyle(independentThinking, activeEngagement);
        const color = getStyleColor(followership.style);

        let breakdownHTML = `
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Independent Thinking Score:</strong> ${independentThinking} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Active Engagement Score:</strong> ${activeEngagement} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}; background: ${color}20;">
                <strong>Your Followership Style: ${followership.style}</strong><br>
                <em>${followership.description}</em>
            </div>
        `;
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderChart(scores, followership);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function renderChart(scores, followership) {
        if (scatterChart) scatterChart.destroy();

        const ctx = document.getElementById('resultChart').getContext('2d');
        const color = getStyleColor(followership.style);

        scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Your Position',
                    data: [{ x: scores.independentThinking, y: scores.activeEngagement }],
                    backgroundColor: color,
                    borderColor: color,
                    pointRadius: 15,
                    pointHoverRadius: 18
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Independent Thinking Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    },
                    y: {
                        title: { display: true, text: 'Active Engagement Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Your Followership Style: ${followership.style}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    annotation: {
                        annotations: {
                            line1: { type: 'line', xMin: 20, xMax: 20, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line2: { type: 'line', xMin: 40, xMax: 40, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line3: { type: 'line', xMin: 0, xMax: 60, yMin: 20, yMax: 20, borderColor: '#e2e8f0', borderWidth: 2 },
                            line4: { type: 'line', xMin: 0, xMax: 60, yMin: 40, yMax: 40, borderColor: '#e2e8f0', borderWidth: 2 }
                        }
                    }
                }
            }
        });
    }

    // Add modal functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-style')) {
            const style = e.target.getAttribute('data-style');
            const info = styleDescriptions[style];
            modalTitle.textContent = info.title;
            modalDescription.textContent = info.description;
            modal.style.display = 'block';
        }
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    followershipForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(followershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        // Independent Thinking Score: Questions 1, 5, 11, 12, 14, 16, 17, 18, 19, and 20
        const independentThinking = 
            answers.q1 + answers.q5 + answers.q11 + answers.q12 + answers.q14 + 
            answers.q16 + answers.q17 + answers.q18 + answers.q19 + answers.q20;

        // Active Engagement Score: Questions 2, 3, 4, 6, 7, 8, 9, 10, 13, and 15
        const activeEngagement = 
            answers.q2 + answers.q3 + answers.q4 + answers.q6 + answers.q7 + 
            answers.q8 + answers.q9 + answers.q10 + answers.q13 + answers.q15;

        return {
            independentThinking,
            activeEngagement
        };
    }

    function getFollowershipStyle(independentThinking, activeEngagement) {
        if (independentThinking > 40 && activeEngagement > 40) {
            return { style: 'Exemplary', description: 'You exhibit high independent thinking and high active engagement. You are a valuable follower who thinks critically and contributes actively.' };
        } else if (independentThinking > 40 && activeEngagement < 20) {
            return { style: 'Alienated', description: 'You think independently but are not actively engaged. You may feel disconnected or disillusioned with the organization.' };
        } else if (independentThinking < 20 && activeEngagement > 40) {
            return { style: 'Conformist', description: 'You are actively engaged but don\'t think independently. You tend to follow orders without questioning and seek to please.' };
        } else if (independentThinking >= 20 && independentThinking <= 40 && activeEngagement >= 20 && activeEngagement <= 40) {
            return { style: 'Pragmatist', description: 'You fall in the middle range on both dimensions. You are cautious and tend to play it safe in your followership approach.' };
        } else {
            return { style: 'Passive', description: 'You exhibit low independent thinking and low active engagement. You tend to look to leaders for direction and lack initiative.' };
        }
    }

    function getStyleColor(style) {
        const colors = {
            'Exemplary': '#48bb78',
            'Alienated': '#f56565', 
            'Conformist': '#4299e1',
            'Pragmatist': '#f6e05e',
            'Passive': '#a0aec0'
        };
        return colors[style] || '#a0aec0';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        const { independentThinking, activeEngagement } = scores;
        const followership = getFollowershipStyle(independentThinking, activeEngagement);
        const color = getStyleColor(followership.style);

        let breakdownHTML = `
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Independent Thinking Score:</strong> ${independentThinking} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Active Engagement Score:</strong> ${activeEngagement} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}; background: ${color}20;">
                <strong>Your Followership Style: ${followership.style}</strong><br>
                <em>${followership.description}</em>
            </div>
        `;
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderChart(scores, followership);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function renderChart(scores, followership) {
        if (scatterChart) scatterChart.destroy();

        const ctx = document.getElementById('resultChart').getContext('2d');
        const color = getStyleColor(followership.style);

        scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Your Position',
                    data: [{ x: scores.independentThinking, y: scores.activeEngagement }],
                    backgroundColor: color,
                    borderColor: color,
                    pointRadius: 15,
                    pointHoverRadius: 18
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Independent Thinking Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    },
                    y: {
                        title: { display: true, text: 'Active Engagement Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Your Followership Style: ${followership.style}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    annotation: {
                        annotations: {
                            line1: { type: 'line', xMin: 20, xMax: 20, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line2: { type: 'line', xMin: 40, xMax: 40, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line3: { type: 'line', xMin: 0, xMax: 60, yMin: 20, yMax: 20, borderColor: '#e2e8f0', borderWidth: 2 },
                            line4: { type: 'line', xMin: 0, xMax: 60, yMin: 40, yMax: 40, borderColor: '#e2e8f0', borderWidth: 2 }
                        }
                    }
                }
            }
        });
    }

    // Add modal functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-style')) {
            const style = e.target.getAttribute('data-style');
            const info = styleDescriptions[style];
            modalTitle.textContent = info.title;
            modalDescription.textContent = info.description;
            modal.style.display = 'block';
        }
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    followershipForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(followershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        // Independent Thinking Score: Questions 1, 5, 11, 12, 14, 16, 17, 18, 19, and 20
        const independentThinking = 
            answers.q1 + answers.q5 + answers.q11 + answers.q12 + answers.q14 + 
            answers.q16 + answers.q17 + answers.q18 + answers.q19 + answers.q20;

        // Active Engagement Score: Questions 2, 3, 4, 6, 7, 8, 9, 10, 13, and 15
        const activeEngagement = 
            answers.q2 + answers.q3 + answers.q4 + answers.q6 + answers.q7 + 
            answers.q8 + answers.q9 + answers.q10 + answers.q13 + answers.q15;

        return {
            independentThinking,
            activeEngagement
        };
    }

    function getFollowershipStyle(independentThinking, activeEngagement) {
        if (independentThinking > 40 && activeEngagement > 40) {
            return { style: 'Exemplary', description: 'You exhibit high independent thinking and high active engagement. You are a valuable follower who thinks critically and contributes actively.' };
        } else if (independentThinking > 40 && activeEngagement < 20) {
            return { style: 'Alienated', description: 'You think independently but are not actively engaged. You may feel disconnected or disillusioned with the organization.' };
        } else if (independentThinking < 20 && activeEngagement > 40) {
            return { style: 'Conformist', description: 'You are actively engaged but don\'t think independently. You tend to follow orders without questioning and seek to please.' };
        } else if (independentThinking >= 20 && independentThinking <= 40 && activeEngagement >= 20 && activeEngagement <= 40) {
            return { style: 'Pragmatist', description: 'You fall in the middle range on both dimensions. You are cautious and tend to play it safe in your followership approach.' };
        } else {
            return { style: 'Passive', description: 'You exhibit low independent thinking and low active engagement. You tend to look to leaders for direction and lack initiative.' };
        }
    }

    function getStyleColor(style) {
        const colors = {
            'Exemplary': '#48bb78',
            'Alienated': '#f56565', 
            'Conformist': '#4299e1',
            'Pragmatist': '#f6e05e',
            'Passive': '#a0aec0'
        };
        return colors[style] || '#a0aec0';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        const { independentThinking, activeEngagement } = scores;
        const followership = getFollowershipStyle(independentThinking, activeEngagement);
        const color = getStyleColor(followership.style);

        let breakdownHTML = `
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Independent Thinking Score:</strong> ${independentThinking} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Active Engagement Score:</strong> ${activeEngagement} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}; background: ${color}20;">
                <strong>Your Followership Style: ${followership.style}</strong><br>
                <em>${followership.description}</em>
            </div>
        `;
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderChart(scores, followership);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function renderChart(scores, followership) {
        if (scatterChart) scatterChart.destroy();

        const ctx = document.getElementById('resultChart').getContext('2d');
        const color = getStyleColor(followership.style);

        scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Your Position',
                    data: [{ x: scores.independentThinking, y: scores.activeEngagement }],
                    backgroundColor: color,
                    borderColor: color,
                    pointRadius: 15,
                    pointHoverRadius: 18
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Independent Thinking Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    },
                    y: {
                        title: { display: true, text: 'Active Engagement Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Your Followership Style: ${followership.style}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    annotation: {
                        annotations: {
                            line1: { type: 'line', xMin: 20, xMax: 20, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line2: { type: 'line', xMin: 40, xMax: 40, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line3: { type: 'line', xMin: 0, xMax: 60, yMin: 20, yMax: 20, borderColor: '#e2e8f0', borderWidth: 2 },
                            line4: { type: 'line', xMin: 0, xMax: 60, yMin: 40, yMax: 40, borderColor: '#e2e8f0', borderWidth: 2 }
                        }
                    }
                }
            }
        });
    }

    // Add modal functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-style')) {
            const style = e.target.getAttribute('data-style');
            const info = styleDescriptions[style];
            modalTitle.textContent = info.title;
            modalDescription.textContent = info.description;
            modal.style.display = 'block';
        }
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    followershipForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(followershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        // Independent Thinking Score: Questions 1, 5, 11, 12, 14, 16, 17, 18, 19, and 20
        const independentThinking = 
            answers.q1 + answers.q5 + answers.q11 + answers.q12 + answers.q14 + 
            answers.q16 + answers.q17 + answers.q18 + answers.q19 + answers.q20;

        // Active Engagement Score: Questions 2, 3, 4, 6, 7, 8, 9, 10, 13, and 15
        const activeEngagement = 
            answers.q2 + answers.q3 + answers.q4 + answers.q6 + answers.q7 + 
            answers.q8 + answers.q9 + answers.q10 + answers.q13 + answers.q15;

        return {
            independentThinking,
            activeEngagement
        };
    }

    function getFollowershipStyle(independentThinking, activeEngagement) {
        if (independentThinking > 40 && activeEngagement > 40) {
            return { style: 'Exemplary', description: 'You exhibit high independent thinking and high active engagement. You are a valuable follower who thinks critically and contributes actively.' };
        } else if (independentThinking > 40 && activeEngagement < 20) {
            return { style: 'Alienated', description: 'You think independently but are not actively engaged. You may feel disconnected or disillusioned with the organization.' };
        } else if (independentThinking < 20 && activeEngagement > 40) {
            return { style: 'Conformist', description: 'You are actively engaged but don\'t think independently. You tend to follow orders without questioning and seek to please.' };
        } else if (independentThinking >= 20 && independentThinking <= 40 && activeEngagement >= 20 && activeEngagement <= 40) {
            return { style: 'Pragmatist', description: 'You fall in the middle range on both dimensions. You are cautious and tend to play it safe in your followership approach.' };
        } else {
            return { style: 'Passive', description: 'You exhibit low independent thinking and low active engagement. You tend to look to leaders for direction and lack initiative.' };
        }
    }

    function getStyleColor(style) {
        const colors = {
            'Exemplary': '#48bb78',
            'Alienated': '#f56565', 
            'Conformist': '#4299e1',
            'Pragmatist': '#f6e05e',
            'Passive': '#a0aec0'
        };
        return colors[style] || '#a0aec0';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        const { independentThinking, activeEngagement } = scores;
        const followership = getFollowershipStyle(independentThinking, activeEngagement);
        const color = getStyleColor(followership.style);

        let breakdownHTML = `
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Independent Thinking Score:</strong> ${independentThinking} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Active Engagement Score:</strong> ${activeEngagement} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}; background: ${color}20;">
                <strong>Your Followership Style: ${followership.style}</strong><br>
                <em>${followership.description}</em>
            </div>
        `;
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderChart(scores, followership);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function renderChart(scores, followership) {
        if (scatterChart) scatterChart.destroy();

        const ctx = document.getElementById('resultChart').getContext('2d');
        const color = getStyleColor(followership.style);

        scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Your Position',
                    data: [{ x: scores.independentThinking, y: scores.activeEngagement }],
                    backgroundColor: color,
                    borderColor: color,
                    pointRadius: 15,
                    pointHoverRadius: 18
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Independent Thinking Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    },
                    y: {
                        title: { display: true, text: 'Active Engagement Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Your Followership Style: ${followership.style}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    annotation: {
                        annotations: {
                            line1: { type: 'line', xMin: 20, xMax: 20, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line2: { type: 'line', xMin: 40, xMax: 40, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line3: { type: 'line', xMin: 0, xMax: 60, yMin: 20, yMax: 20, borderColor: '#e2e8f0', borderWidth: 2 },
                            line4: { type: 'line', xMin: 0, xMax: 60, yMin: 40, yMax: 40, borderColor: '#e2e8f0', borderWidth: 2 }
                        }
                    }
                }
            }
        });
    }

    // Add modal functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-style')) {
            const style = e.target.getAttribute('data-style');
            const info = styleDescriptions[style];
            modalTitle.textContent = info.title;
            modalDescription.textContent = info.description;
            modal.style.display = 'block';
        }
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    followershipForm.addEventListener('submit', e => {
        e.preventDefault();
        const scores = calculateScores();
        displayResults(scores);
    });

    function calculateScores() {
        const formData = new FormData(followershipForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = parseInt(value, 10);
        }

        // Independent Thinking Score: Questions 1, 5, 11, 12, 14, 16, 17, 18, 19, and 20
        const independentThinking = 
            answers.q1 + answers.q5 + answers.q11 + answers.q12 + answers.q14 + 
            answers.q16 + answers.q17 + answers.q18 + answers.q19 + answers.q20;

        // Active Engagement Score: Questions 2, 3, 4, 6, 7, 8, 9, 10, 13, and 15
        const activeEngagement = 
            answers.q2 + answers.q3 + answers.q4 + answers.q6 + answers.q7 + 
            answers.q8 + answers.q9 + answers.q10 + answers.q13 + answers.q15;

        return {
            independentThinking,
            activeEngagement
        };
    }

    function getFollowershipStyle(independentThinking, activeEngagement) {
        if (independentThinking > 40 && activeEngagement > 40) {
            return { style: 'Exemplary', description: 'You exhibit high independent thinking and high active engagement. You are a valuable follower who thinks critically and contributes actively.' };
        } else if (independentThinking > 40 && activeEngagement < 20) {
            return { style: 'Alienated', description: 'You think independently but are not actively engaged. You may feel disconnected or disillusioned with the organization.' };
        } else if (independentThinking < 20 && activeEngagement > 40) {
            return { style: 'Conformist', description: 'You are actively engaged but don\'t think independently. You tend to follow orders without questioning and seek to please.' };
        } else if (independentThinking >= 20 && independentThinking <= 40 && activeEngagement >= 20 && activeEngagement <= 40) {
            return { style: 'Pragmatist', description: 'You fall in the middle range on both dimensions. You are cautious and tend to play it safe in your followership approach.' };
        } else {
            return { style: 'Passive', description: 'You exhibit low independent thinking and low active engagement. You tend to look to leaders for direction and lack initiative.' };
        }
    }

    function getStyleColor(style) {
        const colors = {
            'Exemplary': '#48bb78',
            'Alienated': '#f56565', 
            'Conformist': '#4299e1',
            'Pragmatist': '#f6e05e',
            'Passive': '#a0aec0'
        };
        return colors[style] || '#a0aec0';
    }

    function displayResults(scores) {
        resultDiv.style.display = 'block';

        const { independentThinking, activeEngagement } = scores;
        const followership = getFollowershipStyle(independentThinking, activeEngagement);
        const color = getStyleColor(followership.style);

        let breakdownHTML = `
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Independent Thinking Score:</strong> ${independentThinking} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}">
                <strong>Active Engagement Score:</strong> ${activeEngagement} / 60
            </div>
            <div class="score-line" style="border-left-color: ${color}; background: ${color}20;">
                <strong>Your Followership Style: ${followership.style}</strong><br>
                <em>${followership.description}</em>
            </div>
        `;
        scoreBreakdownDiv.innerHTML = breakdownHTML;

        renderChart(scores, followership);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function renderChart(scores, followership) {
        if (scatterChart) scatterChart.destroy();

        const ctx = document.getElementById('resultChart').getContext('2d');
        const color = getStyleColor(followership.style);

        scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Your Position',
                    data: [{ x: scores.independentThinking, y: scores.activeEngagement }],
                    backgroundColor: color,
                    borderColor: color,
                    pointRadius: 15,
                    pointHoverRadius: 18
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Independent Thinking Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    },
                    y: {
                        title: { display: true, text: 'Active Engagement Score (0-60)', font: { size: 14 } },
                        min: 0,
                        max: 60,
                        grid: { display: true }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Your Followership Style: ${followership.style}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    annotation: {
                        annotations: {
                            line1: { type: 'line', xMin: 20, xMax: 20, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line2: { type: 'line', xMin: 40, xMax: 40, yMin: 0, yMax: 60, borderColor: '#e2e8f0', borderWidth: 2 },
                            line3: { type: 'line', xMin: 0, xMax: 60, yMin: 20, yMax: 20, borderColor: '#e2e8f0', borderWidth: 2 },
                            line4: { type: 'line', xMin: 0, xMax: 60, yMin: 40, yMax: 40, borderColor: '#e2e8f0', borderWidth: 2 }
                        }
                    }
                }
            }
        });
    }

    renderQuestions();

    // Add random fill button functionality
    document.getElementById('randomFillBtn').addEventListener('click', () => {
        questions.forEach(q => {
            const randomValue = Math.floor(Math.random() * 7); // 0-6
            const radioButton = document.querySelector(`input[name="q${q.id}"][value="${randomValue}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
        });
    });
});
