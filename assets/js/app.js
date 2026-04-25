// Staff Engineer Interview Prep - Main JavaScript
// Comprehensive interactive learning framework

(function() {
    'use strict';

    // Create global namespace
    window.StaffEngPrep = window.StaffEngPrep || {};

    // ============================================
    // PROGRESS TRACKER - localStorage based
    // ============================================
    const ProgressTracker = {
        STORAGE_KEY: 'staffengprep_progress',

        _getProgress() {
            try {
                const data = localStorage.getItem(this.STORAGE_KEY);
                return data ? JSON.parse(data) : { modules: {}, concepts: {}, quizScores: {} };
            } catch (e) {
                console.warn('Failed to load progress:', e);
                return { modules: {}, concepts: {}, quizScores: {} };
            }
        },

        _saveProgress(progress) {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
            } catch (e) {
                console.warn('Failed to save progress:', e);
            }
        },

        markModuleComplete(course, moduleNum) {
            const progress = this._getProgress();
            if (!progress.modules[course]) {
                progress.modules[course] = {};
            }
            progress.modules[course][moduleNum] = {
                completed: true,
                completedAt: new Date().toISOString()
            };
            this._saveProgress(progress);
            this._updateSidebarUI(course, moduleNum);
        },

        isModuleComplete(course, moduleNum) {
            const progress = this._getProgress();
            return !!(progress.modules[course] && progress.modules[course][moduleNum]?.completed);
        },

        getModuleProgress(course) {
            const progress = this._getProgress();
            return progress.modules[course] || {};
        },

        getCompletedCount(course, totalModules) {
            const moduleProgress = this.getModuleProgress(course);
            return Object.values(moduleProgress).filter(m => m.completed).length;
        },

        _updateSidebarUI(course, moduleNum) {
            const link = document.querySelector(`.sidebar-link[data-module="${moduleNum}"]`);
            if (link) {
                link.classList.add('completed');
            }
        },

        // Concept review tracking for spaced repetition
        markConceptReviewed(conceptId) {
            const progress = this._getProgress();
            if (!progress.concepts[conceptId]) {
                progress.concepts[conceptId] = { reviews: [], interval: 1 };
            }
            const concept = progress.concepts[conceptId];
            concept.reviews.push(new Date().toISOString());
            // Simple spaced repetition: double interval each time (1, 2, 4, 8... days)
            concept.interval = Math.min(concept.interval * 2, 30);
            concept.nextReview = this._addDays(new Date(), concept.interval).toISOString();
            this._saveProgress(progress);
        },

        getConceptStatus(conceptId) {
            const progress = this._getProgress();
            return progress.concepts[conceptId] || null;
        },

        getDueForReview() {
            const progress = this._getProgress();
            const now = new Date();
            const due = [];
            for (const [id, concept] of Object.entries(progress.concepts)) {
                if (concept.nextReview && new Date(concept.nextReview) <= now) {
                    due.push({ id, ...concept });
                }
            }
            return due;
        },

        // Alias for getDueForReview (used in some pages)
        getDueReviews() {
            return this.getDueForReview();
        },

        // Get overall progress percentage for a course
        getOverallProgress(course) {
            const totalModules = {
                'coding': 9,
                'systemDesign': 12,
                'companySpecific': 6,
                'behavioral': 6
            };
            const progress = this._getProgress();
            const moduleProgress = progress.modules[course] || {};
            const completed = Object.values(moduleProgress).filter(m => m && m.completed).length;
            const total = totalModules[course] || 9;
            return Math.round((completed / total) * 100);
        },

        // Public getter for progress data
        getProgress() {
            return this._getProgress();
        },

        _addDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },

        // Quiz score tracking
        saveQuizScore(quizId, score, total) {
            const progress = this._getProgress();
            if (!progress.quizScores[quizId]) {
                progress.quizScores[quizId] = [];
            }
            progress.quizScores[quizId].push({
                score,
                total,
                percentage: Math.round((score / total) * 100),
                date: new Date().toISOString()
            });
            this._saveProgress(progress);
        },

        getQuizScores(quizId) {
            const progress = this._getProgress();
            return progress.quizScores[quizId] || [];
        },

        // Reset all progress
        resetProgress() {
            localStorage.removeItem(this.STORAGE_KEY);
        }
    };

    // ============================================
    // QUIZ SYSTEM - Interactive assessments
    // ============================================
    class Quiz {
        constructor(containerId, questions, options = {}) {
            this.container = document.getElementById(containerId);
            this.questions = questions;
            this.options = {
                showFeedback: true,
                shuffleOptions: false,
                quizId: containerId,
                ...options
            };
            this.currentQuestion = 0;
            this.answers = [];
            this.score = 0;
        }

        render() {
            if (!this.container) {
                console.warn('Quiz container not found');
                return;
            }

            this.container.innerHTML = '';
            this.container.className = 'quiz-container';

            if (this.questions.length === 0) {
                this.container.innerHTML = '<p class="text-muted">No quiz questions available.</p>';
                return;
            }

            // Render all questions
            this.questions.forEach((q, index) => {
                const questionEl = this._createQuestionElement(q, index);
                this.container.appendChild(questionEl);
            });

            // Add submit button
            const submitBtn = document.createElement('button');
            submitBtn.className = 'btn btn-primary mt-3';
            submitBtn.textContent = 'Check Answers';
            submitBtn.addEventListener('click', () => this._checkAnswers());
            this.container.appendChild(submitBtn);

            // Results container
            const resultsEl = document.createElement('div');
            resultsEl.id = `${this.options.quizId}-results`;
            resultsEl.className = 'quiz-results mt-3';
            resultsEl.style.display = 'none';
            this.container.appendChild(resultsEl);
        }

        _createQuestionElement(question, index) {
            const div = document.createElement('div');
            div.className = 'quiz-question-block';
            div.dataset.questionIndex = index;

            const questionText = document.createElement('div');
            questionText.className = 'quiz-question';
            questionText.innerHTML = `<strong>Q${index + 1}.</strong> ${question.question}`;
            div.appendChild(questionText);

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'quiz-options';

            let options = [...question.options];
            if (this.options.shuffleOptions) {
                options = this._shuffle(options.map((opt, i) => ({ text: opt, originalIndex: i })));
            } else {
                options = options.map((opt, i) => ({ text: opt, originalIndex: i }));
            }

            options.forEach((opt, optIndex) => {
                const optionEl = document.createElement('label');
                optionEl.className = 'quiz-option';
                optionEl.innerHTML = `
                    <input type="radio" name="quiz-q${index}" value="${opt.originalIndex}">
                    <span class="option-text">${opt.text}</span>
                `;
                optionEl.querySelector('input').addEventListener('change', () => {
                    this._selectOption(index, opt.originalIndex);
                });
                optionsContainer.appendChild(optionEl);
            });

            div.appendChild(optionsContainer);

            // Feedback container (hidden initially)
            const feedbackEl = document.createElement('div');
            feedbackEl.className = 'quiz-feedback';
            feedbackEl.id = `feedback-q${index}`;
            div.appendChild(feedbackEl);

            return div;
        }

        _selectOption(questionIndex, optionIndex) {
            this.answers[questionIndex] = optionIndex;

            // Update visual selection
            const questionBlock = this.container.querySelector(`[data-question-index="${questionIndex}"]`);
            questionBlock.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            const selectedInput = questionBlock.querySelector(`input[value="${optionIndex}"]`);
            if (selectedInput) {
                selectedInput.closest('.quiz-option').classList.add('selected');
            }
        }

        _checkAnswers() {
            this.score = 0;

            this.questions.forEach((q, index) => {
                const questionBlock = this.container.querySelector(`[data-question-index="${index}"]`);
                const feedback = questionBlock.querySelector('.quiz-feedback');
                const userAnswer = this.answers[index];

                // Clear previous state
                questionBlock.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('correct', 'incorrect');
                });

                if (userAnswer === undefined) {
                    feedback.className = 'quiz-feedback show incorrect';
                    feedback.innerHTML = '<strong>Not answered.</strong> The correct answer is: ' + q.options[q.correct];
                    // Highlight correct answer
                    const correctInput = questionBlock.querySelector(`input[value="${q.correct}"]`);
                    if (correctInput) {
                        correctInput.closest('.quiz-option').classList.add('correct');
                    }
                } else if (userAnswer === q.correct) {
                    this.score++;
                    feedback.className = 'quiz-feedback show correct';
                    feedback.innerHTML = '<strong>Correct!</strong> ' + (q.explanation || '');
                    const correctInput = questionBlock.querySelector(`input[value="${q.correct}"]`);
                    if (correctInput) {
                        correctInput.closest('.quiz-option').classList.add('correct');
                    }
                } else {
                    feedback.className = 'quiz-feedback show incorrect';
                    feedback.innerHTML = '<strong>Incorrect.</strong> ' + (q.explanation || 'The correct answer is: ' + q.options[q.correct]);
                    // Highlight wrong and correct
                    const wrongInput = questionBlock.querySelector(`input[value="${userAnswer}"]`);
                    if (wrongInput) {
                        wrongInput.closest('.quiz-option').classList.add('incorrect');
                    }
                    const correctInput = questionBlock.querySelector(`input[value="${q.correct}"]`);
                    if (correctInput) {
                        correctInput.closest('.quiz-option').classList.add('correct');
                    }
                }
            });

            // Show results
            const resultsEl = document.getElementById(`${this.options.quizId}-results`);
            const percentage = Math.round((this.score / this.questions.length) * 100);
            resultsEl.style.display = 'block';
            resultsEl.innerHTML = `
                <div class="quiz-score-card ${percentage >= 70 ? 'passed' : 'needs-work'}">
                    <h4>Quiz Results</h4>
                    <div class="score-display">
                        <span class="score-number">${this.score}/${this.questions.length}</span>
                        <span class="score-percentage">(${percentage}%)</span>
                    </div>
                    <p>${percentage >= 70 ? 'Great job! You\'ve mastered this material.' : 'Review the explanations above and try again.'}</p>
                </div>
            `;

            // Save score
            ProgressTracker.saveQuizScore(this.options.quizId, this.score, this.questions.length);

            // Disable further changes
            this.container.querySelectorAll('input').forEach(input => {
                input.disabled = true;
            });

            // Change submit button to retry
            const submitBtn = this.container.querySelector('.btn-primary');
            submitBtn.textContent = 'Retry Quiz';
            submitBtn.addEventListener('click', () => {
                this.answers = [];
                this.score = 0;
                this.render();
            }, { once: true });
        }

        _shuffle(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
    }

    // ============================================
    // SPACED REPETITION REVIEW SYSTEM
    // ============================================
    function renderReviewSchedule(containerId, concepts) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        const header = document.createElement('h4');
        header.textContent = 'Key Concepts to Review';
        header.style.marginBottom = '1rem';
        container.appendChild(header);

        concepts.forEach(concept => {
            const status = ProgressTracker.getConceptStatus(concept.id);
            const isReviewed = status && status.reviews && status.reviews.length > 0;
            const isDue = status && status.nextReview && new Date(status.nextReview) <= new Date();

            const item = document.createElement('div');
            item.className = 'review-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'review-checkbox';
            checkbox.checked = isReviewed && !isDue;
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    ProgressTracker.markConceptReviewed(concept.id);
                    updateReviewStatus(item, concept.id);
                }
            });

            const conceptName = document.createElement('span');
            conceptName.className = 'review-concept';
            conceptName.textContent = concept.name;

            const dueText = document.createElement('span');
            dueText.className = 'review-due' + (isDue ? ' overdue' : '');

            if (isDue) {
                dueText.textContent = 'Due for review!';
            } else if (status && status.nextReview) {
                const nextDate = new Date(status.nextReview);
                const days = Math.ceil((nextDate - new Date()) / (1000 * 60 * 60 * 24));
                dueText.textContent = `Review in ${days} day${days !== 1 ? 's' : ''}`;
            } else {
                dueText.textContent = 'Not started';
            }

            item.appendChild(checkbox);
            item.appendChild(conceptName);
            item.appendChild(dueText);
            container.appendChild(item);
        });
    }

    function updateReviewStatus(itemEl, conceptId) {
        const status = ProgressTracker.getConceptStatus(conceptId);
        const dueText = itemEl.querySelector('.review-due');
        if (status && status.nextReview) {
            const nextDate = new Date(status.nextReview);
            const days = Math.ceil((nextDate - new Date()) / (1000 * 60 * 60 * 24));
            dueText.textContent = `Review in ${days} day${days !== 1 ? 's' : ''}`;
            dueText.classList.remove('overdue');
        }
    }

    // ============================================
    // INTERACTIVE VISUALIZATIONS
    // ============================================
    class AlgorithmVisualizer {
        constructor(containerId, options = {}) {
            this.container = document.getElementById(containerId);
            this.options = {
                speed: 500,
                showCode: true,
                ...options
            };
            this.isPlaying = false;
            this.currentStep = 0;
            this.steps = [];
        }

        // Array visualization
        visualizeArray(arr, highlights = {}) {
            if (!this.container) return;

            const viz = document.createElement('div');
            viz.className = 'array-viz';

            arr.forEach((val, i) => {
                const cell = document.createElement('div');
                cell.className = 'array-cell';
                if (highlights.current === i) cell.classList.add('current');
                if (highlights.comparing === i) cell.classList.add('comparing');
                if (highlights.sorted && highlights.sorted.includes(i)) cell.classList.add('sorted');
                if (highlights.swapping && highlights.swapping.includes(i)) cell.classList.add('swapping');

                cell.innerHTML = `
                    <span class="cell-value">${val}</span>
                    <span class="cell-index">${i}</span>
                `;
                viz.appendChild(cell);
            });

            this.container.innerHTML = '';
            this.container.appendChild(viz);
        }

        // Graph visualization using simple SVG
        visualizeGraph(nodes, edges, highlights = {}) {
            if (!this.container) return;

            const width = this.container.clientWidth || 400;
            const height = 300;
            const nodeRadius = 25;

            // Simple circular layout
            const positions = {};
            const angleStep = (2 * Math.PI) / nodes.length;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 2 - nodeRadius - 20;

            nodes.forEach((node, i) => {
                positions[node] = {
                    x: centerX + radius * Math.cos(angleStep * i - Math.PI / 2),
                    y: centerY + radius * Math.sin(angleStep * i - Math.PI / 2)
                };
            });

            let svg = `<svg width="${width}" height="${height}" class="graph-viz">`;

            // Draw edges
            edges.forEach(([from, to]) => {
                const p1 = positions[from];
                const p2 = positions[to];
                if (p1 && p2) {
                    const isHighlighted = highlights.edges && highlights.edges.some(
                        e => (e[0] === from && e[1] === to) || (e[0] === to && e[1] === from)
                    );
                    svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"
                            class="graph-edge ${isHighlighted ? 'highlighted' : ''}" />`;
                }
            });

            // Draw nodes
            nodes.forEach(node => {
                const pos = positions[node];
                const isVisited = highlights.visited && highlights.visited.includes(node);
                const isCurrent = highlights.current === node;
                const isInQueue = highlights.queue && highlights.queue.includes(node);

                svg += `
                    <circle cx="${pos.x}" cy="${pos.y}" r="${nodeRadius}"
                            class="graph-node ${isVisited ? 'visited' : ''} ${isCurrent ? 'current' : ''} ${isInQueue ? 'in-queue' : ''}" />
                    <text x="${pos.x}" y="${pos.y}" class="graph-node-label">${node}</text>
                `;
            });

            svg += '</svg>';
            this.container.innerHTML = svg;
        }

        // Tree visualization
        visualizeTree(root, highlights = {}) {
            if (!this.container || !root) return;

            const width = this.container.clientWidth || 500;
            const height = 300;
            const nodeRadius = 20;
            const levelHeight = 60;

            // Calculate positions using BFS
            const positions = {};
            const levels = [];
            const queue = [{ node: root, level: 0 }];

            while (queue.length > 0) {
                const { node, level } = queue.shift();
                if (!levels[level]) levels[level] = [];
                levels[level].push(node);

                if (node.left) queue.push({ node: node.left, level: level + 1 });
                if (node.right) queue.push({ node: node.right, level: level + 1 });
            }

            // Position nodes
            levels.forEach((levelNodes, level) => {
                const y = 40 + level * levelHeight;
                const spacing = width / (levelNodes.length + 1);
                levelNodes.forEach((node, i) => {
                    positions[node.val] = { x: spacing * (i + 1), y, node };
                });
            });

            let svg = `<svg width="${width}" height="${height}" class="tree-viz">`;

            // Draw edges first
            Object.values(positions).forEach(({ x, y, node }) => {
                if (node.left && positions[node.left.val]) {
                    const child = positions[node.left.val];
                    svg += `<line x1="${x}" y1="${y}" x2="${child.x}" y2="${child.y}" class="tree-edge" />`;
                }
                if (node.right && positions[node.right.val]) {
                    const child = positions[node.right.val];
                    svg += `<line x1="${x}" y1="${y}" x2="${child.x}" y2="${child.y}" class="tree-edge" />`;
                }
            });

            // Draw nodes
            Object.entries(positions).forEach(([val, { x, y }]) => {
                const isCurrent = highlights.current === parseInt(val);
                const isVisited = highlights.visited && highlights.visited.includes(parseInt(val));

                svg += `
                    <circle cx="${x}" cy="${y}" r="${nodeRadius}"
                            class="tree-node ${isCurrent ? 'current' : ''} ${isVisited ? 'visited' : ''}" />
                    <text x="${x}" y="${y}" class="tree-node-label">${val}</text>
                `;
            });

            svg += '</svg>';
            this.container.innerHTML = svg;
        }

        // Step-through animation system
        setSteps(steps) {
            this.steps = steps;
            this.currentStep = 0;
        }

        play() {
            if (this.isPlaying || this.currentStep >= this.steps.length) return;

            this.isPlaying = true;
            this._animate();
        }

        pause() {
            this.isPlaying = false;
        }

        reset() {
            this.isPlaying = false;
            this.currentStep = 0;
            if (this.steps.length > 0) {
                this.steps[0].render();
            }
        }

        stepForward() {
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                this.steps[this.currentStep].render();
            }
        }

        stepBackward() {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.steps[this.currentStep].render();
            }
        }

        _animate() {
            if (!this.isPlaying || this.currentStep >= this.steps.length) {
                this.isPlaying = false;
                return;
            }

            this.steps[this.currentStep].render();
            this.currentStep++;

            setTimeout(() => this._animate(), this.options.speed);
        }
    }

    // ============================================
    // CODE RUNNER - Interactive code examples
    // ============================================
    class CodeRunner {
        constructor(containerId, code, options = {}) {
            this.container = document.getElementById(containerId);
            this.code = code;
            this.options = {
                language: 'python',
                editable: false,
                ...options
            };
        }

        render() {
            if (!this.container) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'code-runner';

            const codeBlock = document.createElement('pre');
            codeBlock.className = 'code-block';

            const codeEl = document.createElement('code');
            codeEl.className = `language-${this.options.language}`;
            codeEl.textContent = this.code;

            if (this.options.editable) {
                codeEl.contentEditable = true;
                codeEl.className += ' editable';
            }

            codeBlock.appendChild(codeEl);
            wrapper.appendChild(codeBlock);

            // Note: Actual code execution would require a backend or sandboxed environment
            // This is a placeholder for the UI

            this.container.innerHTML = '';
            this.container.appendChild(wrapper);

            // Trigger Prism.js highlighting if available
            if (typeof Prism !== 'undefined') {
                Prism.highlightElement(codeEl);
            }
        }
    }

    // ============================================
    // FLASHCARD SYSTEM
    // ============================================
    class Flashcards {
        constructor(containerId, cards) {
            this.container = document.getElementById(containerId);
            this.cards = cards;
            this.currentIndex = 0;
            this.isFlipped = false;
        }

        render() {
            if (!this.container || this.cards.length === 0) return;

            this.container.innerHTML = '';
            this.container.className = 'flashcard-container';

            const card = this.cards[this.currentIndex];

            const cardEl = document.createElement('div');
            cardEl.className = 'flashcard' + (this.isFlipped ? ' flipped' : '');

            cardEl.innerHTML = `
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <h4>Question</h4>
                        <p>${card.question}</p>
                        <small class="text-muted">Click to reveal answer</small>
                    </div>
                    <div class="flashcard-back">
                        <h4>Answer</h4>
                        <p>${card.answer}</p>
                        ${card.explanation ? `<p class="text-muted"><em>${card.explanation}</em></p>` : ''}
                    </div>
                </div>
            `;

            cardEl.addEventListener('click', () => {
                this.isFlipped = !this.isFlipped;
                cardEl.classList.toggle('flipped');
            });

            this.container.appendChild(cardEl);

            // Navigation
            const nav = document.createElement('div');
            nav.className = 'flashcard-nav mt-2';
            nav.innerHTML = `
                <button class="btn btn-secondary btn-sm" id="fc-prev" ${this.currentIndex === 0 ? 'disabled' : ''}>
                    &larr; Previous
                </button>
                <span class="flashcard-counter">${this.currentIndex + 1} / ${this.cards.length}</span>
                <button class="btn btn-secondary btn-sm" id="fc-next" ${this.currentIndex === this.cards.length - 1 ? 'disabled' : ''}>
                    Next &rarr;
                </button>
            `;

            nav.querySelector('#fc-prev').addEventListener('click', () => this.prev());
            nav.querySelector('#fc-next').addEventListener('click', () => this.next());

            this.container.appendChild(nav);
        }

        next() {
            if (this.currentIndex < this.cards.length - 1) {
                this.currentIndex++;
                this.isFlipped = false;
                this.render();
            }
        }

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.isFlipped = false;
                this.render();
            }
        }
    }

    // ============================================
    // COMPARISON TABLE BUILDER
    // ============================================
    function createComparisonTable(containerId, headers, rows, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const table = document.createElement('table');
        table.className = 'comparison-table';

        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach((cell, i) => {
                const td = document.createElement('td');
                td.innerHTML = cell;
                if (options.highlightBest && options.highlightBest.includes(i)) {
                    td.classList.add('highlight');
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        container.innerHTML = '';
        container.appendChild(table);
    }

    // ============================================
    // COLLAPSIBLES - Initialize
    // ============================================
    function initCollapsibles() {
        document.querySelectorAll('.collapsible-header').forEach(header => {
            // Prevent duplicate event listeners
            if (header.dataset.collapsibleInit) return;
            header.dataset.collapsibleInit = 'true';

            header.addEventListener('click', (e) => {
                // Prevent event from bubbling if clicking on elements inside header
                e.stopPropagation();
                const collapsible = header.parentElement;
                collapsible.classList.toggle('open');
            });
        });
    }

    // ============================================
    // MERMAID - Initialize
    // ============================================
    function initMermaid() {
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'dark',
                securityLevel: 'loose',
                flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                    curve: 'basis'
                }
            });
        }
    }

    // ============================================
    // SIDEBAR - Mobile toggle
    // ============================================
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('sidebarToggle');
        const overlay = document.getElementById('sidebarOverlay');

        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                if (overlay) overlay.classList.toggle('open');
            });
        }

        if (overlay && sidebar) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
            });
        }
    }

    // ============================================
    // PROGRESS BAR - Update UI
    // ============================================
    function updateProgressBar(course, totalModules) {
        const completed = ProgressTracker.getCompletedCount(course, totalModules);
        const percentage = Math.round((completed / totalModules) * 100);

        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        if (progressText) {
            progressText.textContent = `${completed} of ${totalModules} modules completed`;
        }
    }

    // ============================================
    // EXPORT TO GLOBAL NAMESPACE
    // ============================================
    window.StaffEngPrep = {
        ProgressTracker,
        Quiz,
        Flashcards,
        AlgorithmVisualizer,
        CodeRunner,
        createComparisonTable,
        renderReviewSchedule,
        updateProgressBar,
        initCollapsibles,
        initMermaid,
        initSidebar,
        initCodeBlocks
    };

    // ============================================
    // CODE BLOCK FORMATTER - Fix whitespace and add syntax highlighting
    // ============================================
    function initCodeBlocks() {
        // Load Prism.js CSS
        if (!document.querySelector('link[href*="prism"]')) {
            const prismCSS = document.createElement('link');
            prismCSS.rel = 'stylesheet';
            prismCSS.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css';
            document.head.appendChild(prismCSS);
        }

        // Load Prism.js
        if (typeof Prism === 'undefined') {
            const prismJS = document.createElement('script');
            prismJS.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
            prismJS.onload = () => {
                // Load common language components
                const languages = ['python', 'java', 'javascript', 'go', 'sql', 'bash', 'json'];
                languages.forEach(lang => {
                    const langScript = document.createElement('script');
                    langScript.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`;
                    document.head.appendChild(langScript);
                });

                // Re-highlight after languages load
                setTimeout(() => {
                    if (typeof Prism !== 'undefined') {
                        Prism.highlightAll();
                    }
                }, 500);
            };
            document.head.appendChild(prismJS);
        }

        // Fix code blocks that don't have <pre> wrapper
        document.querySelectorAll('.code-block').forEach(block => {
            const codeEl = block.querySelector('code');
            if (codeEl && block.tagName !== 'PRE' && !block.querySelector('pre')) {
                // Wrap the code element in a pre tag
                const pre = document.createElement('pre');
                pre.className = 'code-block-pre';
                codeEl.parentNode.insertBefore(pre, codeEl);
                pre.appendChild(codeEl);

                // Detect language from content if not specified
                const content = codeEl.textContent;
                if (!codeEl.className.includes('language-')) {
                    if (content.includes('def ') || content.includes('import ') || content.match(/:\s*$/m)) {
                        codeEl.className = 'language-python';
                    } else if (content.includes('func ') || content.includes('package ')) {
                        codeEl.className = 'language-go';
                    } else if (content.includes('public class') || content.includes('private ')) {
                        codeEl.className = 'language-java';
                    } else if (content.includes('const ') || content.includes('function ') || content.includes('=>')) {
                        codeEl.className = 'language-javascript';
                    } else if (content.includes('SELECT ') || content.includes('INSERT ') || content.includes('CREATE TABLE')) {
                        codeEl.className = 'language-sql';
                    } else if (content.match(/^\s*[\$#]/m) || content.includes('#!/bin/')) {
                        codeEl.className = 'language-bash';
                    }
                }
            }
        });

        // Trigger Prism highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }

    // ============================================
    // AUTO-INITIALIZE ON DOM READY
    // ============================================
    function initAll() {
        initCollapsibles();
        initMermaid();
        initSidebar();
        initCodeBlocks();
    }

    // Handle case where DOM is already loaded (script at end of body)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        // DOM already loaded, initialize immediately
        initAll();
    }

})();
