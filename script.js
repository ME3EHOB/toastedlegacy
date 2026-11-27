// ===== ФОНОВОЕ ВИДЕО (ОДНО, ЗАЦИКЛЕННОЕ С 3 ПО 38 СЕК) =====
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
            onReady: function(event) { 
                event.target.playVideo(); 
            }
        }
    });
};

// Зацикливание с 3 по 38 секунду (для YouTube)
function checkVideoTime() {
    if (player && player.getCurrentTime) {
        const time = player.getCurrentTime();
        if (time >= 38) {
            player.seekTo(3);
        }
    }
}
setInterval(checkVideoTime, 500);

// ===== СПЛЕШИ (Ч/Б) =====
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

// ===== КАРУСЕЛЬ СКРИНШОТОВ (ГЛАВНАЯ) =====
const screenshots = [
    "media/image1TL.jpg",
    "media/image2TL.jpg",
    "media/image3TL.jpg"
];
let currentScreenshotIndex = 0;

function updateScreenshot() {
    const img = document.getElementById("main-screenshot");
    if (img) {
        img.src = screenshots[currentScreenshotIndex];
    }
}

function nextScreenshot() {
    currentScreenshotIndex = (currentScreenshotIndex + 1) % screenshots.length;
    updateScreenshot();
}

function prevScreenshot() {
    currentScreenshotIndex = (currentScreenshotIndex - 1 + screenshots.length) % screenshots.length;
    updateScreenshot();
}

// ===== КАРУСЕЛИ НА СТРАНИЦАХ =====
// Подробности
const detailSlides = ["slide-history", "slide-theme", "slide-news"];
let currentDetailIndex = 0;

function updateDetailSlides() {
    detailSlides.forEach((id, index) => {
        const slide = document.getElementById(id);
        if (slide) {
            if (index === currentDetailIndex) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        }
    });
}

function nextDetail() {
    currentDetailIndex = (currentDetailIndex + 1) % detailSlides.length;
    updateDetailSlides();
}

function prevDetail() {
    currentDetailIndex = (currentDetailIndex - 1 + detailSlides.length) % detailSlides.length;
    updateDetailSlides();
}

// Участники
const participantSlides = ["slide-p-toasted", "slide-p-legacy", "slide-p-socials"];
let currentParticipantIndex = 0;

function updateParticipantSlides() {
    participantSlides.forEach((id, index) => {
        const slide = document.getElementById(id);
        if (slide) {
            if (index === currentParticipantIndex) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        }
    });
}

function nextParticipant() {
    currentParticipantIndex = (currentParticipantIndex + 1) % participantSlides.length;
    updateParticipantSlides();
}

function prevParticipant() {
    currentParticipantIndex = (currentParticipantIndex - 1 + participantSlides.length) % participantSlides.length;
    updateParticipantSlides();
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

// ===== FIREBASE (СЧЁТЧИК ОНЛАЙНА) =====
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
