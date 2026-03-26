/**
 * pillar-orbit.js — Pillar glass cards reveal
 * Staggered fade-in + scale-in when section enters viewport.
 * Border spin animations run via CSS @property --border-angle.
 */

document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.getElementById('pillarVisual');
    if (!wrap) return;

    const cards = wrap.querySelectorAll('.pc-wrap');

    const reveal = () => {
        cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 110);
        });
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                reveal();
                observer.disconnect();
            }
        });
    }, { threshold: 0.2 });

    observer.observe(wrap);
});
