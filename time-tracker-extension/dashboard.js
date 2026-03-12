// ============================================
// DASHBOARD SCRIPT - Analytics Logic
// ============================================
// MAIN POINT: This script powers the analytics dashboard with data visualization and detailed breakdowns

let currentPeriod = "today";

// MAIN POINT: Initialize dashboard when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
  setupPeriodButtons();
  setupActionButtons();
});

// MAIN POINT: Setup period selector buttons to switch between time ranges
function setupPeriodButtons() {
  const periodButtons = document.querySelectorAll(".period-btn");
  periodButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      periodButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentPeriod = btn.dataset.period;
      loadDashboardData();
    });
  });
}

// MAIN POINT: Setup action buttons (export and back)
function setupActionButtons() {
  document.getElementById("exportBtn").addEventListener("click", exportData);
  document.getElementById("backBtn").addEventListener("click", () => {
    // MAIN POINT: Close current tab and return focus to popup
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.remove(tab.id);
    });
  });
}

// MAIN POINT: Load and display all dashboard data
async function loadDashboardData() {
  try {
    // MAIN POINT: Fetch tracking sessions from storage
    const storage = await chrome.storage.local.get("sessions");
    const sessions = storage.sessions || [];

    // MAIN POINT: Filter sessions based on selected time period
    const filteredSessions = filterSessionsByPeriod(sessions, currentPeriod);

    // MAIN POINT: Calculate all statistics and metrics
    const stats = calculateStats(filteredSessions);
    const websiteData = aggregateWebsiteData(filteredSessions);

    // MAIN POINT: Update UI with calculated data
    updateHeaderStats(stats);
    updateWebsitesTable(websiteData);
    updateProductivityChart(stats);
    updateDailyActivityChart(filteredSessions);
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

// MAIN POINT: Filter sessions based on selected time period
function filterSessionsByPeriod(sessions, period) {
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      // MAIN POINT: Get start of this week (Monday)
      startDate.setDate(now.getDate() - now.getDay() + 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "month":
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "all":
      startDate = new Date(0);
      break;
  }

  return sessions.filter((session) => new Date(session.timestamp) >= startDate);
}

// MAIN POINT: Calculate comprehensive statistics from sessions
function calculateStats(sessions) {
  let stats = {
    productive: 0,
    unproductive: 0,
    neutral: 0,
    total: 0,
  };

  // MAIN POINT: Sum time in each category
  sessions.forEach((session) => {
    stats.total += session.timeSpent;
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

// MAIN POINT: Aggregate data by website for table display
function aggregateWebsiteData(sessions) {
  const websiteMap = {};

  sessions.forEach((session) => {
    if (!websiteMap[session.domain]) {
      websiteMap[session.domain] = {
        domain: session.domain,
        timeSpent: 0,
        visits: 0,
        type: session.classification.type,
      };
    }
    websiteMap[session.domain].timeSpent += session.timeSpent;
    websiteMap[session.domain].visits += 1;
  });

  // MAIN POINT: Sort by time spent (descending)
  return Object.values(websiteMap).sort((a, b) => b.timeSpent - a.timeSpent);
}

// MAIN POINT: Update header statistics display
function updateHeaderStats(stats) {
  document.getElementById("totalTime").textContent = formatTime(stats.total);
  document.getElementById("websitesCount").textContent = "0";

  // MAIN POINT: Calculate overall productivity score
  const totalTime = stats.total;
  let score = 0;
  if (totalTime > 0) {
    score = Math.round(
      (stats.productive * 100 + stats.neutral * 50) / (totalTime * 100),
    );
  }

  document.getElementById("overallScore").textContent =
    Math.min(100, score) + "%";
  document.getElementById("avgRating").textContent =
    (score / 10).toFixed(1) + "/10";
}

// MAIN POINT: Update websites table with sorted data
function updateWebsitesTable(websiteData) {
  const tbody = document.getElementById("websitesTableBody");
  tbody.innerHTML = "";

  if (websiteData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="no-data">No data available</td></tr>';
    return;
  }

  // MAIN POINT: Add row for each website with time, visits, and type
  websiteData.forEach((website) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><strong>${website.domain}</strong></td>
            <td>${formatTime(website.timeSpent)}</td>
            <td>${website.visits} visits</td>
            <td><span class="badge ${website.type}">${website.type}</span></td>
        `;
    tbody.appendChild(row);
  });

  document.getElementById("websitesCount").textContent = websiteData.length;
}

// MAIN POINT: Draw pie chart for productivity breakdown
function updateProductivityChart(stats) {
  const canvas = document.getElementById("productivityChart");
  const ctx = canvas.getContext("2d");
  const total = stats.total || 1;

  // MAIN POINT: Calculate percentages
  const prodPercent = Math.round((stats.productive / total) * 100);
  const unprodPercent = Math.round((stats.unproductive / total) * 100);
  const neutralPercent = Math.round((stats.neutral / total) * 100);

  // MAIN POINT: Update legend with percentages
  document.getElementById("prodPercent").textContent = prodPercent + "%";
  document.getElementById("unprodPercent").textContent = unprodPercent + "%";
  document.getElementById("neutralPercent").textContent = neutralPercent + "%";

  // MAIN POINT: Simple pie chart drawing
  drawPieChart(ctx, canvas, [
    { value: stats.productive, color: "#4CAF50" },
    { value: stats.unproductive, color: "#F44336" },
    { value: stats.neutral, color: "#2196F3" },
  ]);
}

// MAIN POINT: Draw daily activity bar chart
function updateDailyActivityChart(sessions) {
  const canvas = document.getElementById("dailyActivityChart");
  const ctx = canvas.getContext("2d");

  // MAIN POINT: Aggregate sessions by date for daily chart
  const dailyData = aggregateDailyData(sessions);

  // MAIN POINT: Draw bar chart showing daily activity
  drawBarChart(ctx, canvas, dailyData);
}

// MAIN POINT: Helper function to aggregate sessions by day
function aggregateDailyData(sessions) {
  const dailyMap = {};

  sessions.forEach((session) => {
    const date = new Date(session.timestamp).toDateString();
    if (!dailyMap[date]) {
      dailyMap[date] = { date: date, time: 0 };
    }
    dailyMap[date].time += session.timeSpent;
  });

  return Object.values(dailyMap).sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
}

// MAIN POINT: Simple pie chart drawing function
function drawPieChart(ctx, canvas, data) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;

  let currentAngle = -Math.PI / 2;

  data.forEach((item) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;

    // MAIN POINT: Draw slice
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    currentAngle += sliceAngle;
  });
}

// MAIN POINT: Simple bar chart drawing function
function drawBarChart(ctx, canvas, data) {
  if (data.length === 0) return;

  const maxValue = Math.max(...data.map((d) => d.time));
  const barWidth = canvas.width / data.length;
  const padding = 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // MAIN POINT: Draw bars for each day
  data.forEach((item, index) => {
    const barHeight = (item.time / maxValue) * (canvas.height - 40);
    const x = index * barWidth + padding;
    const y = canvas.height - barHeight - 20;

    ctx.fillStyle = "#2196F3";
    ctx.fillRect(x, y, barWidth - padding, barHeight);

    // MAIN POINT: Draw label with time in hours
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      (item.time / 3600).toFixed(1) + "h",
      x + barWidth / 2,
      canvas.height - 5,
    );
  });
}

// MAIN POINT: Export all tracking data as JSON
function exportData() {
  chrome.storage.local.get("sessions", (storage) => {
    const sessions = storage.sessions || [];
    const dataStr = JSON.stringify(sessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    // MAIN POINT: Create download link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `time-tracker-data-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });
}

// MAIN POINT: Utility function to format seconds into readable time
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
