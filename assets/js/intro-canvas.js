/**
 * intro-canvas.js — Constellation Intro v2
 * Phase 1: Scattered stars (0–1.5s)
 * Phase 2: Converge → "nura." (1.5–3.5s)
 * Phase 3: Hold + breathe (3.5–5.5s)
 * Phase 4: Scatter + "Made for you." (5.5–8s)
 * Phase 5: Transition to landing page (8–9s)
 */

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('simple-intro');
    if (!overlay) return;

    // Skip if already seen this session
    if (sessionStorage.getItem('nura_seen')) {
        overlay.style.display = 'none';
        return;
    }
    sessionStorage.setItem('nura_seen', '1');

    document.body.style.overflow = 'hidden';
    overlay.style.background = '#000';

    const canvas = document.getElementById('intro-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, dpr;
    let particles = [];
    let animId, startTime;
    let mfyShown = false, transitioning = false, done = false;

    const T = {
        CONVERGE:    1500,
        HOLD:        3500,
        SCATTER:     5500,
        MADEYOU:     6200,
        MADEYOU_OUT: 7500,
        TRANS:       8000,
        END:         9000,
    };

    // ── Canvas sizing ──────────────────────────────────────────
    const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.scale(dpr, dpr);
    };

    // ── Sample "nura." letter pixel positions ─────────────────
    const getTargets = () => {
        const off = document.createElement('canvas');
        off.width = W; off.height = H;
        const c = off.getContext('2d');

        // Scale font so "nura." fills ~55% of screen width
        let fs = Math.floor(W * 0.14);
        c.font = `800 ${fs}px Sora, sans-serif`;
        const mw = c.measureText('nura.').width;
        fs = Math.round(fs * (W * 0.55) / mw);
        fs = Math.max(48, Math.min(fs, 200));

        c.font = `800 ${fs}px Sora, sans-serif`;
        c.fillStyle = 'white';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('nura.', W / 2, H / 2);

        const { data } = c.getImageData(0, 0, W, H);
        const pts = [];
        const targetN = W < 768 ? 120 : 260;
        const stride = Math.max(3, Math.round(Math.sqrt((W * H) / (targetN * 10))));

        for (let y = 0; y < H; y += stride)
            for (let x = 0; x < W; x += stride)
                if (data[(y * W + x) * 4 + 3] > 128)
                    pts.push({ x, y });

        // Shuffle so assignments are spread across letters
        for (let i = pts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pts[i], pts[j]] = [pts[j], pts[i]];
        }
        return pts;
    };

    // ── Particle ───────────────────────────────────────────────
    class Particle {
        constructor(target) {
            this.x  = Math.random() * W;
            this.y  = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.r  = Math.random() * 1.2 + 0.4;
            this.op = Math.random() * 0.5 + 0.2;

            this.hasTarget = !!target;
            this.tx = target ? target.x : -999;
            this.ty = target ? target.y : -999;

            this.convDelay   = Math.random() * 600;
            this.convStarted = false;
            this.convX = 0; this.convY = 0;

            this.breathOff = Math.random() * Math.PI * 2;

            this.scatterVx = 0; this.scatterVy = 0;
            this.scatterInit = false;
        }

        drift() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;
        }

        converge(ce) {
            if (!this.hasTarget) {
                this.x += this.vx * 0.25; this.y += this.vy * 0.25;
                this.op = Math.max(0, this.op - 0.005);
                return;
            }
            if (ce < this.convDelay) { this.drift(); return; }
            if (!this.convStarted) {
                this.convX = this.x; this.convY = this.y;
                this.convStarted = true;
            }
            const t    = Math.min(1, (ce - this.convDelay) / 1800);
            const ease = 1 - Math.pow(1 - t, 3);
            this.x  = this.convX + (this.tx - this.convX) * ease;
            this.y  = this.convY + (this.ty - this.convY) * ease;
            this.op = 0.2 + ease * 0.65;
        }

        hold(he) {
            if (!this.hasTarget) { this.op = Math.max(0, this.op - 0.01); return; }
            const b = Math.sin(he * 0.0018 + this.breathOff);
            this.x  = this.tx + b * 0.9;
            this.y  = this.ty + Math.cos(he * 0.0018 + this.breathOff) * 0.9;
            this.op = 0.62 + b * 0.1;
        }

        scatter(se) {
            if (!this.scatterInit) {
                const dx = this.x - W / 2, dy = this.y - H / 2;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const spd = Math.random() * 1.6 + 0.4;
                this.scatterVx = dx / len * spd;
                this.scatterVy = dy / len * spd;
                this.scatterInit = true;
            }
            const accel = 1 + se / 1200;
            this.x += this.scatterVx * accel;
            this.y += this.scatterVy * accel;
            this.op = Math.max(0, this.op - 0.013);
        }

        draw() {
            if (this.op < 0.01) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${this.op.toFixed(2)})`;
            ctx.fill();
        }
    }

    // ── Constellation lines (spatial grid) ────────────────────
    const CELL = 90;
    const grid = new Map();

    const buildGrid = () => {
        grid.clear();
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const k = `${Math.floor(p.x / CELL)},${Math.floor(p.y / CELL)}`;
            if (!grid.has(k)) grid.set(k, []);
            grid.get(k).push(i);
        }
    };

    const drawLines = (maxDist, maxOp) => {
        buildGrid();
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.op < 0.08) continue;
            const gcx = Math.floor(p.x / CELL), gcy = Math.floor(p.y / CELL);
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const neighbors = grid.get(`${gcx+dx},${gcy+dy}`);
                    if (!neighbors) continue;
                    for (const j of neighbors) {
                        if (j <= i) continue;
                        const q = particles[j];
                        if (q.op < 0.08) continue;
                        const d2 = (p.x-q.x)**2 + (p.y-q.y)**2;
                        if (d2 < maxDist * maxDist) {
                            const op = (1 - Math.sqrt(d2) / maxDist) * maxOp * Math.min(p.op, q.op);
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(255,255,255,${op.toFixed(3)})`;
                            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                            ctx.stroke();
                        }
                    }
                }
            }
        }
    };

    // ── "Made for you." element ────────────────────────────────
    const mfyEl = document.createElement('div');
    mfyEl.textContent = 'Made for you.';
    Object.assign(mfyEl.style, {
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: "'Sora', sans-serif",
        fontSize: 'clamp(1.5rem, 3.2vw, 2.8rem)',
        fontWeight: '200',
        letterSpacing: '0.06em',
        color: 'rgba(255,255,255,0.88)',
        opacity: '0',
        transition: 'opacity 0.9s ease',
        pointerEvents: 'none',
        zIndex: '2',
        whiteSpace: 'nowrap',
    });
    overlay.appendChild(mfyEl);

    // ── Skip button ────────────────────────────────────────────
    const skipBtn = document.createElement('button');
    skipBtn.textContent = 'skip';
    Object.assign(skipBtn.style, {
        position: 'absolute', bottom: '2rem', right: '2rem',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.68rem', fontWeight: '500',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
        background: 'none', border: 'none', cursor: 'pointer',
        opacity: '0', transition: 'opacity 0.5s, color 0.2s',
        zIndex: '10', padding: '0.5rem 1rem',
    });
    overlay.appendChild(skipBtn);
    setTimeout(() => { skipBtn.style.opacity = '1'; }, 1000);
    skipBtn.onmouseenter = () => { skipBtn.style.color = 'rgba(255,255,255,0.7)'; };
    skipBtn.onmouseleave = () => { skipBtn.style.color = 'rgba(255,255,255,0.35)'; };

    const finish = (fast = false) => {
        if (done) return;
        done = true;
        cancelAnimationFrame(animId);
        mfyEl.style.opacity = '0';
        overlay.style.transition = `opacity ${fast ? 0.35 : 1.0}s ease`;
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, fast ? 350 : 1000);
    };
    skipBtn.onclick = () => finish(true);

    // ── Fallback (low FPS) ─────────────────────────────────────
    const doFallback = () => {
        cancelAnimationFrame(animId);
        canvas.style.display = 'none';
        const fb = document.createElement('div');
        fb.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2rem;';
        fb.innerHTML = `
            <span style="font-family:Sora,sans-serif;font-size:clamp(5rem,14vw,11rem);font-weight:800;color:white;letter-spacing:-0.06em;opacity:0;animation:fbIn 0.8s 0.4s ease forwards">nura.</span>
            <span style="font-family:Sora,sans-serif;font-size:clamp(1.2rem,2.8vw,2.2rem);font-weight:200;color:rgba(255,255,255,0.8);opacity:0;animation:fbIn 0.8s 2.2s ease forwards">Made for you.</span>
        `;
        const st = document.createElement('style');
        st.textContent = '@keyframes fbIn{to{opacity:1}}';
        document.head.appendChild(st);
        overlay.appendChild(fb);
        setTimeout(() => finish(false), 5200);
    };

    // ── Main loop ──────────────────────────────────────────────
    const loop = (ts) => {
        if (done) return;
        if (!startTime) startTime = ts;
        const e = ts - startTime;

        ctx.clearRect(0, 0, W, H);

        if (e < T.CONVERGE) {
            particles.forEach(p => { p.drift(); p.draw(); });
            drawLines(80, 0.10);

        } else if (e < T.HOLD) {
            const ce = e - T.CONVERGE;
            particles.forEach(p => { p.converge(ce); p.draw(); });
            drawLines(65, 0.13);

        } else if (e < T.SCATTER) {
            const he = e - T.HOLD;
            particles.forEach(p => { p.hold(he); p.draw(); });
            drawLines(50, 0.08);

        } else if (e < T.TRANS) {
            const se = e - T.SCATTER;
            particles.forEach(p => { p.scatter(se); p.draw(); });

            if (e >= T.MADEYOU && !mfyShown) {
                mfyShown = true;
                requestAnimationFrame(() => { mfyEl.style.opacity = '1'; });
            }
            if (e >= T.MADEYOU_OUT) {
                mfyEl.style.opacity = '0';
            }

        } else if (e < T.END) {
            if (!transitioning) {
                transitioning = true;
                mfyEl.style.opacity = '0';
            }
            // Shift overlay from pure black → dark amber
            const t = Math.min(1, (e - T.TRANS) / 1000);
            overlay.style.background = `rgb(${Math.round(12*t)},${Math.round(5*t)},0)`;

        } else {
            finish(false);
            return;
        }

        animId = requestAnimationFrame(loop);
    };

    // ── FPS check ──────────────────────────────────────────────
    let fpsFrames = 0, fpsChecked = false;
    const fpsCheck = (ts) => {
        fpsFrames++;
        if (ts > 600 && !fpsChecked) {
            fpsChecked = true;
            if ((fpsFrames / (ts / 1000)) < 24) { doFallback(); return; }
        }
        if (!fpsChecked) requestAnimationFrame(fpsCheck);
    };

    // ── Init ───────────────────────────────────────────────────
    const init = async () => {
        resize();
        window.addEventListener('resize', resize);
        await document.fonts.ready;

        const targets = getTargets();
        const total   = W < 768 ? 150 : 300;
        for (let i = 0; i < total; i++)
            particles.push(new Particle(i < targets.length ? targets[i] : null));

        requestAnimationFrame(fpsCheck);
        animId = requestAnimationFrame(loop);
    };

    init();
});
