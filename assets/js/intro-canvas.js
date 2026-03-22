/**
 * intro-canvas.js
 * "we are nura" — cinematic intro with amber particle network
 * Text animation is handled by CSS; canvas renders the particle background.
 */

document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('simple-intro');
    if (!introOverlay) return;

    document.body.style.overflow = 'hidden';

    const canvas = document.getElementById('intro-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, animId;
    let particles = [];

    // Warm amber color palette from image
    const colors = [
        'rgba(200, 80, 16, 0.75)',
        'rgba(232, 128, 48, 0.55)',
        'rgba(200, 144, 64, 0.45)',
        'rgba(245, 160, 80, 0.35)',
        'rgba(245, 237, 224, 0.18)',
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.32;
            this.vy = (Math.random() - 0.5) * 0.32;
            this.r  = Math.random() * 2.2 + 0.4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width)  this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const init = () => {
        resize();
        window.addEventListener('resize', resize);
        const count = window.innerWidth < 768 ? 45 : 90;
        for (let i = 0; i < count; i++) particles.push(new Particle());
        animate();
    };

    const resize = () => {
        width  = window.innerWidth;
        height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width  = width  * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width  = width  + 'px';
        canvas.style.height = height + 'px';
    };

    const drawLines = () => {
        const maxDist = 145;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < maxDist) {
                    const op = (1 - d / maxDist) * 0.2;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(200, 96, 32, ${op})`;
                    ctx.lineWidth   = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        animId = requestAnimationFrame(animate);
    };

    init();

    // Fade out after 3.4s (CSS text animations finish around ~2.5s)
    setTimeout(() => {
        introOverlay.classList.add('hide-intro');
        setTimeout(() => {
            introOverlay.style.display = 'none';
            document.body.style.overflow = '';
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        }, 1200);
    }, 3400);
});
