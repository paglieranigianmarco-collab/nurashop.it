document.addEventListener('DOMContentLoaded', () => {
    // ─── Header Scroll Effect ────────────────────────────────
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── Scroll Reveal (Apple-style staggered) ──────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
    });

    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── Apple-style Hero Parallax ──────────────────────────
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');

    if (heroSection && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            if (scrolled < heroHeight * 1.2) {
                const p = Math.min(1, scrolled / heroHeight);
                heroContent.style.transform = `translateY(${scrolled * 0.18}px)`;
                heroContent.style.opacity   = String(1 - p * 1.4);
            }
        }, { passive: true });
    }

    // ─── Scroll Progress Indicator ──────────────────────────
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // ─── Toast Notification System ───────────────────────────
    window.showToast = function(message, type = 'info', icon = null) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const iconHtml = icon ? `<i class="ph ${icon}"></i> ` : '';
        toast.innerHTML = iconHtml + message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-exit');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    };

    // ─── Mobile Navigation Drawer ────────────────────────────
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const drawerOverlay = document.getElementById('drawerOverlay');

    function openMobileNav() {
        if (!mobileNavDrawer) return;
        mobileNavDrawer.classList.add('open');
        if (drawerOverlay) {
            drawerOverlay.classList.add('open');
            drawerOverlay.style.zIndex = '10000';
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        if (!mobileNavDrawer) return;
        mobileNavDrawer.classList.remove('open');
        if (drawerOverlay) {
            drawerOverlay.classList.remove('open');
            drawerOverlay.style.zIndex = '';
        }
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileNav);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
    document.querySelectorAll('[data-close-mobile]').forEach(el => {
        el.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileNav();
    });

    // ─── Hero Email Form Handler ─────────────────────────────
    window.handleHeroEmail = function(e) {
        e.preventDefault();
        // Handled by inline script in index.html
    };
});
