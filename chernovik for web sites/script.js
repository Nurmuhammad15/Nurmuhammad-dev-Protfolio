// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Плавный скролл для навигационных ссылок
    document.querySelectorAll('a.nav-link, a[href="#home"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });

            // Закрыть мобильное меню после клика, если оно открыто
            if (window.innerWidth <= 768) {
                const nav = document.querySelector('.nav');
                const hamburger = document.querySelector('.hamburger');
                nav.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Логика для гамбургер-меню (мобильная версия)
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Для предотвращения скролла фона
        });
    }

    // Закрыть мобильное меню при клике вне его
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && nav.classList.contains('active')) {
            const isClickInsideNav = nav.contains(event.target) || hamburger.contains(event.target);
            if (!isClickInsideNav) {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }
    });

    // Изменение фона хедера при скролле
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Если проскроллили более 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Наблюдатель для эффекта появления элементов при скролле (Intersection Observer)
    const animatedSections = document.querySelectorAll('.animated-section');

    const observerOptions = {
        root: null, // Наблюдаем относительно viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% элемента должно быть видимо
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Если секция содержит элементы с задержкой, запускаем их анимацию
                const delayedElements = entry.target.querySelectorAll('[style*="animation-delay"]');
                delayedElements.forEach(el => {
                    el.style.opacity = '1'; // Устанавливаем opacity, т.к. animate не всегда это делает
                    el.style.transform = 'translateY(0)'; // Устанавливаем transform
                });
                observer.unobserve(entry.target); // Остановить наблюдение после появления
            }
        });
    }, observerOptions);

    animatedSections.forEach(section => {
        observer.observe(section);
    });

});