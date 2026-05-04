document.addEventListener('DOMContentLoaded', () => {
    // Эффект появления элементов при скролле (Scroll Reveal)
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const observerOptions = {
        root: null, // viewport в качестве корневого элемента
        rootMargin: '0px',
        threshold: 0.1 // 10% элемента должны быть видны
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Прекращаем наблюдать после появления
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(el => {
        observer.observe(el);
    });

});