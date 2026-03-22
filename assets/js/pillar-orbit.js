/**
 * pillar-orbit.js
 * Canvas-based orbit animation for the 4 longevity pillars.
 * 4 nodes orbit a central "n." core at varying radii and speeds.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pillars-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, animId, started = false;
    let time = 0;

    const PILLARS = [
        { label: 'SONNO',     angle: 0,              radius: 105, speed:  0.38, color: '#8B7CE8', size: 8 },
        { label: 'ENERGIA',   angle: Math.PI * 0.5,  radius: 145, speed: -0.26, color: '#E88040', size: 9 },
        { label: 'FOCUS',     angle: Math.PI,        radius: 125, speed:  0.31, color: '#4AA8D4', size: 8 },
        { label: 'LONGEVITÀ', angle: Math.PI * 1.5,  radius: 165, speed: -0.18, color: '#3CB870', size: 10 },
    ];

    const resize = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        W = rect.width  || 480;
        H = rect.height || 480;
        const dpr = window.devicePixelRatio || 1;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
    };

    const drawOrbitRing = (cx, cy, r, opacity) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 80, 16, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
    };

    const drawCenter = (cx, cy) => {
        // Glow halo
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 42);
        glow.addColorStop(0, 'rgba(232, 128, 48, 0.22)');
        glow.addColorStop(1, 'rgba(200, 80, 16, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 42, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core circle
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 80, 16, 0.18)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(245, 160, 80, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Center label
        ctx.font = '800 15px Sora, sans-serif';
        ctx.fillStyle = 'rgba(245, 237, 224, 0.9)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('n.', cx, cy);
    };

    const drawPillar = (cx, cy, pillar, t) => {
        const angle = pillar.angle + t * pillar.speed;
        const px = cx + Math.cos(angle) * pillar.radius;
        const py = cy + Math.sin(angle) * pillar.radius;

        // Connection line from center
        const lineGrad = ctx.createLinearGradient(cx, cy, px, py);
        lineGrad.addColorStop(0, 'rgba(200, 80, 16, 0.0)');
        lineGrad.addColorStop(0.4, 'rgba(200, 80, 16, 0.08)');
        lineGrad.addColorStop(1, `${pillar.color}30`);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Node glow
        const nodeGlow = ctx.createRadialGradient(px, py, 0, px, py, pillar.size * 3.5);
        nodeGlow.addColorStop(0, pillar.color + '30');
        nodeGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(px, py, pillar.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = nodeGlow;
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(px, py, pillar.size, 0, Math.PI * 2);
        ctx.fillStyle = pillar.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(245, 237, 224, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label — always outward from center
        const labelDist = pillar.radius + pillar.size + 16;
        const lx = cx + Math.cos(angle) * labelDist;
        const ly = cy + Math.sin(angle) * labelDist;

        ctx.font = '700 8.5px DM Sans, sans-serif';
        ctx.fillStyle = 'rgba(245, 237, 224, 0.65)';
        ctx.letterSpacing = '0.1em';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pillar.label, lx, ly);
        ctx.letterSpacing = '0';
    };

    const render = () => {
        ctx.clearRect(0, 0, W, H);
        time += 0.008;

        const cx = W / 2;
        const cy = H / 2;

        // Orbit rings
        [105, 125, 145, 165].forEach((r, i) => {
            drawOrbitRing(cx, cy, r, 0.07 + i * 0.025);
        });

        // Center
        drawCenter(cx, cy);

        // Pillars
        PILLARS.forEach(p => drawPillar(cx, cy, p, time));

        animId = requestAnimationFrame(render);
    };

    const start = () => {
        if (started) return;
        started = true;
        resize();
        window.addEventListener('resize', resize);
        render();
    };

    const stop = () => {
        cancelAnimationFrame(animId);
        animId = null;
        started = false;
    };

    // Only animate when visible
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) start();
            else stop();
        });
    }, { threshold: 0.1 });

    observer.observe(canvas);
});
