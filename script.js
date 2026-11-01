// ===== ФОНОВОЕ ВИДЕО (все 6 по кругу, до конца) =====
const videos = [
    { id: "YY0a-AQhVck", date: "22.12.25" },
    { id: "Rvw4yWbrxVI", date: "02.01.26" },
    { id: "fGRP7_R93-A", date: "17.01.26" },
    { id: "41JJfVPjOWQ", date: "01.02.26" },
    { id: "gLWZEREWPC8", date: "09.03.26" },
    { id: "5yPU29pTQDA", date: "24.10.26" }
];

let currentVideo = 0;
let player = null;
let mediaPlayer = null;

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

window.onYouTubeIframeAPIReady = function() {
    createPlayer();
    createMediaPlayer();
};

function createPlayer() {
    const video = videos[currentVideo];
    const dateLabel = document.getElementById("video-date");
    if (dateLabel) dateLabel.textContent = video.date;

    const container = document.getElementById("bg-video");
    if (!container) return;
    container.innerHTML = '<div id="yt-player"></div>';

    player = new YT.Player("yt-player", {
        videoId: video.id,
        playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            showinfo: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            disablekb: 1,
            iv_load_policy: 3
        },
        events: {
            onReady: function(event) { event.target.playVideo(); },
            onStateChange: function(event) {
                if (event.data === YT.PlayerState.ENDED) {
                    nextVideo();
                }
            }
        }
    });
}

function nextVideo() {
    currentVideo = (currentVideo + 1) % videos.length;
    if (player && player.loadVideoById) {
        const video = videos[currentVideo];
        const dateLabel = document.getElementById("video-date");
        if (dateLabel) dateLabel.textContent = video.date;
        player.loadVideoById(video.id);
    }
}

function createMediaPlayer() {
    const container = document.getElementById("media-player");
    if (!container) return;

    mediaPlayer = new YT.Player("media-player", {
        videoId: "5yPU29pTQDA",
        playerVars: {
            autoplay: 1,
            mute: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1
        },
        events: {
            onReady: function(event) {
                event.target.playVideo();
            }
        }
    });
}

// ===== МЕНЮ =====
function toggleMenu() {
    document.getElementById("menu").classList.toggle("open");
}

function showPage(id) {
    document.querySelectorAll("video").forEach(v => {
        v.pause();
        v.currentTime = 0;
    });

    if (mediaPlayer && mediaPlayer.pauseVideo) {
        mediaPlayer.pauseVideo();
    }

    // Останавливаем игру, если уходим с неё
    if (gameState.running && id !== "toastgame") {
        stopGame();
    }

    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    document.getElementById("menu").classList.remove("open");
    window.scrollTo(0, 0);

    if (id === "home" && mediaPlayer && mediaPlayer.playVideo) {
        mediaPlayer.playVideo();
    }

    // Автозапуск игры при переходе
    if (id === "toastgame" && !gameState.running) {
        startGame();
    }
}

function closeSite() {
    window.close();
    window.location.href = "about:blank";
}

// ===== ЛАЙТБОКС =====
function openLightbox(src) {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    if (!lb || !img) return;
    img.src = src;
    lb.classList.add("active");
}

function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (lb) lb.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const lb = document.getElementById("lightbox");
    const closeBtn = document.getElementById("lightbox-close");

    if (lb) {
        lb.addEventListener("click", (e) => {
            if (e.target === lb) closeLightbox();
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener("click", closeLightbox);
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });
});

// ===== СПЛЕШИ =====
async function loadSplash() {
    try {
        const response = await fetch("splashes.txt");
        const text = await response.text();
        const splashes = text
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);

        if (splashes.length === 0) return;

        const randomSplash = splashes[Math.floor(Math.random() * splashes.length)];
        const splashEl = document.getElementById("splash");
        if (splashEl) splashEl.textContent = randomSplash;
    } catch (error) {
        console.error("Splash error:", error);
    }
}

loadSplash();

// ===== МИНИ-ИГРА TOAST CATCHER =====
let gameState = {
    running: false,
    score: 0,
    misses: 0,
    speed: 2,
    toasts: [],
    animationId: null,
    toastTimer: null
};

let playerX = 50;
let gameArea = null;
let playerEl = null;

document.addEventListener("DOMContentLoaded", () => {
    gameArea = document.getElementById("game-area");
    playerEl = document.getElementById("player");

    if (gameArea) {
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
});

function startGame() {
    if (!gameArea || !playerEl) return;

    gameState.running = true;
    gameState.score = 0;
    gameState.misses = 0;
    gameState.speed = 2;
    gameState.toasts.forEach(t => t.el.remove());
    gameState.toasts = [];
    playerX = 50;

    playerEl.style.left = "50%";
    document.getElementById("game-score").textContent = "0";
    document.getElementById("game-misses").textContent = "0";
    document.getElementById("game-over").style.display = "none";

    const record = parseInt(localStorage.getItem("toastRecord") || "0");
    document.getElementById("game-record").textContent = record;

    gameLoop();
    scheduleToast();
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

    gameState.toasts.push({
        el: toast,
        x: x,
        y: -60,
        speed: gameState.speed
    });
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
                t.caught = true;
                t.el.remove();
                gameState.score++;
                gameState.speed += 0.15;
                document.getElementById("game-score").textContent = gameState.score;
            } else if (t.y >= areaHeight) {
                t.caught = true;
                t.el.remove();
                gameState.misses++;
                document.getElementById("game-misses").textContent = gameState.misses;

                if (gameState.misses >= 5) {
                    endGame();
                    return;
                }
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
    const overEl = document.getElementById("game-over");
    if (overEl) overEl.style.display = "none";
}

function shareRecord() {
    const record = localStorage.getItem("toastRecord") || "0";
    const text = `Мой рекорд в Toast Catcher на сайте Toasted Legacy: ${record} очков! 🍞`;
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
        const count = snapshot.numChildren();
        const el = document.getElementById("online-count");
        if (el) el.textContent = count;
    });
} catch (error) {
    console.error("Firebase error:", error);
}
