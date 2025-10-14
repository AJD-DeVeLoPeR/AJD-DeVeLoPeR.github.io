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

// Badge logic
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

// Popup function
function showBadgePopup(newBadge) {
  const popup = document.getElementById("badgePopup");
  popup.textContent = `🎉 Congrats! You are now a ${newBadge.replace("🌱 ", "").replace("🌿 ", "").replace("🌳 ", "").replace("🌎 ", "")}!`;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

// Update dashboard and auto-alerts
function updateDashboard() {
  const air = 80 + Math.floor(Math.random() * 10);       // 80-89%
  const water = 85 + Math.floor(Math.random() * 10);     // 85-94%
  const temp = 24 + Math.floor(Math.random() * 4);       // 24-27°C

  document.getElementById("airQuality").textContent = `${air}%`;
  document.getElementById("waterPurity").textContent = `${water}%`;
  document.getElementById("temperature").textContent = `${temp}°C`;

  // Auto-alerts based on thresholds
  if (air < 82) showAutoAlert("⚠️ Air quality is low — plant more trees!");
  else if (water < 87) showAutoAlert("💧 Water purity low — avoid waste!");
  else if (temp > 26) showAutoAlert("🔥 Temperature rising — save energy!");
  else clearAutoAlert();
}

// Display random eco fact
function updateEcoFact() {
  const fact = ecoFacts[Math.floor(Math.random() * ecoFacts.length)];
  document.getElementById("ecoFact").textContent = fact;
}

// Add eco action
function addEcoAction() {
  ecoScore += 10;
  actions.push(`Action ${actions.length + 1}: +10 points`);
  if (actions.length > 5) actions.shift();

  document.getElementById("ecoScore").textContent = ecoScore;
  updateProgress();
  updateBadge();
  showAlert("✅ Eco action added successfully!");
  updateHistory();
}

// Update progress bar
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

// Update history list
function updateHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  actions.slice(-5).forEach(a => {
    const li = document.createElement("li");
    li.textContent = a;
    list.appendChild(li);
  });
}

// Show manual alert (for button clicks)
function showAlert(msg) {
  const alertBox = document.getElementById("alert");
  alertBox.textContent = msg;
  setTimeout(() => (alertBox.textContent = ""), 2500);
}

// Show auto-alert (for sensor values)
function showAutoAlert(msg) {
  const alertBox = document.getElementById("alert");
  alertBox.textContent = msg;
}

// Clear auto-alert if everything is normal
function clearAutoAlert() {
  const alertBox = document.getElementById("alert");
  alertBox.textContent = "";
}

// Event listeners
document.getElementById("addActionBtn").addEventListener("click", addEcoAction);
document.getElementById("dailyTipBtn").addEventListener("click", updateEcoFact);

// Initialize dashboard
setInterval(updateDashboard, 3000);
updateDashboard();
updateEcoFact();
updateBadge();
updateProgress();
