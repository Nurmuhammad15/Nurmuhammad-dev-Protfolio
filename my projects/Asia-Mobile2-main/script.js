document.addEventListener('DOMContentLoaded', () => {
    // --- Инициализация AOS (Animate On Scroll) ---
    AOS.init({
        duration: 1000,      // Продолжительность анимации (в мс)
        easing: 'ease-out-quad', // Функция сглаживания анимации
        once: true,          // Анимировать только один раз при скролле вниз
        mirror: false,       // Анимировать при скролле вверх тоже
        offset: 120          // Запускать анимацию, когда элемент находится на 120px от нижней части окна
    });

    // --- DOM элементы ---
    const header = document.querySelector('.header');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.getElementById('cartCount');
    const cartModal = document.getElementById('cartModal');
    const closeCartModal = document.getElementById('closeCartModal');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn'); // Обновится динамически
    const checkoutButton = document.querySelector('.checkout-button');

    // --- Элементы пагинации товаров ---
    const productGrid = document.getElementById('productGrid');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfoSpan = document.getElementById('pageInfo');

    const PRODUCTS_PER_PAGE = 6;
    const TOTAL_PRODUCT_PAGES = 5;
    let currentPage = 0; // Текущая страница (0-индексированная)

    // --- Мастер-список всех продуктов ---
    // Добавьте сюда все свои продукты. Если их меньше, чем 6 * 5 = 30,
    // то продукты будут повторяться на разных страницах, что соответствует "рандомным".
    const allAvailableProducts = [
        { id: '1', name: 'Huawei P60 Pro', price: 13500000, image: 'images-Phones/smartfon_gsm_huawei_p60_pro_256gb_thx_667_48_5_black_271155_1a-removebg-preview.png', spec: '256GB 8GB' },
        { id: '2', name: 'Honor 400 Pro', price: 7500000, image: 'images-Phones/612X2vHrU5L-removebg-preview.png', spec: '512GB 16GB' },
        { id: '3', name: 'iPhone 15 Pro', price: 12000000, image: 'images-Phones/images__2_-removebg-preview.png', spec: '256GB 8GB' },
        { id: '4', name: 'Samsung S25 Ultra', price: 13000000, image: 'images-Phones/aohhsB2D94SUq8NXdRrqfR-1200-80-removebg-preview.png', spec: '512GB 12GB' },
        { id: '5', name: 'Xiaomi 14 Ultra', price: 11000000, image: 'images-Phones/612X2vHrU5L-removebg-preview.png', spec: '512GB 16GB' },
        { id: '6', name: 'OnePlus 12', price: 9000000, image: 'images-Phones/12-black-removebg-preview.png', spec: '256GB 12GB' },
        { id: '7', name: 'Google Pixel 8 Pro', price: 10500000, image: 'images-Phones/google-pixel-8-pro-1700128306-removebg-preview.png', spec: '256GB 12GB' },
        { id: '8', name: 'Sony Xperia 1 V', price: 9800000, image: 'images-Phones/380Wx380H-Default-WorkingFormat-508471-removebg-preview.png', spec: '256GB 12GB' },
        { id: '9', name: 'Asus ROG Phone 7', price: 8900000, image: 'images-Phones/asus-rog-phone-9-pro-fan-x-pro-16-1024gb-5g-fan-x-pro-black-global-1-removebg-preview.png', spec: '512GB 16GB' },
        { id: '10', name: 'Motorola Edge 40', price: 5500000, image: 'images-Phones/71hVkWzI8gL-removebg-preview.png', spec: '256GB 8GB' },
        // Добавьте больше продуктов, если хотите, чтобы было больше уникальных на страницах
    ];

    let pregeneratedProductPages = []; // Будет хранить 5 сгенерированных страниц продуктов

    // --- Мобильное меню (добавляем динамически) ---
    const mobileNav = document.createElement('div');
    mobileNav.classList.add('mobile-nav');
    const mainNavClone = mainNav.cloneNode(true);
    mobileNav.appendChild(mainNavClone);
    document.body.appendChild(mobileNav);

    // --- Логика корзины (localStorage) ---
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.classList.add('visible');
        } else {
            cartCount.classList.remove('visible');
        }
    }

    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartTotalPrice.textContent = '0';
            return;
        }
        emptyCartMessage.style.display = 'none';

        let total = 0;
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            total += item.price * item.quantity; // item.price уже число

            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Цена: ${item.price.toLocaleString('ru-RU')} UZS</p>
                    <p>Количество: ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <button class="remove-from-cart-btn" data-id="${item.id}">Удалить</button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
        cartTotalPrice.textContent = total.toLocaleString('ru-RU');

        document.querySelectorAll('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => updateCartItemQuantity(e.target.dataset.id, -1));
        });
        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => updateCartItemQuantity(e.target.dataset.id, 1));
        });
        document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => removeCartItem(e.target.dataset.id));
        });
    }

    function addToCart(productId, productName, productPriceText, productImage) {
        const priceValue = parseFloat(productPriceText.replace('NARXI: ', '').replace(' UZS', '').replace(/\s/g, ''));

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: priceValue,
                image: productImage,
                quantity: 1
            });
        }
        saveCart();
        updateCartCount();

        cartCount.classList.add('added-animation');
        setTimeout(() => {
            cartCount.classList.remove('added-animation');
        }, 500);
    }

    function updateCartItemQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            saveCart();
            renderCartItems();
            updateCartCount();
        }
    }

    function removeCartItem(productId) {
        if (confirm('Вы уверены, что хотите удалить этот товар из корзины?')) {
            cart = cart.filter(item => item.id !== productId);
            saveCart();
            renderCartItems();
            updateCartCount();
        }
    }

    // --- Логика пагинации товаров ---

    // Вспомогательная функция для перемешивания массива (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Функция для генерации 5 страниц случайных продуктов
    function generateProductPages() {
        pregeneratedProductPages = [];
        for (let i = 0; i < TOTAL_PRODUCT_PAGES; i++) {
            // Берем копию всех доступных продуктов, перемешиваем и берем PRODUCTS_PER_PAGE
            const shuffledProducts = shuffleArray([...allAvailableProducts]);
            const pageProducts = shuffledProducts.slice(0, PRODUCTS_PER_PAGE);
            pregeneratedProductPages.push(pageProducts);
        }
    }

    // Функция для отображения продуктов на текущей странице
    function renderProductPage(pageIndex) {
        productGrid.innerHTML = ''; // Очищаем сетку
        const productsToDisplay = pregeneratedProductPages[pageIndex];

        if (!productsToDisplay || productsToDisplay.length === 0) {
            productGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #888;">Нет товаров для отображения на этой странице.</p>';
            return;
        }

        productsToDisplay.forEach(product => {
            const productCardDiv = document.createElement('div');
            productCardDiv.classList.add('product-card');
            productCardDiv.dataset.productId = product.id;
            productCardDiv.dataset.productName = product.name;
            productCardDiv.dataset.productPrice = product.price; // Сохраняем числовое значение для удобства

            productCardDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.spec}</p>
                <p class="price">NARXI: ${product.price.toLocaleString('ru-RU')} UZS</p>
                <button class="add-to-cart-btn">Savatga</button>
            `;
            productGrid.appendChild(productCardDiv);
        });

        // После динамической вставки элементов, необходимо заново навесить слушатели
        // на кнопки "Добавить в корзину" для текущей страницы
        productGrid.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productCard = button.closest('.product-card');
                const productId = productCard.dataset.productId;
                const productName = productCard.dataset.productName;
                const productPriceText = productCard.querySelector('.price').textContent; // Снова получаем из DOM для парсинга
                const productImage = productCard.querySelector('img').src;

                addToCart(productId, productName, productPriceText, productImage);
            });
        });

        // Активируем AOS для новых элементов
        AOS.refresh();
    }

    // Функция для обновления состояния кнопок навигации и информации о странице
    function updatePaginationUI() {
        prevPageBtn.classList.toggle('disabled', currentPage === 0);
        nextPageBtn.classList.toggle('disabled', currentPage === TOTAL_PRODUCT_PAGES - 1);
        pageInfoSpan.textContent = `${currentPage + 1} / ${TOTAL_PRODUCT_PAGES}`;
    }

    // Переход к следующей странице
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < TOTAL_PRODUCT_PAGES - 1) {
            currentPage++;
            renderProductPage(currentPage);
            updatePaginationUI();
        }
    });

    // Переход к предыдущей странице
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            renderProductPage(currentPage);
            updatePaginationUI();
        }
    });


    // --- Общие обработчики событий ---

    // Открытие/закрытие модального окна корзины
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.add('active');
        renderCartItems();
    });

    closeCartModal.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Оформить заказ (симуляция)
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Ваша корзина пуста! Добавьте товары перед оформлением заказа.');
            return;
        }
        alert('Заказ успешно оформлен! (Это симуляция)');
        cart = [];
        saveCart();
        renderCartItems();
        updateCartCount();
        cartModal.classList.remove('active');
    });

    // Мобильное меню
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const activeMainNavLink = document.querySelector('.main-nav .nav-link.active');
        mobileNav.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (activeMainNavLink && link.getAttribute('href') === activeMainNavLink.getAttribute('href')) {
                link.classList.add('active');
            }
        });
    });

    // Закрытие мобильного меню при клике на ссылку или вне его
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            document.querySelector(`.main-nav a[href="${link.getAttribute('href')}"]`)?.classList.add('active');
        });
    });
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
             mobileNav.classList.remove('active');
        }
    });


    // Плавная прокрутка для навигации
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Эффект хедера при скролле и обновление активной ссылки
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        let currentSectionId = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - header.clientHeight - 100 && window.scrollY < sectionTop + sectionHeight - header.clientHeight - 100) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSectionId) && currentSectionId !== '') {
                link.classList.add('active');
            }
        });
    });


    // --- Инициализация при загрузке страницы ---
    updateCartCount();
    generateProductPages(); // Генерируем все страницы продуктов
    renderProductPage(currentPage); // Отображаем первую страницу
    updatePaginationUI(); // Обновляем UI пагинации
    AOS.refreshHard();

    if (window.scrollY <= 50) {
        document.querySelector('.main-nav .nav-link[href="#home"]').classList.add('active');
    }
});
Копировать
