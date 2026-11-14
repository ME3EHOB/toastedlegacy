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
