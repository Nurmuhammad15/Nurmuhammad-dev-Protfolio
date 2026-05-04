document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.categories button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс к нажатой кнопке
            button.classList.add('active');

            const category = button.dataset.category;

            portfolioItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block'; // Показываем элемент
                } else {
                    item.style.display = 'none'; // Скрываем элемент
                }
            });
        });
    });

    // Опционально: Добавление анимации для элементов портфолио с задержкой
    // Этот код лучше разместить после основного кода фильтрации, чтобы элементы сначала были правильно показаны/скрыты.
    // Если элементов 195, то анимация может быть тяжелой. Можно использовать Intersection Observer API
    // для анимации только видимых элементов. Для простоты пока просто запуск при загрузке.
    const allPortfolioItems = document.querySelectorAll('.portfolio-item');
    allPortfolioItems.forEach((item, index) => {
        item.style.animationDelay = XXXINLINECODEXXX6XXXINLINECODEXXX; // Небольшая задержка для каждого элемента
    });
});