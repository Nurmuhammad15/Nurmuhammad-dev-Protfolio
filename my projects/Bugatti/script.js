document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const observerOptions = {
        root: null, // viewport as the root
        rootMargin: '0px',
        threshold: 0.15 // 15% of the element must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing after it's revealed
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(el => {
        observer.observe(el);
    });

    // Simple Parallax for Hero Section (optional, CSS background-attachment: fixed already does a basic one)
    // This JS could enhance it if needed, but for 'neat' and 'unusual' CSS-only is cleaner
    /*
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPositionY = XXXINLINECODEXXX2XXXINLINECODEXXX; // Adjust 0.2 for intensity
    });
    */
});