// ===== МЕНЮ ПУСК =====
let startMenuOpen = false;

// Список всех доступных файлов/папок для поиска
const allFiles = [
    { name: "папка информация", id: "infoFolder", type: "folder" },
    { name: "папка тематика", id: "themeFolder", type: "folder" },
    { name: "история", id: "historyFile", type: "file" },
    { name: "соцсети", id: "socialsFile", type: "file" },
    { name: "краткая инфа", id: "fileFolder", type: "file" },
    { name: "тематика", id: "themeFile", type: "file" },
    { name: "цвета/группы", id: "colorsGroupsFile", type: "file" },
    { name: "участники", id: "participantsFile", type: "file" },
    { name: "шоукейс1", id: "videoFolder", type: "file" },
    { name: "скриншоты", id: "screenshotFolder", type: "file" },
    { name: "референсы", id: "referenceFolder", type: "file" }
];

function toggleStartMenu() {
    const menu = document.getElementById("start-menu");
    if (!menu) return;
    
    startMenuOpen = !startMenuOpen;
    if (startMenuOpen) {
        menu.classList.add("open");
    } else {
        menu.classList.remove("open");
    }
}

function closeAllWindows() {
    document.querySelectorAll(".window").forEach(win => {
        win.classList.add("hidden");
    });
    document.querySelectorAll(".taskbar-app").forEach(el => el.remove());
    toggleStartMenu();
}

function openFromStart(id, type) {
    toggleStartMenu();
    if (type === "folder") {
        openFolder(id, getFileName(id));
    } else {
        openWindow(id, getFileName(id));
    }
}

function getFileName(id) {
    const found = allFiles.find(f => f.id === id);
    return found ? found.name : id;
}

// Поиск
function searchFiles(query) {
    const resultsDiv = document.getElementById("search-results");
    if (!resultsDiv) return;
    
    if (query.trim() === "") {
        resultsDiv.innerHTML = "";
        return;
    }
    
    const q = query.toLowerCase();
    const results = allFiles.filter(f => f.name.toLowerCase().includes(q));
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div class="search-no-results">Не найдено</div>';
        return;
    }
    
    resultsDiv.innerHTML = results.map(f => 
        `<div class="search-result-item" onclick="openFromStart('${f.id}', '${f.type}')">${f.type === 'folder' ? '📁' : '📄'} ${f.name}</div>`
    ).join("");
}

// Закрытие меню при клике вне его
document.addEventListener("click", (e) => {
    const menu = document.getElementById("start-menu");
    const startBtn = document.getElementById("start-button");
    
    if (startMenuOpen && menu && !menu.contains(e.target) && !startBtn.contains(e.target)) {
        toggleStartMenu();
    }
});
