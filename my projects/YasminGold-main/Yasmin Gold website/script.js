document.addEventListener('DOMContentLoaded', function() {
    // ============= Menu Toggle Functionality =============
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // ============= Background Sparkles Effect =============
    const sparklesContainer = document.getElementById('sparkles');
    const sparklesCount = 15;
    
    for (let i = 0; i < sparklesCount; i++) {
        createSparkle();
    }
    
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size
        const size = 50 + Math.random() * 100;
        
        // Random delay
        const delay = Math.random() * 7;
        
        sparkle.style.left = `${posX}%`;
        sparkle.style.top = `${posY}%`;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.animationDelay = `${delay}s`;
        
        sparklesContainer.appendChild(sparkle);
        
        // Remove and recreate sparkle after animation
        setTimeout(() => {
            sparkle.remove();
            createSparkle();
        }, 7000 + delay * 1000);
    }

    // ============= Smooth Scrolling =============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============= Modal Functionality =============
    // Creating modal element
    const modalHTML = `
        <div class="modal" id="orderModal">
            <div class="modal-content">
                <button class="close-modal" id="closeModal">&times;</button>
                <h2 class="modal-title">Оформление заказа</h2>
                <form class="modal-form" id="orderForm">
                    <input type="hidden" id="productName" name="productName">
                    <label for="name">Ваше имя</label>
                    <input type="text" id="name" name="name" required>
                    
                    <label for="phone">Телефон</label>
                    <input type="tel" id="phone" name="phone" required>
                    
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                    
                    <label for="message">Дополнительная информация</label>
                    <textarea id="message" name="message" rows="4"></textarea>
                    
                    <button type="submit" class="btn submit-btn">Отправить заказ</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('orderModal');
    const closeModal = document.getElementById('closeModal');
    const productNameInput = document.getElementById('productName');
    const orderForm = document.getElementById('orderForm');
    
    // Buy buttons event listeners
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            productNameInput.value = productName;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Form submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        
        if (!name || !phone || !email) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }
        
        // Success animation
        this.innerHTML = '<div class="success-message">Спасибо за заказ! Мы свяжемся с вами в ближайшее время.</div>';
        
        // Close modal after delay
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form after it's hidden
            setTimeout(() => {
                orderForm.reset();
                orderForm.innerHTML = `
                    <input type="hidden" id="productName" name="productName">
                    <label for="name">Ваше имя</label>
                    <input type="text" id="name" name="name" required>
                    
                    <label for="phone">Телефон</label>
                    <input type="tel" id="phone" name="phone" required>
                    
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                    
                    <label for="message">Дополнительная информация</label>
                    <textarea id="message" name="message" rows="4"></textarea>
                    
                    <button type="submit" class="btn submit-btn">Отправить заказ</button>
                `;
            }, 500);
        }, 2000);
    });

    // ============= Scroll Animation =============
    const fadeElements = document.querySelectorAll('.category-card, .about-img, .about-content');
    
    const fadeInOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.style.opacity = "0";
            entry.target.style.transform = "translateY(50px)";
            
            setTimeout(() => {
                entry.target.style.transition = "opacity 0.5s ease, transform 0.7s ease";
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }, 100);
            
            fadeInObserver.unobserve(entry.target);
        });
    }, fadeInOptions);
    
    fadeElements.forEach(element => {
        element.style.opacity = "0";
        fadeInObserver.observe(element);
    });

    // ============= Parallax Effect =============
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
        
        // Parallax effect for about section
        const about = document.querySelector('.about');
        if (about) {
            about.style.backgroundPositionY = `${-scrollPosition * 0.2}px`;
        }
    });

    // ============= Image Hover Effect =============
    const categoryImages = document.querySelectorAll('.category-img');
    
    categoryImages.forEach(img => {
        img.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.5s ease';
        });
        
        img.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ============= Numbers Animation =============
    const stats = document.querySelectorAll('.stat-number');
    
    const statsOptions = {
        threshold: 0.7
    };
    
    const statsObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            const target = entry.target;
            const targetValue = parseInt(target.textContent);
            const unit = target.textContent.replace(/[0-9]/g, '');
            let count = 0;
            
            const updateCount = () => {
                const increment = Math.ceil(targetValue / 60);
                
                if (count < targetValue) {
                    count += increment;
                    if (count > targetValue) count = targetValue;
                    target.textContent = count + unit;
                    setTimeout(updateCount, 30);
                }
            };
            
            updateCount();
            observer.unobserve(target);
        });
    }, statsOptions);
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ============= Header Scroll Effect =============
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(7, 7, 9, 0.95)';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            header.style.padding = '15px 0';
        } else {
            header.style.background = 'transparent';
            header.style.boxShadow = 'none';
            header.style.padding = '25px 0';
        }
    });

    // ============= Custom Cursor Effect =============
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // Add style for custom cursor
    const cursorStyle = document.createElement('style');
    cursorStyle.innerHTML = `
        .custom-cursor {
            position: fixed;
            width: 30px;
            height: 30px;
            border: 1px solid var(--gold-primary);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9999;
            transition: width 0.3s, height 0.3s, border-color 0.3s;
        }
        
        .custom-cursor::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 5px;
            height: 5px;
            background-color: var(--gold-primary);
            border-radius: 50%;
        }
        
        .custom-cursor.active {
            width: 50px;
            height: 50px;
            border-color: var(--gold-light);
        }
        
        /* Hide cursor on certain elements */
        a, button, .buy-btn, .social-icon {
            cursor: none;
        }
    `;
    document.head.appendChild(cursorStyle);

    // Track cursor movement
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Cursor effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .category-card, .social-icon');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('active');
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('active');
        });
    });

    // Hide default cursor
    document.body.style.cursor = 'none';
});