document.addEventListener('DOMContentLoaded', () => {
    // DOM элементларини олиш
    const bookListView = document.getElementById('book-list-view');
    const bookGridView = bookListView.querySelector('.book-grid');
    const bookDetailView = document.getElementById('book-detail-view');
    const backButton = bookDetailView.querySelector('.back-button');
    const detailBookCover = bookDetailView.querySelector('.detail-book-cover');
    const detailTitle = bookDetailView.querySelector('.detail-title');
    const detailAuthor = bookDetailView.querySelector('.detail-author');
    const detailRating = bookDetailView.querySelector('.detail-rating');
    const detailPrice = bookDetailView.querySelector('.detail-price');
    const detailDescription = bookDetailView.querySelector('.detail-description');
    const addToCartBtn = bookDetailView.querySelector('.add-to-cart-btn');
    const cartCountSpan = document.querySelector('.cart-count');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas.getContext('2d');

    // Қидирув элементлари
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    let cartItemCount = 0;
    let activeBook = null; // Ҳозирги фаол китоб объектини сақлайди

    // Китоблар учун маълумотлар (dummy data)
    const dummyBooks = [
        {
            id: 'b1',
            title: 'Космик Саргузаштлар: Галактика Сари',
            author: 'Алимова Саодат',
            coverUrl: './assets/images/book_cover_1.jpg',
            description:
                'Инсоният тарихидаги энг катта саргузашт - коинот кенгликларини ўрганиш. Бу китоб сизни юлдузлараро саёҳатга олиб чиқади, сирли планеталар ва улардаги ҳаёт ҳақида ҳикоя қилади. Сизни яқин келажакдаги галактик империялар, қудратли технологиялар ва коинотнинг чуқур сирлари кутмоқда. Қадимги цивилизацияларнинг қолдиқлари ва янги турларнинг пайдо бўлиши ҳақидаги далиллар сизни ҳайратда қолдиради.',
            price: 15.99,
            rating: 4.8,
        },
        {
            id: 'b2',
            title: 'Ўтмиш Сирлари: Вақт Машинаси',
            author: 'Баҳром Аҳмедов',
            coverUrl: './assets/images/book_cover_2.jpg',
            description:
                'Қадимий цивилизациялар, унутилган халқлар ва тарихнинг энг қоронғу сирларини очишга уриниш. Вақт машинасида ўтмишга саёҳат қилиб, тақдирни ўзгартиришга уринган олимлар ҳақида ҳикоя. Улар ўтмишга таъсир қилишнинг аянчли оқибатларига дуч келишади ва вақт парадоксларининг мураккаб тўрига киришади. Тарихни қайта ёзиш ёки уни ўз ҳолича қолдириш муаммоси уларнинг олдида туради.',
            price: 12.50,
            rating: 4.5,
        },
        {
            id: 'b3',
            title: 'Келажак Шаҳри: Футуристик Дунё',
            author: 'Дилором Қодирова',
            coverUrl: './assets/images/book_cover_3.jpg',
            description:
                '22-аср дунёсига хуш келибсиз. Учувчи машиналар, роботлар ва сунъий интеллект инсоният ҳаётини қандай ўзгартирди? Бу китоб келажак шаҳарларининг гўзаллиги ва хавф-хатарларини тасвирлайди. Юқори технологияли жамиятнинг ахлоқий дилеммалари, инсон ва машина ўртасидаги чегаралар ва янги турдаги ижтимоий тузилмалар ҳақида мулоҳаза юритилади. Шаҳарлар осмонга бўй чўзиб, қуёш нурларини акс эттиради.',
            price: 18.25,
            rating: 4.9,
        },
        {
            id: 'b4',
            title: 'Магия Мактаби: Сирли Устоз',
            author: 'Элдор Исмоилов',
            coverUrl: './assets/images/book_cover_4.jpg',
            description:
                'Ёш сеҳргарлар мактабида ўқиш - бу нафақат сеҳр ўрганиш, балки дўстлик, садоқат ва қаҳрамонлик дарсларини олиш. Китоб қадимий ёвузликка қарши курашган ёш сеҳргарнинг ҳикояси. Уларнинг машаққатли саргузаштлари, сеҳрли жонзотлар билан учрашувлар ва унутилган афсунларни кашф этиш жараёни ҳар бир ўқувчини ўзига ром этади. Сирли устознинг йўл-йўриқлари ёш қаҳрамонга ўз кучларини тўлиқ англашга ёрдам беради.',
            price: 10.00,
            rating: 4.7,
        },
        {
            id: 'b5',
            title: 'Сукунат Қишлоғи',
            author: 'Зуҳра Ҳакимова',
            coverUrl: './assets/images/book_cover_1.jpg', // Такрорий муқова
            description:
                'Тоғлар орасидаги кичик, тинч қишлоқ. Лекин унинг сукунати ортида эски сирлар ва ғайриоддий воқеалар яширинган. Бир тадқиқотчининг бу қишлоққа келиши ҳаммасини ўзгартириб юборади. Қишлоқ аҳолисининг қадимий урф-одатлари, ноодатий анъаналари ва уларнинг асрлар давомида яшириб келган сирлари очила бошлайди. Сиз бу ерда мистик элементлар ва кутилмаган бурилишлар гувоҳи бўласиз.',
            price: 14.75,
            rating: 4.6,
        },
        {
            id: 'b6',
            title: 'Технология Революцияси',
            author: 'Умид Раҳимов',
            coverUrl: './assets/images/book_cover_2.jpg', // Такрорий муқова
            description:
                'Замонавий технологиялар дунёни қандай ўзгартирмоқда? Сунъий интеллектдан блокчейнгача, бу китоб инновациялар ва уларнинг жамиятга таъсири ҳақида кенг маълумот беради. Келажакдаги иқтисодиёт, ижтимоий ўзгаришлар ва инсониятнинг технологик ривожланиш йўлларини таҳлил қилади. Ҳар бир бўлим янги технологиянинг афзалликлари ва камчиликларини чуқур ёритиб беради.',
            price: 20.00,
            rating: 4.9,
        },
    ];

    // --- Анимация функциялари ---

    // Китоб рўйхати ва деталлари экранини алмаштириш
    function switchView(showList) {
        if (showList) {
            bookDetailView.classList.remove('active');
            // Деталлар элементларидаги анимация классларини ўчириш
            detailTitle.classList.remove('animate-in');
            detailAuthor.classList.remove('animate-in');
            detailRating.classList.remove('animate-in');
            detailPrice.classList.remove('animate-in');
            detailDescription.classList.remove('animate-in');
            addToCartBtn.classList.remove('animate-in');

            setTimeout(() => {
                bookListView.classList.add('active');
            }, 500); // Деталлар экрани ёпилгандан сўнг рўйхатни кўрсатиш учун кечикиш
        } else {
            bookListView.classList.remove('active');
            setTimeout(() => {
                bookDetailView.classList.add('active');
                // Деталлар элементлари учун кириш анимацияларини ишга тушириш
                // Бунда CSS transition-delay орқали кечикишлар бошқарилади
                // detailImageIn анимациясини тўғрилаш
                const detailImageWrapper = detailBookCover.closest('.detail-image-wrapper');
                detailImageWrapper.style.animation = 'none'; // Эски анимацияни ўчириш
                void detailImageWrapper.offsetWidth; // Анимацияни қайта ишга тушириш учун DOM reflow
                detailImageWrapper.style.animation = 'detailImageIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

                setTimeout(() => detailTitle.classList.add('animate-in'), 200);
                setTimeout(() => detailAuthor.classList.add('animate-in'), 300);
                setTimeout(() => detailRating.classList.add('animate-in'), 400);
                setTimeout(() => detailPrice.classList.add('animate-in'), 500);
                setTimeout(() => detailDescription.classList.add('animate-in'), 600);
                setTimeout(() => addToCartBtn.classList.add('animate-in'), 700);

            }, 500); // Рўйхат экрани ёпилгандан сўнг деталларни кўрсатиш учун кечикиш
        }
    }

    // --- Китоб карточкаларини рендер қилиш ---
    function renderBooks(booksToRender = dummyBooks) {
        bookGridView.innerHTML = ''; // Эски карточкаларни тозалаш
        if (booksToRender.length === 0) {
            bookGridView.innerHTML = '<p style="text-align: center; font-size: 1.5rem; color: rgba(255,255,255,0.7);">Китоблар топилмади 😔</p>';
            return;
        }

        booksToRender.forEach((book, index) => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('book-card');
            bookCard.dataset.id = book.id;

            // Кириш анимациясини кечиктириш
            bookCard.style.animationDelay = XXXINLINECODEXXX4XXXINLINECODEXXX;

            bookCard.innerHTML = `
                <img src="${book.coverUrl}" alt="${book.title} муқоваси" class="book-card-image">
                <div class="book-card-content">
                    <h3 class="book-card-title">${book.title}</h3>
                    <p class="book-card-author">${book.author}</p>
                    <p class="book-card-price">\$${book.price.toFixed(2)}</p>
                    <div class="book-card-rating">
                        ${generateStars(book.rating)}
                    </div>
                </div>
            `;
            bookGridView.appendChild(bookCard);

            // Карточка босилганда деталлар экранига ўтиш
            bookCard.addEventListener('click', () => showBookDetail(book.id));
        });
    }

    // Юлдузчаларни ҳосил қилиш
    function generateStars(rating) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                starsHtml += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 === rating) {
                starsHtml += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHtml += '<i class="far fa-star"></i>';
            }
        }
        return starsHtml;
    }

    // --- Китоб деталларини кўрсатиш ---
    function showBookDetail(bookId) {
        const book = dummyBooks.find(b => b.id === bookId);
        if (!book) return;

        activeBook = book; // Жорий китобни сақлаш

        detailBookCover.src = book.coverUrl;
        detailBookCover.alt = XXXINLINECODEXXX5XXXINLINECODEXXX;
        detailTitle.textContent = book.title;
        detailAuthor.textContent = book.author;
        detailRating.innerHTML = generateStars(book.rating);
        detailPrice.textContent = XXXINLINECODEXXX6XXXINLINECODEXXX;
        detailDescription.textContent = book.description;

        switchView(false); // Деталлар экранига ўтиш
    }

    // --- Саватга қўшиш функцияси ---
    addToCartBtn.addEventListener('click', () => {
        if (activeBook) {
            cartItemCount++;
            cartCountSpan.textContent = cartItemCount;

            // "Саватга қўшиш" тугмасининг анимацияси
            addToCartBtn.classList.add('add-animation');
            setTimeout(() => {
                addToCartBtn.classList.remove('add-animation');
            }, 300); // Анимация давомийлигига мос

            // Конфетти эффектини ишга тушириш
            triggerConfetti();

            // Хабар кўрсатиш (масалан, тост хабар)
            const message = document.createElement('div');
            message.classList.add('toast-message');
            message.textContent = XXXINLINECODEXXX7XXXINLINECODEXXX;
            document.body.appendChild(message);
            setTimeout(() => {
                message.classList.add('show');
            }, 10);
            setTimeout(() => {
                message.classList.remove('show');
                message.classList.add('hide');
                message.addEventListener('transitionend', () => message.remove());
            }, 2500);
        }
    });

    // Toast хабар учун стиллар (динамик қўшилади ёки CSSга ёзилади)
    const style = document.createElement('style');
    style.textContent = `
        .toast-message {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: #28a745; /* Green */
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.2rem;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Elastic effect */
            z-index: 10000;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }
        .toast-message.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        .toast-message.hide {
            opacity: 0;
            transform: translateX(-50%) translateY(100px);
        }
        .add-to-cart-btn.add-animation {
            animation: bounceScale 0.3s ease-out;
        }
        @keyframes bounceScale {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // --- Қидирув функцияси ---
    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filtered = dummyBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
        renderBooks(filtered);
    }

    // --- Конфетти анимацияси ---
    let particles = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'];

    function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    function ConfettiParticle(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4; // 4-12px
        this.color = color;
        this.velocity = {
            x: Math.random() * 6 - 3, // -3 to 3
            y: Math.random() * -10 - 5 // -15 to -5 (upwards)
        };
        this.alpha = 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5; // -5 to 5
    }

    ConfettiParticle.prototype.draw = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    };

    ConfettiParticle.prototype.update = function() {
        this.velocity.y += 0.3; // Gravity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01; // Fade out
        this.rotation += this.rotationSpeed;
    };

    function animateConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].alpha <= 0.1 || particles[i].y > confettiCanvas.height) {
                particles.splice(i, 1);
            }
        }

        if (particles.length > 0) {
            requestAnimationFrame(animateConfetti);
        }
    }

    function triggerConfetti() {
        const buttonRect = addToCartBtn.getBoundingClientRect();
        const centerX = buttonRect.left + buttonRect.width / 2;
        const centerY = buttonRect.top + buttonRect.height / 2;

        for (let i = 0; i < 50; i++) {
            particles.push(new ConfettiParticle(
                centerX,
                centerY,
                colors[Math.floor(Math.random() * colors.length)]
            ));
        }
        animateConfetti(); // Анимацияни ишга тушириш
    }

    // --- Event Listeners ---
    backButton.addEventListener('click', () => switchView(true));
    window.addEventListener('resize', resizeConfettiCanvas);
    searchInput.addEventListener('input', filterBooks); // Қидирув майдончасига ёзилганда қидириш
    searchButton.addEventListener('click', filterBooks); // Қидириш тугмаси босилганда қидириш


    // --- Иловани инициализация қилиш ---
    resizeConfettiCanvas(); // Конфетти canvas ўлчамларини созлаш
    renderBooks(); // Китобларни рендер қилиш
    switchView(true); // Бошланғичда китоблар рўйхатини кўрсатиш
});

// Китоблар учун маълумотлар (dummy data)
    const dummyBooks = [
        {
            id: 'b1',
            title: 'Космик Саргузаштлар: Галактика Сари',
            author: 'Алимова Саодат',
            coverUrl: './assets/images/book_cover_1.jpg',
            description:
                'Инсоният тарихидаги энг катта саргузашт - коинот кенгликларини ўрганиш. Бу китоб сизни юлдузлараро саёҳатга олиб чиқади, сирли планеталар ва улардаги ҳаёт ҳақида ҳикоя қилади. Сизни яқин келажакдаги галактик империялар, қудратли технологиялар ва коинотнинг чуқур сирлари кутмоқда. Қадимги цивилизацияларнинг қолдиқлари ва янги турларнинг пайдо бўлиши ҳақидаги далиллар сизни ҳайратда қолдиради.',
            price: 15.99,
            rating: 4.8,
        },
        // Бошқа китоблар шу ерда давом этади...
        {
            id: 'b2',
            title: 'Ўтмиш Сирлари: Вақт Машинаси',
            author: 'Баҳром Аҳмедов',
            coverUrl: './assets/images/book_cover_2.jpg',
            description:
                '...',
            price: 12.50,
            rating: 4.5,
        },
        // ва ҳоказо.
    ];