// ===== ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ =====
function showPage(pageId, btnElement = null) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add("active");

    // Обновляем активную кнопку
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    if (btnElement) {
        btnElement.classList.add("active");
    } else {
        const btn = document.querySelector(`.nav-btn[onclick*="${pageId}"]`);
        if (btn) btn.classList.add("active");
    }

    // Музыка/видео
    if (pageId !== "home" && player && player.pauseVideo) player.pauseVideo();
    if (pageId === "home" && player && player.playVideo) player.playVideo();

    // Сброс игры
    if (pageId !== "toastgame" && gameState.running) stopGame();

    window.scrollTo(0, 0);
}

// ИСПРАВЛЕНИЕ БАГА: Открытие игры
function openGame() {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    document.getElementById("toastgame").classList.add("active");
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    showGameStart();
    window.scrollTo(0, 0);
}

// ===== ФОНОВОЕ ВИДЕО (ОДНО, ЗАЦИКЛЕННОЕ) =====
let player = null;
const videoId = "5yPU29pTQDA"; 

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

window.onYouTubeIframeAPIReady = function() {
    const container = document.getElementById("bg-video");
    if (!container) return;
    
    container.innerHTML = '<div id="yt-player"></div>';
    player = new YT.Player("yt-player", {
        videoId: videoId,
        playerVars: {
            autoplay: 1, mute: 1, controls: 0, showinfo: 0, rel: 0,
            modestbranding: 1, playsinline: 1, disablekb: 1, iv_load_policy: 3,
            loop: 1, playlist: videoId
        },
        events: {
            onReady: function(event) { event.target.playVideo(); }
        }
    });
};

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

// ===== КАРУСЕЛЬ СКРИНШОТОВ =====
const screenshots = ["media/image1TL.jpg", "media/image2TL.jpg", "media/image3TL.jpg"];
let currentScreenshotIndex = 0;

function updateScreenshot() {
    const img = document.getElementById("main-screenshot");
    if (img) img.src = screenshots[currentScreenshotIndex];
}
function nextScreenshot() {
    currentScreenshotIndex = (currentScreenshotIndex + 1) % screenshots.length;
    updateScreenshot();
}
function prevScreenshot() {
    currentScreenshotIndex = (currentScreenshotIndex - 1 + screenshots.length) % screenshots.length;
    updateScreenshot();
}

// ===== КАРУСЕЛИ ПОДРОБНОСТЕЙ И УЧАСТНИКОВ =====
const detailSlides = ["slide-history", "slide-theme", "slide-news"];
let currentDetailIndex = 0;
function updateDetailSlides() {
    detailSlides.forEach((id, index) => {
        const slide = document.getElementById(id);
        if (slide) index === currentDetailIndex ? slide.classList.add("active") : slide.classList.remove("active");
    });
}
function nextDetail() { currentDetailIndex = (currentDetailIndex + 1) % detailSlides.length; updateDetailSlides(); }
function prevDetail() { currentDetailIndex = (currentDetailIndex - 1 + detailSlides.length) % detailSlides.length; updateDetailSlides(); }

const participantSlides = ["slide-p-toasted", "slide-p-legacy", "slide-p-socials"];
let currentParticipantIndex = 0;
function updateParticipantSlides() {
    participantSlides.forEach((id, index) => {
        const slide = document.getElementById(id);
        if (slide) index === currentParticipantIndex ? slide.classList.add("active") : slide.classList.remove("active");
    });
}
function nextParticipant() { currentParticipantIndex = (currentParticipantIndex + 1) % participantSlides.length; updateParticipantSlides(); }
function prevParticipant() { currentParticipantIndex = (currentParticipantIndex - 1 + participantSlides.length) % participantSlides.length; updateParticipantSlides(); }

// ===== ЛАЙТБОКС =====
function openLightbox(src) {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    if (lb && img) { img.src = src; lb.classList.add("active"); }
}
function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (lb) lb.classList.remove("active");
}
document.addEventListener("DOMContentLoaded", () => {
    const lb = document.getElementById("lightbox");
    const closeBtn = document.getElementById("lightbox-close");
    if (lb) lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
});

// ===== МИНИ-ИГРА =====
let gameState = { running: false, score: 0, misses: 0, speed: 2, toasts: [], animationId: null, toastTimer: null };
let playerX = 50;
let gameArea = null;
let playerEl = null;

function initGameControls() {
    gameArea = document.getElementById("game-area");
    playerEl = document.getElementById("player");

    if (gameArea && !gameArea.dataset.listenerAdded) {
        gameArea.dataset.listenerAdded = "true";
        gameArea.addEventListener("mousemove", (e) => {
            if (!gameState.running) return;
            const rect = gameArea.getBoundingClientRect();
            playerX = ((e.clientX - rect.left) / rect.width) * 100;
            playerX = Math.max(5, Math.min(95, playerX));
            playerEl.style.left = playerX + "%";
        });
        gameArea.addEventListener("touchmove", (e) => {
            if (!gameState.running) return;
            e.preventDefault();
            const rect = gameArea.getBoundingClientRect();
            const touch = e.touches[0];
            playerX = ((touch.clientX - rect.left) / rect.width) * 100;
            playerX = Math.max(5, Math.min(95, playerX));
            playerEl.style.left = playerX + "%";
        }, { passive: false });
    }
}

function startGame() {
    initGameControls();
    if (!gameArea || !playerEl) return;

    document.getElementById("game-start").style.display = "none";
    document.getElementById("game-info").style.display = "flex";
    document.getElementById("game-area").style.display = "block";
    document.getElementById("game-over").style.display = "none";
    playerEl.style.display = "block";

    gameState = { running: true, score: 0, misses: 0, speed: 2, toasts: [], animationId: null, toastTimer: null };
    playerX = 50;
    playerEl.style.left = "50%";
    document.getElementById("game-score").textContent = "0";
    document.getElementById("game-misses").textContent = "0";

    const record = parseInt(localStorage.getItem("toastRecord") || "0");
    document.getElementById("game-record").textContent = record;

    gameLoop();
    scheduleToast();
}

function showGameStart() {
    document.getElementById("game-start").style.display = "flex";
    document.getElementById("game-info").style.display = "none";
    document.getElementById("game-area").style.display = "none";
    document.getElementById("game-over").style.display = "none";
    if (playerEl) playerEl.style.display = "none";
    const record = parseInt(localStorage.getItem("toastRecord") || "0");
    document.getElementById("game-record").textContent = record;
}

function scheduleToast() {
    if (!gameState.running) return;
    spawnToast();
    const delay = Math.max(400, 1500 - gameState.score * 20);
    gameState.toastTimer = setTimeout(scheduleToast, delay);
}

function spawnToast() {
    if (!gameState.running || !gameArea) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = "🍞";
    const x = Math.random() * 90 + 5;
    toast.style.left = x + "%";
    toast.style.top = "-60px";
    gameArea.appendChild(toast);
    gameState.toasts.push({ el: toast, x: x, y: -60, speed: gameState.speed });
}

function gameLoop() {
    if (!gameState.running || !gameArea) return;
    const areaHeight = gameArea.clientHeight;
    const playerZoneTop = areaHeight - 100;

    gameState.toasts.forEach(t => {
        t.y += t.speed;
        t.el.style.top = t.y + "px";
        if (t.y >= playerZoneTop && !t.caught) {
            const dist = Math.abs(t.x - playerX);
            if (dist < 12) {
                t.caught = true; t.el.remove();
                gameState.score++; gameState.speed += 0.15;
                document.getElementById("game-score").textContent = gameState.score;
            } else if (t.y >= areaHeight) {
                t.caught = true; t.el.remove();
                gameState.misses++;
                document.getElementById("game-misses").textContent = gameState.misses;
                if (gameState.misses >= 5) { endGame(); return; }
            }
        }
    });
    gameState.toasts = gameState.toasts.filter(t => !t.caught);
    gameState.animationId = requestAnimationFrame(gameLoop);
}

function endGame() {
    gameState.running = false;
    cancelAnimationFrame(gameState.animationId);
    clearTimeout(gameState.toastTimer);
    gameState.toasts.forEach(t => t.el.remove());
    gameState.toasts = [];
    if (playerEl) playerEl.style.display = "none";

    document.getElementById("final-score").textContent = gameState.score;
    document.getElementById("game-over").style.display = "flex";

    const record = parseInt(localStorage.getItem("toastRecord") || "0");
    if (gameState.score > record) {
        localStorage.setItem("toastRecord", gameState.score);
        document.getElementById("game-record").textContent = gameState.score;
        document.getElementById("new-record").style.display = "block";
    } else {
        document.getElementById("new-record").style.display = "none";
    }
}

function stopGame() {
    gameState.running = false;
    cancelAnimationFrame(gameState.animationId);
    clearTimeout(gameState.toastTimer);
    gameState.toasts.forEach(t => t.el.remove());
    gameState.toasts = [];
}

function shareRecord() {
    const record = localStorage.getItem("toastRecord") || "0";
    const text = `Мой рекорд в Toast Catcher: ${record} очков! 🍞`;
    const url = "https://t.me/share/url?url=" + encodeURIComponent("https://me3ehob.github.io/toastedlegacy") + "&text=" + encodeURIComponent(text);
    window.open(url, "_blank");
}

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
        document.getElementById("online-count").textContent = snapshot.numChildren();
    });
} catch (error) {
    console.error("Firebase error:", error);
}
