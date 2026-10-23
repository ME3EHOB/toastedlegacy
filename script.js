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

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

window.onYouTubeIframeAPIReady = function() {
    createPlayer();
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

// ===== МЕНЮ =====
function toggleMenu() {
    document.getElementById("menu").classList.toggle("open");
}

function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    document.getElementById("menu").classList.remove("open");
    window.scrollTo(0, 0);
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
