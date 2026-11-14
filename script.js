// ===== СПЛЕШИ И ТЕКСТ =====
async function loadSplash() {
    const splashEl = document.getElementById("splash");
    if (!splashEl) return;
    try {
        const res = await fetch("text/splashes.txt");
        const text = await res.text();
        const splashes = text.split("\n").map(l => l.trim()).filter(l => l);
        if (splashes.length > 0) splashEl.textContent = splashes[Math.floor(Math.random() * splashes.length)];
    } catch (e) { splashEl.textContent = "Error"; }
}
loadSplash();

async function loadTextIntoWindow(filePath, targetId) {
    const content = document.getElementById(targetId);
    if (!content || content.dataset.loaded) return;
    try {
        const res = await fetch(filePath);
        const text = await res.text();
        content.innerHTML = text.split("\n").filter(p => p.trim()).map(p => `<p style="margin-bottom: 10px;">${p}</p>`).join("");
        content.dataset.loaded = "true";
    } catch (e) { content.innerHTML = "Ошибка загрузки текста."; }
}

// ===== ЗАЦИКЛИВАНИЕ ФОНОВОГО ВИДЕО =====
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("bg-video-local");
    if (video) {
        video.addEventListener('loadedmetadata', () => {
            video.currentTime = 3; video.play().catch(e => console.log(e));
        });
        video.addEventListener('timeupdate', () => {
            if (video.currentTime >= 38) video.currentTime = 3;
        });
    }
});

// ===== СКРИНШОТЫ (КАРУСЕЛЬ) =====
const screenshots = ["media/image1TL.jpg", "media/image2TL.jpg", "media/image3TL.jpg"];
let currentScreenshotIndex = 0;

function updateScreenshotUI() {
    const img = document.getElementById("main-screenshot");
    const title = document.getElementById("screenshotTitle");
    if (img) img.src = screenshots[currentScreenshotIndex];
    if (title) title.textContent = `скрин${currentScreenshotIndex + 1}`;
}

function nextScreenshot() {
    currentScreenshotIndex = (currentScreenshotIndex + 1) % screenshots.length;
    updateScreenshotUI();
}

function prevScreenshot() {
    currentScreenshotIndex = (currentScreenshotIndex - 1 + screenshots.length) % screenshots.length;
    updateScreenshotUI();
}

// ===== РЕФЕРЕНСЫ (КАРУСЕЛЬ) =====
const references = ["media/refer1TL.png", "media/refer2TL.png", "media/refer3TL.png"];
let currentReferenceIndex = 0;

function updateReferenceUI() {
    const img = document.getElementById("main-reference");
    const title = document.getElementById("referenceTitle");
    if (img) img.src = references[currentReferenceIndex];
    if (title) title.textContent = `референс${currentReferenceIndex + 1}`;
}

function nextReference() {
    currentReferenceIndex = (currentReferenceIndex + 1) % references.length;
    updateReferenceUI();
}

function prevReference() {
    currentReferenceIndex = (currentReferenceIndex - 1 + references.length) % references.length;
    updateReferenceUI();
}

// ===== ЛОГИКА ОКОН =====
function openWindow(windowId, title) {
    const win = document.getElementById(windowId);
    if (!win) return;

    win.classList.remove("hidden");
    addTaskbarIcon(windowId, title);
    focusWindow(windowId);

    // Спец. загрузки
    if (windowId === "fileFolder") loadTextIntoWindow("text/text1TL.txt", "textContent");
    if (windowId === "historyFile") loadTextIntoWindow("text/text3TL.txt", "historyContent");
    if (windowId === "socialsFile") loadTextIntoWindow("text/text4TL.txt", "socialsContent");
    if (windowId === "themeFile") loadTextIntoWindow("text/text2TL.txt", "themeContent");
    if (windowId === "colorsGroupsFile") loadTextIntoWindow("text/text2TL_1.txt", "colorsGroupsContent");
    if (windowId === "participantsFile") loadTextIntoWindow("text/text2TL_2.txt", "participantsContent");
    if (windowId === "screenshotFolder") updateScreenshotUI();
    if (windowId === "referenceFolder") updateReferenceUI();
    if (windowId === "videoFolder") {
        const vid = document.getElementById("videoPlayer");
        if (vid) vid.pause();
    }
}

function openFolder(windowId, title) {
    openWindow(windowId, title);
}

function minimizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.classList.add("hidden");
        updateTaskbarActive(windowId, false);
        if (windowId === "videoFolder") {
            const vid = document.getElementById("videoPlayer");
            if (vid) vid.pause();
        }
    }
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.classList.add("hidden");
        const taskIcon = document.getElementById(`task-${windowId}`);
        if (taskIcon) taskIcon.remove();
        if (windowId === "videoFolder") {
            const vid = document.getElementById("videoPlayer");
            if (vid) vid.pause();
        }
    }
}

function toggleMaximize(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    if (win.classList.contains("windowed")) {
        win.classList.remove("windowed");
        win.style.top = ''; win.style.left = '';
    } else {
        win.classList.add("windowed");
        win.style.top = '100px'; win.style.left = '100px';
    }
}

function addTaskbarIcon(windowId, title) {
    const taskbarApps = document.getElementById("taskbarApps");
    if (document.getElementById(`task-${windowId}`)) {
        focusWindow(windowId);
        return;
    }

    const shortTitle = title.length > 12 ? title.substring(0, 12) + "..." : title;

    const iconDiv = document.createElement("div");
    iconDiv.className = "taskbar-app";
    iconDiv.id = `task-${windowId}`;
    iconDiv.innerHTML = `<span style="font-size: 12px;">${shortTitle}</span>`;
    
    iconDiv.onclick = () => {
        const win = document.getElementById(windowId);
        if (win.classList.contains("hidden")) {
            win.classList.remove("hidden");
            focusWindow(windowId);
            if (windowId === "fileFolder") loadTextIntoWindow("text/text1TL.txt", "textContent");
            if (windowId === "historyFile") loadTextIntoWindow("text/text3TL.txt", "historyContent");
            if (windowId === "socialsFile") loadTextIntoWindow("text/text4TL.txt", "socialsContent");
            if (windowId === "themeFile") loadTextIntoWindow("text/text2TL.txt", "themeContent");
            if (windowId === "colorsGroupsFile") loadTextIntoWindow("text/text2TL_1.txt", "colorsGroupsContent");
            if (windowId === "participantsFile") loadTextIntoWindow("text/text2TL_2.txt", "participantsContent");
            if (windowId === "screenshotFolder") updateScreenshotUI();
            if (windowId === "referenceFolder") updateReferenceUI();
        } else {
            minimizeWindow(windowId);
        }
    };

    taskbarApps.appendChild(iconDiv);
}

function focusWindow(windowId) {
    document.querySelectorAll(".taskbar-app").forEach(el => el.classList.remove("active"));
    const taskIcon = document.getElementById(`task-${windowId}`);
    if (taskIcon) taskIcon.classList.add("active");
    
    document.querySelectorAll(".window").forEach(win => win.style.zIndex = 100);
    const win = document.getElementById(windowId);
    if (win) win.style.zIndex = 101;
}

function updateTaskbarActive(windowId, isActive) {
    const taskIcon = document.getElementById(`task-${windowId}`);
    if (taskIcon) {
        isActive ? taskIcon.classList.add("active") : taskIcon.classList.remove("active");
    }
}

// ===== ПЕРЕТАСКИВАНИЕ =====
let isDragging = false;
let currentWindow = null;
let offsetX, offsetY;

function startDrag(e, header) {
    const parentWindow = header.closest(".window");
    if (parentWindow && parentWindow.classList.contains("windowed")) {
        isDragging = true;
        currentWindow = parentWindow;
        const rect = parentWindow.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
    }
}

function doDrag(e) {
    if (isDragging && currentWindow) {
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

document.addEventListener("mousedown", (e) => {
    const header = e.target.closest(".window-header");
    if (header) startDrag(e, header);
});
document.addEventListener("mousemove", doDrag);
document.addEventListener("mouseup", stopDrag);

document.addEventListener("touchstart", (e) => {
    const header = e.target.closest(".window-header");
    if (header) startDrag(e, header);
}, { passive: false });
document.addEventListener("touchmove", doDrag, { passive: false });
document.addEventListener("touchend", stopDrag);

document.addEventListener("mousedown", (e) => {
    const windowEl = e.target.closest(".window");
    if (windowEl && !windowEl.classList.contains("hidden")) {
        focusWindow(windowEl.id);
    }
});

document.addEventListener("touchstart", (e) => {
    const windowEl = e.target.closest(".window");
    if (windowEl && !windowEl.classList.contains("hidden")) {
        focusWindow(windowEl.id);
    }
}, { passive: true });

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
