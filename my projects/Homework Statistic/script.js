let currentUserType = 'student';
let currentUser = null;

// Создание 10 групп по 25 учеников
const groups = [];
for (let g = 1; g <= 10; g++) {
    const students = [];
    for (let s = 1; s <= 25; s++) {
        students.push({
            id: `g${g}-s${s}`,
            name: `Ученик ${s}`,
            login: `student${g}_${s}`,
            password: `pass${s}`,
            group: g,
            totalFine: 0,
            discount: 0,
            lateCount: 0,
            missedHomework: 0
        });
    }
    groups.push({
        id: g,
        name: `Группа ${g}`,
        students: students
    });
}

// Загрузка данных из localStorage
function loadData() {
    const saved = localStorage.getItem('homeworkData');
    if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach((savedGroup, i) => {
            if (groups[i]) {
                groups[i].students = savedGroup.students;
            }
        });
    }
}

// Сохранение данных в localStorage
function saveData() {
    localStorage.setItem('homeworkData', JSON.stringify(groups));
}

// Инициализация при загрузке
loadData();

// Выбор типа пользователя
function selectUserType(type) {
    currentUserType = type;
    const btns = document.querySelectorAll('.user-type-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('errorMessage').style.display = 'none';
}

// Обработка входа
function handleLogin() {
    const login = document.getElementById('loginInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    const errorMsg = document.getElementById('errorMessage');

    if (!login || !password) {
        errorMsg.textContent = '⚠️ Заполните все поля!';
        errorMsg.style.display = 'block';
        return;
    }

    if (currentUserType === 'teacher') {
        if (login === 'resultTeacher' && password === '__123456789__') {
            showTeacherPanel();
        } else {
            errorMsg.textContent = '❌ Неверный логин или пароль!';
            errorMsg.style.display = 'block';
        }
    } else {
        let found = false;
        for (const group of groups) {
            const student = group.students.find(s => s.login === login && s.password === password);
            if (student) {
                currentUser = student;
                showStudentPage(student);
                found = true;
                break;
            }
        }
        if (!found) {
            errorMsg.textContent = '❌ Неверный логин или пароль!';
            errorMsg.style.display = 'block';
        }
    }
}

// Показать панель учителя
function showTeacherPanel() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('teacherPanel').style.display = 'block';
    renderGroups();
}

// Показать страницу ученика
function showStudentPage(student) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('studentPage').style.display = 'block';
    document.getElementById('studentNameDisplay').textContent = student.name;
    
    document.getElementById('studentInfo').innerHTML = `
        <div class="info-row">
            <span class="info-label">🎓 Группа:</span>
            <span class="info-value">Группа ${student.group}</span>
        </div>
        <div class="info-row">
            <span class="info-label">👤 Логин:</span>
            <span class="info-value">${student.login}</span>
        </div>
        <div class="info-row">
            <span class="info-label">⏰ Опозданий:</span>
            <span class="info-value">${student.lateCount}</span>
        </div>
        <div class="info-row">
            <span class="info-label">❌ Пропущено ДЗ:</span>
            <span class="info-value">${student.missedHomework}</span>
        </div>
        <div class="info-row">
            <span class="info-label">💰 Штраф:</span>
            <span class="info-value fine">${student.totalFine.toLocaleString()} сум</span>
        </div>
        <div class="info-row">
            <span class="info-label">🎁 Скидка:</span>
            <span class="info-value discount">${student.discount.toLocaleString()} сум</span>
        </div>
    `;
}

// Рендер групп
function renderGroups() {
    const container = document.getElementById('groupsContainer');
    container.innerHTML = groups.map(group => `
        <div class="group-card">
            <div class="group-header" onclick="toggleGroup(${group.id})">
                <span class="group-name">📖 ${group.name}</span>
                <span>▼</span>
            </div>
            <div class="students-list" id="students-${group.id}">
                ${group.students.map(student => renderStudent(student)).join('')}
            </div>
        </div>
    `).join('');
}

// Рендер ученика
function renderStudent(student) {
    return `
        <div class="student-card">
            <div class="student-header">
                <span class="student-name">${student.name}</span>
                <span style="color: #868e96;">${student.login}</span>
            </div>
            <div class="student-stats">
                <div class="stat-item">
                    <div class="stat-label">💰 Штраф</div>
                    <div class="stat-value fine">${student.totalFine.toLocaleString()}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">🎁 Скидка</div>
                    <div class="stat-value discount">${student.discount.toLocaleString()}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">⏰ Опоздания</div>
                    <div class="stat-value">${student.lateCount}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">❌ Пропущено</div>
                    <div class="stat-value">${student.missedHomework}</div>
                </div>
            </div>
            <div class="action-buttons">
                <button class="action-btn btn-late" onclick="addLateFine('${student.id}')">
                    ⏰ Опоздание +5,000
                </button>
                <button class="action-btn btn-homework" onclick="addHomeworkFine('${student.id}')">
                    ❌ Не сделал ДЗ +10,000
                </button>
                <button class="action-btn btn-discount" onclick="addDiscount('${student.id}')">
                    🎁 Дать скидку
                </button>
                <button class="action-btn btn-reset" onclick="resetStudent('${student.id}')">
                    🔄 Сбросить месяц
                </button>
            </div>
        </div>
    `;
}

// Переключение отображения группы
function toggleGroup(groupId) {
    const list = document.getElementById(`students-${groupId}`);
    list.classList.toggle('active');
}

// Добавить штраф за опоздание
function addLateFine(studentId) {
    for (const group of groups) {
        const student = group.students.find(s => s.id === studentId);
        if (student) {
            student.totalFine += 5000;
            student.lateCount++;
            saveData();
            renderGroups();
            break;
        }
    }
}

// Добавить штраф за домашнее задание
function addHomeworkFine(studentId) {
    for (const group of groups) {
        const student = group.students.find(s => s.id === studentId);
        if (student) {
            student.totalFine += 10000;
            student.missedHomework++;
            saveData();
            renderGroups();
            break;
        }
    }
}

// Добавить скидку
function addDiscount(studentId) {
    const amount = prompt('💰 Введите сумму скидки (сум):');
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
        for (const group of groups) {
            const student = group.students.find(s => s.id === studentId);
            if (student) {
                student.discount += parseInt(amount);
                saveData();
                renderGroups();
                alert(`✅ Скидка ${parseInt(amount).toLocaleString()} сум добавлена!`);
                break;
            }
        }
    }
}

// Сброс данных ученика
function resetStudent(studentId) {
    if (confirm('🔄 Сбросить все данные ученика за месяц?')) {
        for (const group of groups) {
            const student = group.students.find(s => s.id === studentId);
            if (student) {
                student.totalFine = 0;
                student.discount = 0;
                student.lateCount = 0;
                student.missedHomework = 0;
                saveData();
                renderGroups();
                alert('✅ Данные ученика сброшены!');
                break;
            }
        }
    }
}

// Выход
function logout() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('teacherPanel').style.display = 'none';
    document.getElementById('studentPage').style.display = 'none';
    document.getElementById('loginInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMessage').style.display = 'none';
    currentUser = null;
}

// Enter для входа
document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleLogin();
    }
});

document.getElementById('loginInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('passwordInput').focus();
    }
});
```

---

// ## 📁 Структура проекта

// ```
// homework-statistic/
// │
// ├── index.html
// ├── style.css
// └── script.js


// ## 🚀 Инструкция по использованию

// 1. Создайте папку `homework-statistic`
// 2. Создайте 3 файла: `index.html`, `style.css`, `script.js`
// 3. Скопируйте соответствующий код в каждый файл
// 4. Откройте `index.html` в браузере

// ## 🔑 Тестовые данные

// **Учитель:**
// - Логин: `resultTeacher`
// - Пароль: `__123456789__`

// **Ученики:**
// - Логин: `student1_1` до `student10_25`
// - Пароль: `pass1` до `pass25`
