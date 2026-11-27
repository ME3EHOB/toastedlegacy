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
        content.innerHTML = text.split("\n").filter(p => p.trim()).map(p => `<p style="margin-bottom: 8px; font-size: 13px; line-height: 1.5;">${p}</p>`).join("");
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
    adjustWindowSize("screenshotFolder", "main-screenshot");
}

function prevScreenshot() {
    currentScreenshotIndex = (currentScreenshotIndex - 1 + screenshots.length) % screenshots.length;
    updateScreenshotUI();
    adjustWindowSize("screenshotFolder", "main-screenshot");
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
    adjustWindowSize("referenceFolder", "main-reference");
}

function prevReference() {
    currentReferenceIndex = (currentReferenceIndex - 1 + references.length) % references.length;
    updateReferenceUI();
    adjustWindowSize("referenceFolder", "main-reference");
}

// ===== СКРИНШОТЫ ПАРТА (КАРУСЕЛЬ) =====
const partScreenshotsList = ["media/screenshot1.jpg", "media/screenshot2.jpg", "media/screenshot3.jpg"];
let currentPartIndex = 0;

function updatePartUI() {
    const img = document.getElementById("main-part-screenshot");
    const title = document.getElementById("partTitle");
    if (img) img.src = partScreenshotsList[currentPartIndex];
    if (title) title.textContent = `скриншот парта ${currentPartIndex + 1}`;
}

function nextPartScreenshot() {
    currentPartIndex = (currentPartIndex + 1) % partScreenshotsList.length;
    updatePartUI();
    adjustWindowSize("partScreenshots", "main-part-screenshot");
}

function prevPartScreenshot() {
    currentPartIndex = (currentPartIndex - 1 + partScreenshotsList.length) % partScreenshotsList.length;
    updatePartUI();
    adjustWindowSize("partScreenshots", "main-part-screenshot");
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
    
    if (windowId === "screenshotFolder") {
        updateScreenshotUI();
        adjustWindowSize(windowId, "main-screenshot");
    }
    if (windowId === "referenceFolder") {
        updateReferenceUI();
        adjustWindowSize(windowId, "main-reference");
    }
    if (windowId === "partScreenshots") {
        updatePartUI();
        adjustWindowSize(windowId, "main-part-screenshot");
    }
    if (windowId === "videoFolder") {
        const vid = document.getElementById("videoPlayer");
        if (vid) {
            vid.pause();
            if (vid.readyState >= 1) {
                adjustWindowSize(windowId, vid);
            } else {
                vid.onloadedmetadata = () => adjustWindowSize(windowId, vid);
            }
        }
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
        win.style.width = '100%'; win.style.height = '100%';
        win.style.transform = 'none';
    } else {
        win.classList.add("windowed");
        win.style.top = '100px'; win.style.left = '100px';
        win.style.width = '700px'; win.style.height = '500px';
        win.style.transform = 'none';
    }
}

// ===== ПОДСТРОЙКА РАЗМЕРА ОКНА ПОД МЕДИА =====
function adjustWindowSize(windowId, mediaElementOrId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    let media = typeof mediaElementOrId === 'string' ? document.getElementById(mediaElementOrId) : mediaElementOrId;
    if (!media) return;

    let mediaW, mediaH;

    if (media.tagName === 'VIDEO') {
        mediaW = media.videoWidth;
        mediaH = media.videoHeight;
    } else if (media.tagName === 'IMG') {
        const tempImg = new Image();
        tempImg.src = media.src;
        if (tempImg.complete) {
            mediaW = tempImg.width;
            mediaH = tempImg.height;
        } else {
            tempImg.onload = () => {
                applyWindowSize(win, tempImg.width, tempImg.height);
            };
            return;
        }
    } else {
        return;
    }

    if (mediaW && mediaH) {
        applyWindowSize(win, mediaW, mediaH);
    }
}

function applyWindowSize(win, mediaW, mediaH) {
    const maxW = window.innerWidth * 0.9;
    const maxH = window.innerHeight * 0.9;

    let newW = mediaW;
    let newH = mediaH + 40;

    if (newW > maxW) {
        const ratio = maxW / newW;
        newW = maxW;
        newH = newH * ratio;
    }
    if (newH > maxH) {
        const ratio = maxH / newH;
        newH = maxH;
        newW = newW * ratio;
    }

    win.classList.add('windowed'); 
    
    win.style.width = newW + 'px';
    win.style.height = newH + 'px';
    win.style.left = ((window.innerWidth - newW) / 2) + 'px';
    win.style.top = ((window.innerHeight - newH) / 2) + 'px';
    win.style.transform = 'none';
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

// ===== ПЕРЕТАСКИВАНИЕ ОКОН =====
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
