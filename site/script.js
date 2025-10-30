const homeScreen = document.getElementById("homeScreen");
const gamesScreen = document.getElementById("gamesScreen");
const appsScreen = document.getElementById("appsScreen");
const homeNavBtn = document.getElementById("homeNavBtn");
const gamesNavBtn = document.getElementById("gamesNavBtn");
const appsNavBtn = document.getElementById("appsNavBtn");
const gamesGrid = document.getElementById("gamesGrid");
const appsGrid = document.getElementById("appsGrid");
const searchInput = document.getElementById("searchInput");
const searchAppsInput = document.getElementById("searchAppsInput");
const noResults = document.getElementById("noResults");
const noAppsResults = document.getElementById("noAppsResults");
const gameContainer = document.getElementById("gameContainer");
const gameIframe = document.getElementById("gameIframe");
const gameTitle = document.getElementById("gameTitle");
const backBtn = document.getElementById("backBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const blankBtn = document.getElementById("blankBtn");
const blobBtn = document.getElementById("blobBtn");
const blobModal = document.getElementById("blobModal");
const blobUrlDisplay = document.getElementById("blobUrlDisplay");
const copyBlobBtn = document.getElementById("copyBlobBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const tabBtns = document.querySelectorAll(".tab-btn");
const allAppsBtn = document.getElementById("allAppsBtn");
const favoriteAppsBtn = document.getElementById("favoriteAppsBtn");

let favorites = {};
let appFavorites = {};
let currentFilter = "all";
let currentAppFilter = "all";
let currentGameUrl = "";
let lastScreen = "games";
let generatedBlobUrl = "";

function showHome() {
  homeScreen.classList.remove("hidden");
  gamesScreen.classList.remove("active");
  appsScreen.classList.remove("active");
  homeNavBtn.classList.add("active");
  gamesNavBtn.classList.remove("active");
  appsNavBtn.classList.remove("active");
}

function showGames() {
  homeScreen.classList.add("hidden");
  gamesScreen.classList.add("active");
  appsScreen.classList.remove("active");
  homeNavBtn.classList.remove("active");
  gamesNavBtn.classList.add("active");
  appsNavBtn.classList.remove("active");
}

function showApps() {
  homeScreen.classList.add("hidden");
  gamesScreen.classList.remove("active");
  appsScreen.classList.add("active");
  homeNavBtn.classList.remove("active");
  gamesNavBtn.classList.remove("active");
  appsNavBtn.classList.add("active");
}

homeNavBtn.addEventListener("click", showHome);
gamesNavBtn.addEventListener("click", showGames);
appsNavBtn.addEventListener("click", showApps);

function loadFavorites() {
  const saved = window.localStorage.getItem("jupiterFavorites");
  if (saved) {
    favorites = JSON.parse(saved);
  }
  const savedApps = window.localStorage.getItem("jupiterAppFavorites");
  if (savedApps) {
    appFavorites = JSON.parse(savedApps);
  }
}

function saveFavorites() {
  window.localStorage.setItem("jupiterFavorites", JSON.stringify(favorites));
}

function saveAppFavorites() {
  window.localStorage.setItem(
    "jupiterAppFavorites",
    JSON.stringify(appFavorites)
  );
}

function toggleFavorite(gameName, event) {
  event.stopPropagation();
  favorites[gameName] = !favorites[gameName];
  saveFavorites();
  displayGames(getFilteredGames());
}

function toggleAppFavorite(appName, event) {
  event.stopPropagation();
  appFavorites[appName] = !appFavorites[appName];
  saveAppFavorites();
  displayApps(getFilteredApps());
}

function getFilteredGames() {
  const query = searchInput.value.toLowerCase();
  let filtered = games.filter((game) =>
    game.name.toLowerCase().includes(query)
  );

  if (currentFilter === "favorites") {
    filtered = filtered.filter((game) => favorites[game.name]);
  }

  return filtered;
}

function displayGames(gamesToShow) {
  gamesGrid.innerHTML = "";

  if (gamesToShow.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  gamesToShow.forEach((game) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.onclick = () => loadGame(game);

    const isFavorited = favorites[game.name];

    card.innerHTML = `
      <button class="favorite-btn ${isFavorited ? "favorited" : ""}" 
              onclick="toggleFavorite('${game.name}', event)">
        ${isFavorited ? "★" : "☆"}
      </button>
      <img src="${game.image}" alt="${game.name}" class="game-image">
      <div class="game-name">${game.name}</div>
    `;

    gamesGrid.appendChild(card);
  });
}

async function loadGame(game) {
  lastScreen = "games";
  gameTitle.textContent = game.name;
  currentGameUrl = game.html;
  homeScreen.classList.add("hidden");
  gamesScreen.classList.remove("active");
  appsScreen.classList.remove("active");
  gameContainer.classList.add("active");

  try {
    const response = await fetch(game.html);
    let html = await response.text();

    const gamePath = game.html.replace(/^\//, "");
    const baseUrl = `https://raw.githack.com/thatsalotofgames/thatsalotofgames.github.io/main/${gamePath.substring(
      0,
      gamePath.lastIndexOf("/") + 1
    )}`;

    html = html.replace(/<head>/i, `<head><base href="${baseUrl}">`);

    const blob = new Blob([html], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    gameIframe.src = blobUrl;
  } catch (error) {
    console.error("Error loading game:", error);
    gameIframe.src = game.html;
  }
}

function closeGame() {
  gameIframe.src = "";
  gameContainer.classList.remove("active");
  if (lastScreen === "apps") showApps();
  else showGames();
}

backBtn.addEventListener("click", closeGame);

fullscreenBtn.addEventListener("click", () => {
  if (gameIframe.requestFullscreen) {
    gameIframe.requestFullscreen();
  } else if (gameIframe.webkitRequestFullscreen) {
    gameIframe.webkitRequestFullscreen();
  } else if (gameIframe.msRequestFullscreen) {
    gameIframe.msRequestFullscreen();
  }
});

blankBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(currentGameUrl);
    let html = await response.text();

    const gamePath = currentGameUrl.replace(/^\//, "");
    const baseUrl = `https://raw.githack.com/thatsalotofgames/thatsalotofgames.github.io/main/${gamePath.substring(
      0,
      gamePath.lastIndexOf("/") + 1
    )}`;

    html = html.replace(/<head>/i, `<head><base href="${baseUrl}">`);

    const win = window.open("about:blank");
    win.document.write(html);
    win.document.close();
  } catch (error) {
    console.error("Error opening game:", error);
    window.open(currentGameUrl, "_blank");
  }
});

blobBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(currentGameUrl);
    let html = await response.text();

    const gamePath = currentGameUrl.replace(/^\//, "");
    const baseUrl = `https://raw.githack.com/thatsalotofgames/thatsalotofgames.github.io/main/${gamePath.substring(
      0,
      gamePath.lastIndexOf("/") + 1
    )}`;

    html = html.replace(/<head>/i, `<head><base href="${baseUrl}">`);

    const blob = new Blob([html], { type: "text/html" });
    generatedBlobUrl = URL.createObjectURL(blob);

    blobUrlDisplay.textContent = generatedBlobUrl;
    blobModal.classList.add("active");
  } catch (error) {
    console.error("Error generating blob URL:", error);
    alert("Error generating blob URL");
  }
});

copyBlobBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(generatedBlobUrl);
    copyBlobBtn.textContent = "Copied!";
    copyBlobBtn.classList.add("copied");
    setTimeout(() => {
      copyBlobBtn.textContent = "Copy URL";
      copyBlobBtn.classList.remove("copied");
    }, 2000);
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    alert("Error copying to clipboard");
  }
});

closeModalBtn.addEventListener("click", () => {
  blobModal.classList.remove("active");
});

blobModal.addEventListener("click", (e) => {
  if (e.target === blobModal) {
    blobModal.classList.remove("active");
  }
});

searchInput.addEventListener("input", () => {
  displayGames(getFilteredGames());
});

searchAppsInput.addEventListener("input", () => {
  displayApps(getFilteredApps());
});

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    displayGames(getFilteredGames());
  });
});

allAppsBtn.addEventListener("click", () => {
  allAppsBtn.classList.add("active");
  favoriteAppsBtn.classList.remove("active");
  currentAppFilter = "all";
  displayApps(getFilteredApps());
});

favoriteAppsBtn.addEventListener("click", () => {
  allAppsBtn.classList.remove("active");
  favoriteAppsBtn.classList.add("active");
  currentAppFilter = "favorites";
  displayApps(getFilteredApps());
});

loadFavorites();
displayGames(getFilteredGames());
displayApps(getFilteredApps());

function getFilteredApps() {
  const query = searchAppsInput.value.toLowerCase();
  let filtered = apps.filter((app) => app.name.toLowerCase().includes(query));

  if (currentAppFilter === "favorites") {
    filtered = filtered.filter((app) => appFavorites[app.name]);
  }

  return filtered;
}

function displayApps(appsToShow) {
  appsGrid.innerHTML = "";

  if (appsToShow.length === 0) {
    noAppsResults.style.display = "block";
    return;
  }

  noAppsResults.style.display = "none";

  appsToShow.forEach((app) => {
    const card = document.createElement("div");
    card.className = "app-card";
    card.onclick = () => loadApp(app);

    const isFavorited = appFavorites[app.name];

    card.innerHTML = `
      <button class="favorite-btn ${isFavorited ? "favorited" : ""}" 
              onclick="toggleAppFavorite('${app.name}', event)">
        ${isFavorited ? "★" : "☆"}
      </button>
      <img src="${app.image}" alt="${app.name}" class="app-image">
      <div class="app-name">${app.name}</div>
    `;

    appsGrid.appendChild(card);
  });
}

function loadApp(app) {
  lastScreen = "apps";
  gameTitle.textContent = app.name;
  gameIframe.src = app.html;
  currentGameUrl = app.html;
  homeScreen.classList.add("hidden");
  gamesScreen.classList.remove("active");
  appsScreen.classList.remove("active");
  gameContainer.classList.add("active");
}
