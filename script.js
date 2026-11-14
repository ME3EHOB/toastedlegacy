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
