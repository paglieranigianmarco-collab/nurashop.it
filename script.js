document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80; // Height of the fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Featured Products Slider
    const slider = document.querySelector('.featured-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider && prevBtn && nextBtn) {
        // Calculate the width of one card + gap to scroll by
        const getScrollAmount = () => {
            const card = slider.querySelector('.product-card');
            if (!card) return 0;
            const style = window.getComputedStyle(slider);
            const gap = parseInt(style.getPropertyValue('gap')) || 0;
            return card.offsetWidth + gap;
        };

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });
    }

    // Interactive Button FX
    const primaryBtns = document.querySelectorAll('.btn-primary');
    primaryBtns.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(2px) scale(0.98)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-2px) scale(1)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .category-card, .product-card');

    // Add default reveal class to cards if not present
    document.querySelectorAll('.category-card, .product-card').forEach((el, index) => {
        if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-fade')) {
            el.classList.add('reveal-up');
            // Stagger delay based on index for grid items
            el.style.transitionDelay = `${(index % 4) * 100}ms`;
        }
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });
});
