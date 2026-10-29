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

    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    document.getElementById("menu").classList.remove("open");
    window.scrollTo(0, 0);

    if (id === "home" && mediaPlayer && mediaPlayer.playVideo) {
        mediaPlayer.playVideo();
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

// ===== 2) GLITCH НА ЗАГОЛОВКЕ =====
const titleEl = document.querySelector(".hero h1");
if (titleEl) {
    function triggerTitleGlitch() {
        titleEl.classList.add("glitch");
        setTimeout(() => titleEl.classList.remove("glitch"), 300);
    }
    function scheduleTitleGlitch() {
        const delay = 8000 + Math.random() * 12000;
        setTimeout(() => {
            triggerTitleGlitch();
            scheduleTitleGlitch();
        }, delay);
    }
    scheduleTitleGlitch();
}

// ===== 3) ПАРАЛЛАКС ПРИ СКРОЛЛЕ =====
const parallaxElements = document.querySelectorAll(".media-section .video-container, .screenshots-row img");

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach((el, index) => {
        const speed = 0.05 + (index % 3) * 0.03;
        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// ===== 5) ПОЯВЛЕНИЕ БЛОКОВ ПРИ СКРОЛЛЕ =====
const revealTargets = document.querySelectorAll(
    ".media-section, .screenshots-row img, .description-section p, .description-section .description-wait, footer, .news-item, .sub-page h2, .sub-page p"
);
revealTargets.forEach(el => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealTargets.forEach(el => revealObserver.observe(el));

// ===== 11) РАЗМЫТИЕ ВИДЕО НА ПАУЗЕ =====
const videoEl = document.querySelector("#archive video");
if (videoEl) {
    const videoContainer = videoEl.closest(".video-container");
    videoEl.addEventListener("pause", () => {
        if (videoContainer) videoContainer.classList.add("blurred");
    });
    videoEl.addEventListener("play", () => {
        if (videoContainer) videoContainer.classList.remove("blurred");
    });
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
