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

// ===== ЗАЦИКЛИВАНИЕ ВИДЕО =====
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

    folder.classList.remove("hidden");
    addTaskbarIcon(folderId, title);
    focusWindow(folderId);
}

// 2. Свернуть окно (скрыть в панель задач)
function minimizeWindow(folderId) {
    const folder = document.getElementById(folderId);
    if (folder) {
        folder.classList.add("hidden");
        updateTaskbarActive(folderId, false);
    }
}

// 3. Закрыть окно (полностью + УДАЛИТЬ ИЗ ПАНЕЛИ ЗАДАЧ)
function closeWindow(folderId) {
    const folder = document.getElementById(folderId);
    if (folder) {
        folder.classList.add("hidden");
        // Удаляем иконку из панели задач
        const taskIcon = document.getElementById(`task-${folderId}`);
        if (taskIcon) taskIcon.remove();
    }
}

// 4. Развернуть/Восстановить
function toggleMaximize(folderId) {
    const folder = document.getElementById(folderId);
    if (!folder) return;

    if (folder.classList.contains("windowed")) {
        folder.classList.remove("windowed");
        folder.style.top = '';
        folder.style.left = '';
    } else {
        folder.classList.add("windowed");
        folder.style.top = '100px';
        folder.style.left = '100px';
    }
}

// 5. Добавление иконки в панель задач
function addTaskbarIcon(folderId, title) {
    const taskbarApps = document.getElementById("taskbarApps");
    if (document.getElementById(`task-${folderId}`)) return;

    const iconDiv = document.createElement("div");
    iconDiv.className = "taskbar-app";
    iconDiv.id = `task-${folderId}`;
    iconDiv.innerHTML = `<img src="https://img.icons8.com/color/48/folder-invoices--v1.png"> <span>${title}</span>`;
    
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

// 6. Фокус окна
function focusWindow(folderId) {
    document.querySelectorAll(".taskbar-app").forEach(el => el.classList.remove("active"));
    const taskIcon = document.getElementById(`task-${folderId}`);
    if (taskIcon) taskIcon.classList.add("active");
    
    document.querySelectorAll(".window").forEach(win => win.style.zIndex = 100);
    const folder = document.getElementById(folderId);
    if (folder) folder.style.zIndex = 101;
}

function updateTaskbarActive(folderId, isActive) {
    const taskIcon = document.getElementById(`task-${folderId}`);
    if (taskIcon) {
        isActive ? taskIcon.classList.add("active") : taskIcon.classList.remove("active");
    }
}

// ===== ПЕРЕТАСКИВАНИЕ ОКНА (МЫШЬ + ТАЧ) =====
let isDragging = false;
let currentWindow = null;
let offsetX, offsetY;

function startDrag(e, header) {
    const parentWindow = header.closest(".window");
    if (parentWindow && parentWindow.classList.contains("windowed")) {
        isDragging = true;
        currentWindow = parentWindow;
        const rect = parentWindow.getBoundingClientRect();
        
        // Поддержка мыши и тача
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
    }
}

function doDrag(e) {
    if (isDragging && currentWindow) {
        // Отключаем скролл на тач-устройствах при перетаскивании
        if (e.cancelable) e.preventDefault(); 
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        currentWindow.style.left = (clientX - offsetX) + "px";
        currentWindow.style.top = (clientY - offsetY) + "px";
    }
}

function stopDrag() {
    isDragging = false;
    currentWindow = null;
}

// Вешаем события
document.addEventListener("mousedown", (e) => {
    const header = e.target.closest(".window-header");
    if (header) startDrag(e, header);
});
document.addEventListener("mousemove", doDrag);
document.addEventListener("mouseup", stopDrag);

// Для телефонов (тач)
document.addEventListener("touchstart", (e) => {
    const header = e.target.closest(".window-header");
    if (header) startDrag(e, header);
}, { passive: false });
document.addEventListener("touchmove", doDrag, { passive: false });
document.addEventListener("touchend", stopDrag);

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
