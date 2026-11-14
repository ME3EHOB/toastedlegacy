// ===== СПЛЕШИ =====
const splashes = [
    "Eye?", "R. R. R.", "Ash...", "Error", "Error - reload the site", 
    "Thank you!", "Soon...", "Again.", "Cyanotype?", "I am alone here", 
    "He created a world for himself", ":(", "Darkness", "January 24."
];

function loadSplash() {
    const splashEl = document.getElementById("splash");
    if (splashEl) {
        const randomSplash = splashes[Math.floor(Math.random() * splashes.length)];
        splashEl.textContent = randomSplash;
    }
}
loadSplash();

// ===== ЗАЦИКЛИВАНИЕ ВИДЕО С 3 ПО 38 СЕКУНДУ =====
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("bg-video-local");
    if (video) {
        video.addEventListener('loadedmetadata', () => {
            video.currentTime = 3;
            video.play().catch(e => console.log("Автовоспроизведение заблокировано:", e));
        });
        video.addEventListener('timeupdate', () => {
            if (video.currentTime >= 38) {
                video.currentTime = 3;
            }
        });
    }
});

// ===== ЛОГИКА ОКОН =====
// 1. Открытие папки
function openFolder(folderId, title) {
    const folder = document.getElementById(folderId);
    if (!folder) return;

    // Показываем окно
    folder.classList.remove("hidden");
    
    // Если окно было "развернуто" (по умолчанию), оно не windowed
    // Добавляем иконку в панель задач, если её нет
    addTaskbarIcon(folderId, title);
    
    // Делаем окно активным (поднимаем наверх)
    focusWindow(folderId);
}

// 2. Свернуть окно (скрыть в панель задач)
function minimizeWindow(folderId) {
    const folder = document.getElementById(folderId);
    if (folder) {
        folder.classList.add("hidden");
        // Убираем активный статус у иконки в панели задач
        updateTaskbarActive(folderId, false);
    }
}

// 3. Закрыть окно (полностью)
function closeWindow(folderId) {
    const folder = document.getElementById(folderId);
    if (folder) {
        folder.classList.add("hidden");
        // Можно удалить иконку из панели задач, но для простоты просто скроем
        // (Если хочешь полное удаление из taskbar, раскомментируй:)
        // removeTaskbarIcon(folderId);
        updateTaskbarActive(folderId, false);
    }
}

// 4. Развернуть/Восстановить (сделать меньше и перетаскиваемым)
function toggleMaximize(folderId) {
    const folder = document.getElementById(folderId);
    if (!folder) return;

    if (folder.classList.contains("windowed")) {
        // Разворачиваем на весь экран
        folder.classList.remove("windowed");
        // Сбрасываем позицию
        folder.style.top = '';
        folder.style.left = '';
    } else {
        // Делаем окно маленьким и перетаскиваемым
        folder.classList.add("windowed");
        // Задаем стартовую позицию
        folder.style.top = '100px';
        folder.style.left = '100px';
    }
}

// 5. Добавление иконки в панель задач
function addTaskbarIcon(folderId, title) {
    const taskbarApps = document.getElementById("taskbarApps");
    // Проверяем, есть ли уже такая иконка
    if (document.getElementById(`task-${folderId}`)) {
        return; // Уже есть
    }

    const iconDiv = document.createElement("div");
    iconDiv.className = "taskbar-app";
    iconDiv.id = `task-${folderId}`;
    iconDiv.innerHTML = `<img src="https://img.icons8.com/color/48/folder-invoices--v1.png"> <span>${title}</span>`;
    
    // Клик по иконке в панели задач: если окно скрыто — показать, иначе свернуть
    iconDiv.onclick = () => {
        const folder = document.getElementById(folderId);
        if (folder.classList.contains("hidden")) {
            folder.classList.remove("hidden");
            focusWindow(folderId);
        } else {
            minimizeWindow(folderId);
        }
    };

    taskbarApps.appendChild(iconDiv);
}

// 6. Фокус окна (активный статус иконки)
function focusWindow(folderId) {
    // Убираем активный класс у всех иконок в панели задач
    document.querySelectorAll(".taskbar-app").forEach(el => el.classList.remove("active"));
    
    // Добавляем активный класс текущей иконке
    const taskIcon = document.getElementById(`task-${folderId}`);
    if (taskIcon) {
        taskIcon.classList.add("active");
    }
    
    // Поднимаем окно наверх (изменяем z-index)
    document.querySelectorAll(".window").forEach(win => {
        win.style.zIndex = 100;
    });
    const folder = document.getElementById(folderId);
    if (folder) {
        folder.style.zIndex = 101;
    }
}

function updateTaskbarActive(folderId, isActive) {
    const taskIcon = document.getElementById(`task-${folderId}`);
    if (taskIcon) {
        if (isActive) {
            taskIcon.classList.add("active");
        } else {
            taskIcon.classList.remove("active");
        }
    }
}

// ===== ПЕРЕТАСКИВАНИЕ ОКНА =====
let isDragging = false;
let currentWindow = null;
let offsetX, offsetY;

// Навешиваем обработчик на шапку окна
document.addEventListener("mousedown", (e) => {
    // Проверяем, что клик по шапке окна, которое в режиме windowed
    const header = e.target.closest(".window-header");
    if (header) {
        const parentWindow = header.closest(".window");
        if (parentWindow && parentWindow.classList.contains("windowed")) {
            isDragging = true;
            currentWindow = parentWindow;
            // Вычисляем смещение курсора относительно левого верхнего угла окна
            const rect = parentWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        }
    }
});

document.addEventListener("mousemove", (e) => {
    if (isDragging && currentWindow) {
        // Перемещаем окно
        currentWindow.style.left = (e.clientX - offsetX) + "px";
        currentWindow.style.top = (e.clientY - offsetY) + "px";
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    currentWindow = null;
});

// ===== FIREBASE =====
const firebaseConfig = {
    apiKey: "AIzaSyBw35A-ZB5HX4l30bpcodb9xtUSnHIz70w",
    authDomain: "toastedlegacy.firebaseapp.com",
    databaseURL: "https://toastedlegacy-default-rtdb.firebaseio.com",
    projectId: "toastedlegacy",
    storageBucket: "toastedlegacy.firebasestorage.app",
    messagingSenderId: "112141364154",
    appId: "1:112141364154:web:d69afa42ecfe2a79b40b83"
};

try {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const myId = "user_" + Math.random().toString(36).substr(2, 9);
    const myRef = database.ref("online/" + myId);
    myRef.set(true);
    myRef.onDisconnect().remove();
    database.ref("online").on("value", (snapshot) => {
        const count = snapshot.numChildren();
        const el = document.getElementById("online-count");
        if (el) el.textContent = count;
    });
} catch (error) {
    console.error("Firebase error:", error);
}
