// ===== ПЕРЕКЛЮЧЕНИЕ: ТАЙМЕР ИЛИ САЙТ =====
const targetDate = new Date(2026, 9, 22, 0, 0, 0);
const now = new Date();

if (now >= targetDate) {
    document.getElementById("timer-page").classList.add("hidden");
    document.getElementById("main-page").classList.add("active");
    initFirebase();
    initVideoPlayer();
} else {
    startCountdown();
}

// ===== ТАЙМЕР =====
function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            document.getElementById("timer-page").classList.add("hidden");
            document.getElementById("main-page").classList.add("active");
            initFirebase();
            initVideoPlayer();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(days).padStart(2, "0");
        document.getElementById("hours").textContent = String(hours).padStart(2, "0");
        document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
        document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// ===== ФОНОВОЕ ВИДЕО (все 6 по кругу, до конца) =====
const videos = [
    { id: "YY0a-AQhVck", date: "22.12.25" },
    { id: "Rvw4yWbrxVI", date: "02.01.26" },
    { id: "fGRP7_R93-A", date: "17.01.26" },
    { id: "41JJfVPjOWQ", date: "01.02.26" },
    { id: "gLWZEREWPC8", date: "09.03.26" },
    { id: "gj0izUkZf-U", date: "20.08.26" }
];

let currentVideo = 0;
let player = null;

function initVideoPlayer() {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
}

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

// ===== FIREBASE =====
let firebaseInitialized = false;

function initFirebase() {
    if (firebaseInitialized) return;
    firebaseInitialized = true;

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
}
