// ===== ПЕРЕКЛЮЧЕНИЕ: ТАЙМЕР ИЛИ САЙТ =====
const targetDate = new Date(2026, 9, 22, 0, 0, 0);
const now = new Date();

if (now >= targetDate) {
    document.getElementById("timer-page").classList.add("hidden");
    document.getElementById("main-page").classList.add("active");
    initFirebase();
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
