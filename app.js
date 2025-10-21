// ---------------- LOGIN / SIGNUP ----------------
let currentUser = null;
const usersKey = "aetherUsers";

function getUsers() {
  return JSON.parse(localStorage.getItem(usersKey)) || {};
}

function saveUsers(users) {
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function login(user) {
  currentUser = user;
  document.getElementById("authContainer").classList.add("hidden");
  document.getElementById("appContainer").classList.remove("hidden");
  loadUserData();
  updateLeaderboard();
}

document.getElementById("loginBtn").addEventListener("click", () => {
  const user = document.getElementById("loginUser").value.trim();
  const users = getUsers();
  if (user && users[user]) login(user);
  else alert("User not found!");
});

document.getElementById("signupBtn").addEventListener("click", () => {
  const user = document.getElementById("signupUser").value.trim();
  if (!user) return alert("Enter username");
  const users = getUsers();
  if (users[user]) return alert("Username exists!");
  users[user] = { ecoScore: 0, actions: [], journal: [], planner: [], challenges: [] };
  saveUsers(users);
  login(user);
});

document.getElementById("showSignup").addEventListener("click", () => {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
});
document.getElementById("showLogin").addEventListener("click", () => {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  currentUser = null;
  document.getElementById("appContainer").classList.add("hidden");
  document.getElementById("authContainer").classList.remove("hidden");
});

// ---------------- DASHBOARD / ECO ----------------
let ecoScore = 0;
let badge = "🌱 Eco Beginner";
let lastBadge = badge;
let actions = [];

const ecoFacts = [
  "Turning off unused lights saves energy.",
  "Using public transport reduces carbon footprint.",
  "Planting trees improves air quality.",
  "Avoiding plastic bags protects marine life.",
  "Watering plants early saves water.",
  "Unplug devices when not in use.",
  "Switching to LED bulbs saves electricity.",
  "Reuse containers instead of throwing them away.",
  "Recycle paper to save trees.",
  "Support local products to reduce shipping emissions."
];

function getBadge(score) {
  if (score >= 201) return "🌎 Planet Protector";
  if (score >= 101) return "🌳 Earth Hero";
  if (score >= 51) return "🌿 Green Guardian";
  return "🌱 Eco Beginner";
}

function updateBadge() {
  badge = getBadge(ecoScore);
  document.getElementById("badge").textContent = "Badge: " + badge;
  if (badge !== lastBadge) {
    showBadgePopup(badge);
    lastBadge = badge;
  }
}

function showBadgePopup(newBadge) {
  const popup = document.getElementById("badgePopup");
  popup.textContent = `🎉 Congrats! You are now a ${newBadge.replace(/🌱|🌿|🌳|🌎/g,"")}!`;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

function updateDashboard() {
  const air = 80 + Math.floor(Math.random() * 10);
  const water = 85 + Math.floor(Math.random() * 10);
  const temp = 24 + Math.floor(Math.random() * 4);

  document.getElementById("airQuality").textContent = `${air}%`;
  document.getElementById("waterPurity").textContent = `${water}%`;
  document.getElementById("temperature").textContent = `${temp}°C`;

  if (air < 82) showAutoAlert("⚠️ Air quality is low — plant more trees!");
  else if (water < 87) showAutoAlert("💧 Water purity low — avoid waste!");
  else if (temp > 26) showAutoAlert("🔥 Temperature rising — save energy!");
  else clearAutoAlert();
}

function updateEcoFact() {
  const fact = ecoFacts[Math.floor(Math.random() * ecoFacts.length)];
  document.getElementById("ecoFact").textContent = fact;
}

function addEcoAction() {
  ecoScore += 10;
  actions.push(`Action ${actions.length + 1}: +10 points`);
  if (actions.length > 5) actions.shift();

  document.getElementById("ecoScore").textContent = ecoScore;
  updateProgress();
  updateBadge();
  showAlert("✅ Eco action added successfully!");
  updateHistory();
  saveUserData();
}

function resetActions() {
  ecoScore = 0;
  actions = [];
  document.getElementById("ecoScore").textContent = ecoScore;
  updateProgress();
  updateHistory();
  showAlert("🔄 Actions reset!");
  saveUserData();
}

function updateProgress() {
  const nextLevel = badge === "🌎 Planet Protector" ? 300 :
                    badge === "🌳 Earth Hero" ? 200 :
                    badge === "🌿 Green Guardian" ? 100 : 50;
  const base = badge === "🌱 Eco Beginner" ? 0 :
               badge === "🌿 Green Guardian" ? 50 :
               badge === "🌳 Earth Hero" ? 100 : 200;
  const progress = ((ecoScore - base) / (nextLevel - base)) * 100;
  document.getElementById("progressBar").style.width = `${Math.min(progress, 100)}%`;
}

function updateHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  actions.slice(-5).forEach(a => {
    const li = document.createElement("li");
    li.textContent = a;
    list.appendChild(li);
  });
}

function showAlert(msg) {
  const alertBox = document.getElementById("alert");
  alertBox.textContent = msg;
  setTimeout(() => (alertBox.textContent = ""), 2500);
}

function showAutoAlert(msg) {
  const alertBox = document.getElementById("alert");
  alertBox.textContent = msg;
}

function clearAutoAlert() {
  const alertBox = document.getElementById("alert");
  alertBox.textContent = "";
}

document.getElementById("addActionBtn").addEventListener("click", addEcoAction);
document.getElementById("dailyTipBtn").addEventListener("click", updateEcoFact);
document.getElementById("resetActionsBtn").addEventListener("click", resetActions);

setInterval(updateDashboard, 3000);
updateDashboard();
updateEcoFact();
updateBadge();
updateProgress();

// ----------------- MONTHLY PLANNER -----------------
function loadPlanner() {
  const users = getUsers();
  const plannerTasks = (users[currentUser]?.planner || []);
  const list = document.getElementById("plannerList");
  list.innerHTML = "";
  plannerTasks.forEach(task => {
    const li = document.createElement("li");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = task.completed;
    cb.addEventListener("change", () => {
      task.completed = cb.checked;
      saveUserData();
    });
    li.appendChild(cb);
    li.appendChild(document.createTextNode(task.text));
    list.appendChild(li);
  });
}

document.getElementById("addPlannerBtn").addEventListener("click", () => {
  const text = document.getElementById("plannerInput").value.trim();
  if (!text) return;
  const users = getUsers();
  const task = { text, completed: false };
  users[currentUser].planner.push(task);
  saveUsers(users);
  document.getElementById("plannerInput").value = "";
  loadPlanner();
});

function loadChallenges() {
  const users = getUsers();
  const userChallenges = users[currentUser]?.challenges || [];
  const checkboxes = document.querySelectorAll(".challengeItem");
  checkboxes.forEach((cb, i) => {
    cb.checked = userChallenges[i] || false;
    cb.addEventListener("change", () => {
      users[currentUser].challenges[i] = cb.checked;
      saveUsers(users);
    });
  });
}

// ----------------- JOURNAL -----------------
function loadJournal() {
  const users = getUsers();
  const entries = users[currentUser]?.journal || [];
  const list = document.getElementById("journalList");
  list.innerHTML = "";
  entries.forEach(j => {
    const li = document.createElement("li");
    li.textContent = j;
    list.appendChild(li);
  });
}

document.getElementById("saveJournalBtn").addEventListener("click", () => {
  const text = document.getElementById("journalInput").value.trim();
  if (!text) return;
  const users = getUsers();
  users[currentUser].journal.push(text);
  saveUsers(users);
  document.getElementById("journalInput").value = "";
  loadJournal();
});

// ----------------- COMMUNITY -----------------
// ----------------- COMMUNITY BOARD -----------------

const communityKey = "aetherCommunity";

// Load all posts from localStorage
function loadCommunity() {
  const posts = JSON.parse(localStorage.getItem(communityKey)) || [];
  const list = document.getElementById("communityList");
  list.innerHTML = "";
  posts.slice().reverse().forEach(post => { // newest first
    const li = document.createElement("li");
    li.style.margin = "10px 0";
    li.style.border = "1px solid #ccc";
    li.style.padding = "5px";
    li.style.borderRadius = "10px";
    li.style.background = "#e9f5db";

    const userEl = document.createElement("b");
    userEl.textContent = post.user + ": ";
    li.appendChild(userEl);

    if(post.text) {
      const textEl = document.createElement("span");
      textEl.textContent = post.text;
      li.appendChild(textEl);
    }

    if(post.image) {
      const imgEl = document.createElement("img");
      imgEl.src = post.image;
      imgEl.style.maxWidth = "150px";
      imgEl.style.display = "block";
      imgEl.style.marginTop = "5px";
      li.appendChild(imgEl);
    }

    list.appendChild(li);
  });
}

// Save a post
function saveCommunityPost(text, imageData) {
  const posts = JSON.parse(localStorage.getItem(communityKey)) || [];
  posts.push({ user: currentUser, text, image: imageData });
  localStorage.setItem(communityKey, JSON.stringify(posts));
  loadCommunity();
}

// Add post button
document.getElementById("postCommunityBtn").addEventListener("click", () => {
  const text = document.getElementById("communityInput").value.trim();
  const fileInput = document.getElementById("communityImage");
  if(!text && !fileInput.files[0]) return alert("Add text or select an image!");

  if(fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      saveCommunityPost(text, e.target.result);
      document.getElementById("communityInput").value = "";
      fileInput.value = "";
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveCommunityPost(text, null);
    document.getElementById("communityInput").value = "";
  }

  function addCommunityPost(username, text, imageData) {
  const list = document.getElementById("communityList");
  const li = document.createElement("li");

  const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  li.innerHTML = `
    <span class="username">${username}</span>
    <span class="timestamp">${time}</span>
    <p>${text}</p>
    ${imageData ? `<img src="${imageData}">` : ""}
  `;

  list.prepend(li); // newest post on top
}

});

// Load posts initially
loadCommunity();


// ----------------- LEADERBOARD -----------------
function updateLeaderboard() {
  const users = getUsers();
  const sorted = Object.keys(users).sort((a,b) => users[b].ecoScore - users[a].ecoScore);
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  sorted.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u}: ${users[u].ecoScore} pts`;
    list.appendChild(li);
  });
}

// ----------------- USER DATA -----------------
function saveUserData() {
  const users = getUsers();
  users[currentUser].ecoScore = ecoScore;
  users[currentUser].actions = actions;
  saveUsers(users);
  updateLeaderboard();
}

function loadUserData() {
  const users = getUsers();
  const user = users[currentUser];
  ecoScore = user.ecoScore || 0;
  actions = user.actions || [];
  document.getElementById("ecoScore").textContent = ecoScore;
  updateHistory();
  updateProgress();
  updateBadge();
  loadPlanner();
  loadChallenges();
  loadJournal();
}

