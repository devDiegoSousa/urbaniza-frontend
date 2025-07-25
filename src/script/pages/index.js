// Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar background change on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('bg-white', 'shadow-lg');
                navbar.classList.remove('glass');
            } else {
                navbar.classList.remove('bg-white', 'shadow-lg');
                navbar.classList.add('glass');
            }
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                }
            });
        }, observerOptions);

        // Observe all feature cards
        document.querySelectorAll('.group').forEach(card => {
            observer.observe(card);
        });

        // Counter animation for stats
        function animateCounter(element, target, duration = 2000) {
            const start = parseInt(element.textContent) || 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 16);
        }

        // Animate stats when they come into view
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statElements = entry.target.querySelectorAll('.text-4xl');
                    statElements.forEach((el, index) => {
                        const targets = [1200, 85, 48, 50];
                        setTimeout(() => {
                            animateCounter(el, targets[index]);
                        }, index * 200);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const statsSection = document.getElementById('stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        // Mobile menu toggle (if needed)
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }