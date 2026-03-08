/**
 * nura — La Mia Routine
 * Supplement tracker with weekly calendar, localStorage persistence,
 * check-offs, running-low alerts, and re-order CTAs.
 */
document.addEventListener('DOMContentLoaded', () => {
    // ─── Constants ────────────────────────────────────────────
    const STORAGE_SUPPS = 'nura_supplements';
    const STORAGE_CHECKS = 'nura_checkins';
    const LOW_THRESHOLD_DAYS = 7;

    const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

    const CATEGORY_MAP = {
        gut: 'Gut Health',
        sleep: 'Sleep',
        energy: 'Energy',
        brain: 'Brain',
        longevity: 'Longevity',
        fitness: 'Fitness Recovery'
    };

    // ─── State ────────────────────────────────────────────────
    let supplements = loadSupplements();
    let checkins = loadCheckins();
    let currentWeekOffset = 0; // 0 = this week
    let notifiedThisSession = new Set(); // track which supplements we already notified about

    // ─── Browser Notifications ───────────────────────────────
    function requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    function sendLowSupplyNotifications() {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        const lowSupps = supplements.filter(isLowSupply);
        lowSupps.forEach(s => {
            if (notifiedThisSession.has(s.id)) return;
            notifiedThisSession.add(s.id);

            const remaining = getRemainingPills(s);
            const days = getRemainingDays(s);

            new Notification('⚠️ nura — Integratore in Esaurimento', {
                body: `${s.name}: ${remaining} pillole rimaste (~${days} giorni). Riordina ora!`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💊</text></svg>',
                tag: `nura-low-${s.id}`,
                requireInteraction: false
            });
        });
    }

    // Request permission immediately
    requestNotificationPermission();

    // ─── DOM References ───────────────────────────────────────
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('supplementForm');
    const editIdField = document.getElementById('editId');

    const calendarGrid = document.getElementById('calendarGrid');
    const weekLabel = document.getElementById('weekLabel');
    const supplementsList = document.getElementById('supplementsList');
    const emptyState = document.getElementById('emptyState');

    const alertsSection = document.getElementById('alertsSection');
    const alertsContainer = document.getElementById('alertsContainer');

    const statTotal = document.getElementById('statTotal');
    const statToday = document.getElementById('statToday');
    const statDone = document.getElementById('statDone');
    const statLow = document.getElementById('statLow');

    // ─── Helpers ──────────────────────────────────────────────
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function loadSupplements() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_SUPPS)) || [];
        } catch { return []; }
    }

    function saveSupplements() {
        localStorage.setItem(STORAGE_SUPPS, JSON.stringify(supplements));
    }

    function loadCheckins() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_CHECKS)) || {};
        } catch { return {}; }
    }

    function saveCheckins() {
        localStorage.setItem(STORAGE_CHECKS, JSON.stringify(checkins));
    }

    function getTodayKey() {
        return new Date().toISOString().slice(0, 10);
    }

    function getDayOfWeekIndex(date) {
        // JS getDay: 0=Sun...6=Sat → convert to Mon=0...Sun=6
        return (date.getDay() + 6) % 7;
    }

    function getWeekDates(offset) {
        const now = new Date();
        const dayIdx = getDayOfWeekIndex(now);
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayIdx + (offset * 7));
        monday.setHours(0, 0, 0, 0);

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            dates.push(d);
        }
        return dates;
    }

    function formatDate(date) {
        return date.toISOString().slice(0, 10);
    }

    function formatDateShort(date) {
        return date.getDate() + '/' + (date.getMonth() + 1);
    }

    function getRemainingPills(supp) {
        return Math.max(0, supp.totalPills - (supp.pillsTaken || 0));
    }

    function getDosesPerWeek(supp) {
        const timesPerDay = supp.timeOfDay === 'both' ? 2 : 1;
        return supp.days.length * timesPerDay;
    }

    function getPillsPerWeek(supp) {
        return getDosesPerWeek(supp) * supp.pillsPerDose;
    }

    function getRemainingDays(supp) {
        const remaining = getRemainingPills(supp);
        const perWeek = getPillsPerWeek(supp);
        if (perWeek <= 0) return Infinity;
        return Math.floor((remaining / perWeek) * 7);
    }

    function isLowSupply(supp) {
        return getRemainingDays(supp) <= LOW_THRESHOLD_DAYS;
    }

    // ─── Render Dashboard Stats ──────────────────────────────
    function renderStats() {
        const todayKey = getTodayKey();
        const todayDayKey = DAY_KEYS[getDayOfWeekIndex(new Date())];

        const active = supplements.length;
        let dosesToday = 0;
        let doneToday = 0;
        let lowCount = 0;

        supplements.forEach(s => {
            if (s.days.includes(todayDayKey)) {
                const times = s.timeOfDay === 'both' ? ['morning', 'evening'] : [s.timeOfDay];
                dosesToday += times.length;

                // Check completions
                times.forEach(t => {
                    if (checkins[todayKey] && checkins[todayKey][t] && checkins[todayKey][t].includes(s.id)) {
                        doneToday++;
                    }
                });
            }
            if (isLowSupply(s)) lowCount++;
        });

        statTotal.textContent = active;
        statToday.textContent = dosesToday;
        statDone.textContent = doneToday;
        statLow.textContent = lowCount;

        // Animate the stat-alert card
        const alertCard = document.querySelector('.stat-alert');
        if (lowCount > 0) {
            alertCard.style.borderColor = '#fecaca';
            alertCard.style.background = 'linear-gradient(135deg, #fff5f5, #fff)';
        } else {
            alertCard.style.borderColor = '';
            alertCard.style.background = '';
        }
    }

    // ─── Render Alerts ───────────────────────────────────────
    function renderAlerts() {
        const lowSupps = supplements.filter(isLowSupply);

        if (lowSupps.length === 0) {
            alertsSection.style.display = 'none';
            return;
        }

        alertsSection.style.display = 'block';
        alertsContainer.innerHTML = lowSupps.map(s => {
            const remaining = getRemainingPills(s);
            const days = getRemainingDays(s);
            return `
                <div class="alert-card">
                    <span class="alert-icon"><i class="ph-fill ph-warning-circle"></i></span>
                    <span class="alert-text"><strong>${s.name}</strong> — ${remaining} pillole rimaste (~${days} giorni). È ora di riordinare!</span>
                    <button class="btn-reorder" onclick="window.location.href='index.html#featured'">
                        <i class="ph ph-shopping-cart" style="display:inline"></i> Riordina
                    </button>
                </div>
            `;
        }).join('');
    }

    // ─── Render Calendar ─────────────────────────────────────
    function renderCalendar() {
        const dates = getWeekDates(currentWeekOffset);
        const todayKey = getTodayKey();

        // Week label
        if (currentWeekOffset === 0) {
            weekLabel.textContent = 'Questa Settimana';
        } else if (currentWeekOffset === -1) {
            weekLabel.textContent = 'Settimana Scorsa';
        } else if (currentWeekOffset === 1) {
            weekLabel.textContent = 'Prossima Settimana';
        } else {
            weekLabel.textContent = formatDateShort(dates[0]) + ' – ' + formatDateShort(dates[6]);
        }

        // Build grid HTML
        let html = '';

        // Header row: empty corner + 7 day columns
        html += '<div class="cal-header-cell"></div>';
        dates.forEach((date, i) => {
            const isToday = formatDate(date) === todayKey;
            html += `<div class="cal-header-cell ${isToday ? 'today-col' : ''}">
                ${DAY_LABELS[i]}<br><small>${formatDateShort(date)}</small>
            </div>`;
        });

        // Morning row
        html += '<div class="cal-label"><i class="ph ph-sun"></i> Mattina</div>';
        dates.forEach((date, i) => {
            const dateKey = formatDate(date);
            const dayKey = DAY_KEYS[i];
            const isToday = dateKey === todayKey;
            const pills = getScheduledPills(dayKey, 'morning');
            html += `<div class="cal-cell ${isToday ? 'today-cell' : ''}">${renderCalPills(pills, dateKey, 'morning')}</div>`;
        });

        // Evening row
        html += '<div class="cal-label evening"><i class="ph ph-moon"></i> Sera</div>';
        dates.forEach((date, i) => {
            const dateKey = formatDate(date);
            const dayKey = DAY_KEYS[i];
            const isToday = dateKey === todayKey;
            const pills = getScheduledPills(dayKey, 'evening');
            html += `<div class="cal-cell ${isToday ? 'today-cell' : ''}">${renderCalPills(pills, dateKey, 'evening')}</div>`;
        });

        calendarGrid.innerHTML = html;

        // Attach check handlers
        calendarGrid.querySelectorAll('.cal-pill').forEach(pill => {
            pill.addEventListener('click', handlePillCheck);
        });
    }

    function getScheduledPills(dayKey, timeSlot) {
        return supplements.filter(s => {
            if (!s.days.includes(dayKey)) return false;
            if (s.timeOfDay === 'both') return true;
            return s.timeOfDay === timeSlot;
        });
    }

    function renderCalPills(pills, dateKey, timeSlot) {
        if (pills.length === 0) return '';
        return pills.map(s => {
            const isChecked = checkins[dateKey]
                && checkins[dateKey][timeSlot]
                && checkins[dateKey][timeSlot].includes(s.id);
            return `<div class="cal-pill cat-${s.category} ${isChecked ? 'checked' : ''}"
                        data-id="${s.id}" data-date="${dateKey}" data-time="${timeSlot}">
                <span class="pill-check"></span>
                <span>${s.name}</span>
            </div>`;
        }).join('');
    }

    function handlePillCheck(e) {
        const pill = e.currentTarget;
        const id = pill.dataset.id;
        const dateKey = pill.dataset.date;
        const timeSlot = pill.dataset.time;

        if (!checkins[dateKey]) checkins[dateKey] = {};
        if (!checkins[dateKey][timeSlot]) checkins[dateKey][timeSlot] = [];

        const arr = checkins[dateKey][timeSlot];
        const idx = arr.indexOf(id);

        if (idx > -1) {
            // Uncheck
            arr.splice(idx, 1);
            pill.classList.remove('checked');
            // Restore pill
            const supp = supplements.find(s => s.id === id);
            if (supp) {
                supp.pillsTaken = Math.max(0, (supp.pillsTaken || 0) - supp.pillsPerDose);
            }
        } else {
            // Check
            arr.push(id);
            pill.classList.add('checked');
            // Consume pills
            const supp = supplements.find(s => s.id === id);
            if (supp) {
                supp.pillsTaken = (supp.pillsTaken || 0) + supp.pillsPerDose;
            }
        }

        saveCheckins();
        saveSupplements();
        renderStats();
        renderAlerts();
        renderSupplementsList();
    }

    // ─── Render Supplements List ─────────────────────────────
    function renderSupplementsList() {
        if (supplements.length === 0) {
            emptyState.style.display = 'block';
            // Remove all supp-cards
            supplementsList.querySelectorAll('.supp-card').forEach(el => el.remove());
            return;
        }

        emptyState.style.display = 'none';

        // Remove existing cards
        supplementsList.querySelectorAll('.supp-card').forEach(el => el.remove());

        supplements.forEach(s => {
            const remaining = getRemainingPills(s);
            const total = s.totalPills;
            const pct = Math.round((remaining / total) * 100);
            const daysLeft = getRemainingDays(s);
            const low = isLowSupply(s);

            let progressClass = '';
            if (pct <= 20) progressClass = 'low';
            else if (pct <= 50) progressClass = 'medium';

            const timeLabel = s.timeOfDay === 'morning' ? '☀️ Mattina'
                : s.timeOfDay === 'evening' ? '🌙 Sera'
                    : '☀️ Mattina + 🌙 Sera';

            const card = document.createElement('div');
            card.className = `supp-card cat-${s.category}`;
            card.innerHTML = `
                <div class="supp-card-header">
                    <div>
                        <h4>${s.name}</h4>
                        <span class="supp-brand">${s.brand || CATEGORY_MAP[s.category]}</span>
                    </div>
                    <div class="supp-card-actions">
                        <button class="supp-action-btn edit" data-id="${s.id}" title="Modifica">
                            <i class="ph ph-pencil-simple"></i>
                        </button>
                        <button class="supp-action-btn delete" data-id="${s.id}" title="Elimina">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="supp-details">
                    <span class="supp-detail"><i class="ph ph-pill"></i> ${s.pillsPerDose} per dose</span>
                    <span class="supp-detail"><i class="ph ph-clock"></i> ${timeLabel}</span>
                </div>
                <div class="supp-days">
                    ${DAY_KEYS.map((dk, i) => `<span class="supp-day-badge ${s.days.includes(dk) ? 'active' : ''}">${DAY_LABELS[i][0]}</span>`).join('')}
                </div>
                <div class="supp-progress">
                    <div class="supp-progress-header">
                        <span class="supp-progress-label">Rimaste: ${remaining} / ${total}</span>
                        <span class="supp-progress-value">${pct}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${progressClass}" style="width: ${pct}%"></div>
                    </div>
                </div>
                <div class="supp-footer">
                    <span class="supp-remaining ${low ? 'low' : ''}">
                        ${low ? '⚠️ ' : ''}${daysLeft === Infinity ? '∞' : '~' + daysLeft} giorni rimasti
                    </span>
                    ${low ? `<button class="supp-reorder-btn" onclick="window.location.href='index.html#featured'">
                        <i class="ph ph-shopping-cart" style="display:inline"></i> Riordina
                    </button>` : ''}
                </div>
            `;

            supplementsList.appendChild(card);
        });

        // Attach edit/delete handlers
        supplementsList.querySelectorAll('.supp-action-btn.edit').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
        supplementsList.querySelectorAll('.supp-action-btn.delete').forEach(btn => {
            btn.addEventListener('click', () => deleteSupplement(btn.dataset.id));
        });
    }

    // ─── Modal Logic ─────────────────────────────────────────
    function openModal(editSupp = null) {
        form.reset();
        editIdField.value = '';

        if (editSupp) {
            modalTitle.textContent = 'Modifica Integratore';
            editIdField.value = editSupp.id;
            document.getElementById('suppName').value = editSupp.name;
            document.getElementById('suppBrand').value = editSupp.brand || '';
            document.getElementById('suppCategory').value = editSupp.category;
            document.getElementById('suppDose').value = editSupp.pillsPerDose;
            document.getElementById('suppTotal').value = editSupp.totalPills;

            // Time of day
            form.querySelector(`input[name="timeOfDay"][value="${editSupp.timeOfDay}"]`).checked = true;

            // Days
            form.querySelectorAll('.day-chip input').forEach(cb => {
                cb.checked = editSupp.days.includes(cb.value);
            });
        } else {
            modalTitle.textContent = 'Aggiungi Integratore';
            // Reset days to default (Mon-Fri checked)
            form.querySelectorAll('.day-chip input').forEach(cb => {
                cb.checked = ['mon', 'tue', 'wed', 'thu', 'fri'].includes(cb.value);
            });
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('suppName').focus(), 100);
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openEditModal(id) {
        const supp = supplements.find(s => s.id === id);
        if (supp) openModal(supp);
    }

    function deleteSupplement(id) {
        if (!confirm('Eliminare questo integratore dalla tua routine?')) return;
        supplements = supplements.filter(s => s.id !== id);

        // Clean checkins
        Object.keys(checkins).forEach(dateKey => {
            Object.keys(checkins[dateKey]).forEach(timeSlot => {
                checkins[dateKey][timeSlot] = checkins[dateKey][timeSlot].filter(cid => cid !== id);
            });
        });

        saveSupplements();
        saveCheckins();
        renderAll();
    }

    // ─── Form Submit ─────────────────────────────────────────
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('suppName').value.trim();
        const brand = document.getElementById('suppBrand').value.trim();
        const category = document.getElementById('suppCategory').value;
        const pillsPerDose = parseInt(document.getElementById('suppDose').value) || 1;
        const totalPills = parseInt(document.getElementById('suppTotal').value) || 60;
        const timeOfDay = form.querySelector('input[name="timeOfDay"]:checked').value;
        const days = Array.from(form.querySelectorAll('.day-chip input:checked')).map(cb => cb.value);

        if (!name || days.length === 0) return;

        const editId = editIdField.value;

        if (editId) {
            // Update existing
            const supp = supplements.find(s => s.id === editId);
            if (supp) {
                supp.name = name;
                supp.brand = brand;
                supp.category = category;
                supp.pillsPerDose = pillsPerDose;
                supp.totalPills = totalPills;
                supp.timeOfDay = timeOfDay;
                supp.days = days;
            }
        } else {
            // Create new
            supplements.push({
                id: generateId(),
                name,
                brand,
                category,
                pillsPerDose,
                totalPills,
                pillsTaken: 0,
                timeOfDay,
                days,
                createdAt: getTodayKey()
            });
        }

        saveSupplements();
        closeModal();
        renderAll();
    });

    // ─── Event Bindings ──────────────────────────────────────
    document.getElementById('addSupplementBtn').addEventListener('click', () => openModal());
    document.getElementById('addSupplementBtn2').addEventListener('click', () => openModal());
    document.getElementById('addSupplementBtnEmpty').addEventListener('click', () => openModal());
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalCancel').addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
    });

    // Calendar nav
    document.getElementById('calPrev').addEventListener('click', () => {
        currentWeekOffset--;
        renderCalendar();
    });
    document.getElementById('calNext').addEventListener('click', () => {
        currentWeekOffset++;
        renderCalendar();
    });

    // Header scroll effect (same as main page)
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ─── Render All ──────────────────────────────────────────
    function renderAll() {
        renderStats();
        renderAlerts();
        renderCalendar();
        renderSupplementsList();
        sendLowSupplyNotifications();
    }

    // Initial render
    renderAll();
});
