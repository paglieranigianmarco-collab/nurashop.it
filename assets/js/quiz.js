/**
 * NURA — Protocollo Longevity Quiz
 * 4 domande per costruire il profilo longevity personale
 * Flusso: email capture → quiz → risultati + CTA
 */
document.addEventListener('DOMContentLoaded', () => {

    // ─── PDF-Exact Questions ────────────────────────────────
    const QUESTIONS = [
        {
            id: 'goal',
            title: 'Qual è il tuo obiettivo principale?',
            desc: 'Scegli quello che ti sta più a cuore in questo momento.',
            options: [
                { value: 'sleep',    icon: 'ph-moon-stars',      label: 'Dormire meglio',    sub: 'Sonno profondo e ristoratore' },
                { value: 'energy',   icon: 'ph-lightning',       label: 'Più energia',       sub: 'Vitalità e performance tutto il giorno' },
                { value: 'focus',    icon: 'ph-brain',           label: 'Migliorare il focus', sub: 'Concentrazione e chiarezza mentale' },
                { value: 'general',  icon: 'ph-heart',           label: 'Salute generale',   sub: 'Benessere e longevità a lungo termine' }
            ]
        },
        {
            id: 'products_used',
            title: 'Quanti prodotti wellness usi oggi?',
            desc: 'Integratori, supplementi, vitamine — quanti ne prendi già?',
            options: [
                { value: 'none',    icon: 'ph-circle',          label: 'Nessuno',   sub: 'Parto da zero' },
                { value: '1_2',     icon: 'ph-number-circle-one', label: '1–2',     sub: 'Qualcosa di base già c\'è' },
                { value: '3_5',     icon: 'ph-number-circle-three', label: '3–5',   sub: 'Ho già una routine' },
                { value: '5_plus',  icon: 'ph-stack',           label: '5+',        sub: 'Sono già abbastanza avanzato' }
            ]
        },
        {
            id: 'sites_buying',
            title: 'Da quanti siti compri i tuoi prodotti?',
            desc: 'Vogliamo capire quanto è frammentato il tuo shopping wellness.',
            options: [
                { value: '1',       icon: 'ph-storefront',      label: '1 sito',    sub: 'Compro da un posto solo' },
                { value: '2',       icon: 'ph-browsers',        label: '2 siti',    sub: 'Divido tra un paio di shop' },
                { value: '3_plus',  icon: 'ph-globe',           label: '3 o più',   sub: 'Shopping disperso ovunque' }
            ]
        },
        {
            id: 'monthly_spend',
            title: 'Quanto spendi al mese in prodotti wellness?',
            desc: 'Questo ci aiuta a costruire il tuo protocollo in modo realistico.',
            options: [
                { value: 'under_50',    icon: 'ph-currency-eur',    label: 'Meno di €50',       sub: 'Budget iniziale' },
                { value: '50_100',      icon: 'ph-currency-eur',    label: '€50 – €100',        sub: 'Investimento moderato' },
                { value: '100_200',     icon: 'ph-currency-eur',    label: '€100 – €200',       sub: 'Priorità alla salute' },
                { value: '200_plus',    icon: 'ph-currency-eur',    label: '€200+',             sub: 'Massima performance' }
            ]
        }
    ];

    // ─── Result Protocols ───────────────────────────────────
    const PROTOCOLS = {
        sleep: {
            title: 'Sleep Optimization Protocol',
            icon: 'ph-moon-stars',
            color: '#4A63E0',
            products: ['Magnesio Glicinate 400', 'Blue Light Blocking Glasses', 'Deep Cellular Rest'],
            desc: 'Il tuo focus principale è il sonno. Con questo protocollo vedrai miglioramenti nella qualità del sonno in 2–3 settimane.'
        },
        energy: {
            title: 'Energy & Vitality Protocol',
            icon: 'ph-lightning',
            color: '#FA6B33',
            products: ['Mushroom Coffee Lion\'s Mane', 'Elettroliti LMNT Zero Sugar', 'Vitamina B Complex'],
            desc: 'Energia pulita e sostenuta durante tutta la giornata, senza picchi e crolli di caffeina.'
        },
        focus: {
            title: 'Cognitive Performance Protocol',
            icon: 'ph-brain',
            color: '#35B5E5',
            products: ['Mushroom Coffee Lion\'s Mane', 'Omega-3 DHA Premium', 'Magnesio L-Treonato'],
            desc: 'Focus profondo, riduzione del brain fog e performance cognitiva ottimale tutto il giorno.'
        },
        general: {
            title: 'Longevity Foundation Protocol',
            icon: 'ph-heart',
            color: '#245A46',
            products: ['Collagene Marino Idrolizzato', 'Magnesio Glicinate 400', 'Vitamina D3+K2'],
            desc: 'Le fondamenta del benessere a lungo termine. Il punto di partenza per chiunque voglia investire nella propria salute.'
        }
    };

    // ─── State ──────────────────────────────────────────────
    let currentStep = 0;
    const answers = {};
    let userEmail = '';

    // ─── DOM ────────────────────────────────────────────────
    const introSection = document.getElementById('quizIntro');
    const quizContainer = document.getElementById('quizContainer');
    const resultsSection = document.getElementById('quizResults');
    const questionArea = document.getElementById('questionArea');
    const stepLabel = document.getElementById('stepLabel');
    const progressFill = document.getElementById('quizProgressFill');
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const startBtn = document.getElementById('startQuizBtn');
    const retakeBtn = document.getElementById('retakeQuiz');

    // ─── Check for email param ───────────────────────────────
    // If user came from homepage email form, pre-populate and auto-start
    const params = new URLSearchParams(window.location.search);
    if (params.get('email')) {
        userEmail = decodeURIComponent(params.get('email'));
        if (params.get('autostart') === '1') {
            setTimeout(() => {
                introSection.style.display = 'none';
                quizContainer.style.display = 'flex';
                renderQuestion();
            }, 400);
        }
    }

    // ─── Start Quiz ─────────────────────────────────────────
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            introSection.style.display = 'none';
            quizContainer.style.display = 'flex';
            renderQuestion();
        });
    }

    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            currentStep = 0;
            Object.keys(answers).forEach(k => delete answers[k]);
            resultsSection.style.display = 'none';
            introSection.style.display = 'flex';
        });
    }

    // ─── Render Question ────────────────────────────────────
    function renderQuestion() {
        const q = QUESTIONS[currentStep];
        const pct = ((currentStep + 1) / QUESTIONS.length) * 100;

        progressFill.style.width = pct + '%';
        stepLabel.textContent = `Domanda ${currentStep + 1} di ${QUESTIONS.length}`;
        prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';

        const isLast = currentStep === QUESTIONS.length - 1;
        nextBtn.innerHTML = isLast
            ? 'Vedi il mio Protocollo <i class="ph ph-sparkle" style="display:inline"></i>'
            : 'Avanti <i class="ph ph-arrow-right" style="display:inline"></i>';

        const selected = answers[q.id] || null;
        nextBtn.disabled = !selected;

        questionArea.innerHTML = `
            <h2>${q.title}</h2>
            <p class="quiz-desc">${q.desc}</p>
            <div class="quiz-options">
                ${q.options.map(opt => `
                    <div class="quiz-option ${selected === opt.value ? 'selected' : ''}" data-value="${opt.value}">
                        <div class="quiz-option-icon"><i class="ph ${opt.icon}"></i></div>
                        <div class="quiz-option-text">
                            <strong>${opt.label}</strong>
                            ${opt.sub ? `<small>${opt.sub}</small>` : ''}
                        </div>
                        ${selected === opt.value ? '<div class="quiz-option-check"><i class="ph ph-check"></i></div>' : ''}
                    </div>
                `).join('')}
            </div>
        `;

        questionArea.querySelectorAll('.quiz-option').forEach(opt => {
            opt.addEventListener('click', () => {
                answers[q.id] = opt.dataset.value;
                questionArea.querySelectorAll('.quiz-option').forEach(o => {
                    o.classList.remove('selected');
                    o.querySelector('.quiz-option-check')?.remove();
                });
                opt.classList.add('selected');
                const check = document.createElement('div');
                check.className = 'quiz-option-check';
                check.innerHTML = '<i class="ph ph-check"></i>';
                opt.appendChild(check);
                nextBtn.disabled = false;
                // Auto-advance after short delay
                setTimeout(() => { if (nextBtn && !nextBtn.disabled) nextBtn.click(); }, 500);
            });
        });
    }

    // ─── Navigation ─────────────────────────────────────────
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < QUESTIONS.length - 1) {
                currentStep++;
                renderQuestion();
            } else {
                showResults();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                renderQuestion();
            }
        });
    }

    // ─── Show Results ───────────────────────────────────────
    function showResults() {
        quizContainer.style.display = 'none';
        resultsSection.style.display = 'block';

        const goal = answers.goal || 'general';
        const protocol = PROTOCOLS[goal];
        const spend = answers.monthly_spend;
        const sites = answers.sites_buying;

        // Personalized insight
        let insight = '';
        if (sites === '3_plus') {
            insight = `Compri da 3+ siti diversi. Con nura. potresti ricevere tutto in un unico ordine, risparmiando tempo e spedizioni.`;
        } else if (sites === '2') {
            insight = `Compri da 2 siti diversi. nura. unifica tutto in un posto.`;
        } else {
            insight = `Sei già organizzato. nura. ti porta solo i migliori prodotti internazionali non disponibili in Italia.`;
        }

        const grid = document.getElementById('resultsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="result-protocol-card">
                    <div class="result-protocol-header" style="background: ${protocol.color}">
                        <i class="ph ${protocol.icon}"></i>
                        <h2>${protocol.title}</h2>
                    </div>
                    <div class="result-protocol-body">
                        <p class="result-insight-text">${protocol.desc}</p>
                        <div class="result-products-list">
                            <p class="result-products-label">Il tuo stack raccomandato:</p>
                            ${protocol.products.map(p => `
                                <div class="result-product-item">
                                    <i class="ph ph-check-circle" style="color:${protocol.color}"></i>
                                    <span>${p}</span>
                                    <span class="result-coming-badge">In arrivo</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="result-insight-box">
                            <i class="ph ph-lightbulb"></i>
                            <p>${insight}</p>
                        </div>
                        <div class="result-final-cta">
                            <p>Vuoi ricevere questo protocollo quando apriamo?</p>
                            <form class="result-email-form" id="resultEmailForm" onsubmit="handleResultEmail(event)">
                                <input type="email" id="resultEmail" placeholder="La tua email..."
                                    value="${userEmail}" required class="lista-email-input">
                                <button type="submit" class="btn btn-primary btn-glow" style="width:100%;margin-top:0.75rem">
                                    <i class="ph ph-rocket-launch" style="display:inline;margin-right:6px"></i>
                                    Unisciti alla Lista Privata
                                </button>
                            </form>
                            <p class="lista-note" style="margin-top:0.75rem">
                                <i class="ph ph-lock-simple" style="display:inline;margin-right:4px"></i>Nessuno spam. Solo accesso anticipato.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // ─── Global email handlers ───────────────────────────────
    window.handleResultEmail = function(e) {
        e.preventDefault();
        const email = document.getElementById('resultEmail')?.value;
        submitToWaitlist(email, answers.goal);
    };

    function submitToWaitlist(email, goal) {
        // Store in localStorage as proof of concept
        const list = JSON.parse(localStorage.getItem('nura_waitlist') || '[]');
        if (!list.find(e => e.email === email)) {
            list.push({ email, goal, ts: Date.now() });
            localStorage.setItem('nura_waitlist', JSON.stringify(list));
        }
        // Show thank-you state
        const form = document.getElementById('resultEmailForm') || document.getElementById('listaPrivataForm') || document.getElementById('heroEmailForm');
        if (form) {
            form.innerHTML = `
                <div class="waitlist-success">
                    <i class="ph ph-check-circle"></i>
                    <h3>Sei nella lista!</h3>
                    <p>Ti avviseremo per primi quando apriamo. Controlla la tua email.</p>
                </div>
            `;
        }
        // Update counter
        const counters = document.querySelectorAll('#waitlistCounter, #listaCounterNum');
        counters.forEach(c => {
            const current = parseInt(c.textContent) || 247;
            c.textContent = current + 1;
        });
    }

    // ─── Header scroll ──────────────────────────────────────
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }
});
