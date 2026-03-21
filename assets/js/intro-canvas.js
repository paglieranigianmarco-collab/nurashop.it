/**
 * intro-canvas.js
 * 
 * Creates a premium, cellular/neural network-inspired particle system for the NURA intro.
 * It dynamically connects nearby particles to form a slow-moving, organic web.
 */

document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('simple-intro');
    if (!introOverlay) return;

    // Prevent scrolling during intro
    document.body.style.overflow = 'hidden';

    const canvas = document.getElementById('intro-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, animationFrameId;
    let particles = [];

    // Configuration
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const maxDistance = 150; // Distance at which lines begin to draw

    // Premium NURA colors (earthy/wellness tones)
    const colors = [
        'rgba(193, 168, 132, 0.7)', // warm gold/earth
        'rgba(134, 166, 132, 0.7)', // sage green
        'rgba(210, 185, 140, 0.7)', // light sand
        'rgba(255, 255, 255, 0.6)'  // soft white
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Very slow, organic movement
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Softly bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const init = () => {
        resize();
        window.addEventListener('resize', resize);

        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        animate();
    };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    };

    const drawLines = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    // Opacity gets stronger the closer they are
                    const opacity = 1 - (distance / maxDistance);
                    // Match the color to the first particle, lowering opacity
                    ctx.beginPath();
                    ctx.strokeStyle = particles[i].color.replace('0.7)', `${opacity * 0.3})`).replace('0.6)', `${opacity * 0.2})`);
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
        // Clear frame with a slight trailing effect for softness
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawLines();
        animationFrameId = requestAnimationFrame(animate);
    };

    init();

    // Intro Fade Out Logic
    // Allow animation to play for 2.5 seconds, then fade out
    setTimeout(() => {
        introOverlay.classList.add('hide-intro');

        // After CSS transition finishes, cleanup
        setTimeout(() => {
            introOverlay.style.display = 'none';
            document.body.style.overflow = '';
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        }, 1200); // 1.2s to match new CSS transition
    }, 2500); // Hold for 2.5s
});
