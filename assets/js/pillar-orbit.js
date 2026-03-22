/**
 * pillar-orbit.js — Pill badge scroll reveal
 * Replaces canvas orbit with HTML pill badges + SVG connecting lines.
 * Triggered by IntersectionObserver when the section enters viewport.
 */

document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.getElementById('pillarVisual');
    if (!wrap) return;

    const pills = wrap.querySelectorAll('.pillar-pill');
    const svg   = document.getElementById('pillarLinesSvg');
    const lines = svg ? svg.querySelectorAll('line') : [];

    // Hardcoded percentage endpoints matching CSS absolute positions:
    // [0]=Sonno(top-center), [1]=Energia(right), [2]=Longevità(bottom), [3]=Focus(left)
    const endpoints = [
        { x: '50%', y: '13%' },
        { x: '91%', y: '50%' },
        { x: '50%', y: '87%' },
        { x: '9%',  y: '50%' },
    ];

    // Set SVG line coordinates (center → pill)
    const initLines = () => {
        lines.forEach((line, i) => {
            if (!endpoints[i]) return;
            line.setAttribute('x1', '50%');
            line.setAttribute('y1', '50%');
            line.setAttribute('x2', endpoints[i].x);
            line.setAttribute('y2', endpoints[i].y);
        });
    };

    const reveal = () => {
        initLines();
        // Stagger pill entrance
        pills.forEach((pill, i) => {
            setTimeout(() => pill.classList.add('visible'), i * 160);
        });
        // Lines appear after first pill
        if (svg) setTimeout(() => svg.classList.add('visible'), 80);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                reveal();
                observer.disconnect();
            }
        });
    }, { threshold: 0.25 });

    observer.observe(wrap);
});
