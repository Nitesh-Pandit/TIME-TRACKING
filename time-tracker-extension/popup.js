// ============================================
// POPUP SCRIPT - Extension UI Logic
// ============================================
// MAIN POINT: This script handles the popup UI and displays real-time tracking data

// MAIN POINT: Update popup every second to show real-time tracking
setInterval(updatePopupData, 1000);

// MAIN POINT: Initialize popup when opened
document.addEventListener("DOMContentLoaded", () => {
  updatePopupData();
  setupButtonListeners();
});

// MAIN POINT: Function to update all popup data including current site, stats, and score
async function updatePopupData() {
  try {
    // MAIN POINT: Get the current active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) return;

    // MAIN POINT: Extract domain and display in popup
    const domain = getDomainFromUrl(tab.url);
    const currentWebsiteEl = document.getElementById("currentWebsite");
    currentWebsiteEl.innerHTML = `
            <p><strong>${tab.title || "Untitled"}</strong></p>
            <p class="domain">${domain}</p>
        `;

    // MAIN POINT: Fetch all tracking sessions from storage
    const storage = await chrome.storage.local.get("sessions");
    const sessions = storage.sessions || [];

    // MAIN POINT: Calculate statistics for today
    const todayStats = calculateTodayStats(sessions);

    // MAIN POINT: Update UI with time statistics
    document.getElementById("productiveTime").textContent = formatTime(
      todayStats.productive,
    );
    document.getElementById("unproductiveTime").textContent = formatTime(
      todayStats.unproductive,
    );
    document.getElementById("neutralTime").textContent = formatTime(
      todayStats.neutral,
    );

    // MAIN POINT: Calculate and display productivity score
    const score = calculateProductivityScore(todayStats);
    document.getElementById("scoreValue").textContent = score;

    // MAIN POINT: Color code the score circle based on productivity level
    const scoreCircle = document.getElementById("scoreCircle");
    if (score >= 75) {
      scoreCircle.style.borderColor = "#4CAF50"; // Green
    } else if (score >= 50) {
      scoreCircle.style.borderColor = "#FFC107"; // Yellow
    } else {
      scoreCircle.style.borderColor = "#F44336"; // Red
    }
  } catch (error) {
    console.error("Error updating popup:", error);
  }
}

// MAIN POINT: Extract domain from URL
function getDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch (e) {
    return "unknown";
  }
}

// MAIN POINT: Calculate today's statistics by filtering sessions from today
function calculateTodayStats(sessions) {
  const today = new Date().toDateString();
  const todaysSessions = sessions.filter((session) => {
    return new Date(session.timestamp).toDateString() === today;
  });

  let stats = { productive: 0, unproductive: 0, neutral: 0 };

  // MAIN POINT: Sum up time spent in each category
  todaysSessions.forEach((session) => {
    if (session.classification.type === "productive") {
      stats.productive += session.timeSpent;
    } else if (session.classification.type === "unproductive") {
      stats.unproductive += session.timeSpent;
    } else {
      stats.neutral += session.timeSpent;
    }
  });

  return stats;
}

// MAIN POINT: Calculate productivity score (0-100) based on time distribution
function calculateProductivityScore(stats) {
  const total = stats.productive + stats.unproductive + stats.neutral;
  if (total === 0) return 0;

  // MAIN POINT: Score formula: productive time weighted more heavily than neutral
  const score = Math.round(
    (stats.productive * 100 + stats.neutral * 50) / (total * 100),
  );

  return Math.min(100, Math.max(0, score));
}

// MAIN POINT: Format seconds into readable time format (h m s)
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// MAIN POINT: Setup button click listeners for dashboard, report, and reset
function setupButtonListeners() {
  // MAIN POINT: Open dashboard page when dashboard button is clicked
  document.getElementById("dashboardBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: "dashboard.html" });
  });

  // MAIN POINT: Open weekly report when report button is clicked
  document.getElementById("reportBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: "report.html" });
  });

  // MAIN POINT: Clear all tracking data when reset button is clicked with confirmation
  document.getElementById("resetBtn").addEventListener("click", async () => {
    if (confirm("Are you sure you want to clear all tracking data?")) {
      await chrome.storage.local.set({ sessions: [] });
      updatePopupData();
      alert("Data cleared successfully!");
    }
  });
}
