let gameState = {
    running: false, score: 0, misses: 0, speed: 2,
    toasts: [], animationId: null, toastTimer: null
};
let playerX = 50;
let gameArea = null;
let playerEl = null;

function initToastGame() {
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
    initToastGame();
    if (!gameArea || !playerEl) return;

    document.getElementById("game-start").style.display = "none";
    document.getElementById("game-info").style.display = "flex";
    document.getElementById("game-area").style.display = "block";
    document.getElementById("game-over").style.display = "none";

    playerEl.style.display = "block";
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

    const record = parseInt(localStorage.getItem("toastRecord") || "0");
    document.getElementById("game-record").textContent = record;

    gameLoop();
    scheduleToast();
}

function showGameStart() {
    const start = document.getElementById("game-start");
    const info = document.getElementById("game-info");
    const area = document.getElementById("game-area");
    const over = document.getElementById("game-over");
    
    if (start) start.style.display = "flex";
    if (info) info.style.display = "none";
    if (area) area.style.display = "none";
    if (over) over.style.display = "none";
    if (playerEl) playerEl.style.display = "none";

    const record = parseInt(localStorage.getItem("toastRecord") || "0");
    const recEl = document.getElementById("game-record");
    if (recEl) recEl.textContent = record;
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
    const playerZoneTop = areaHeight - 80;

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
