// ============================================
// WEEKLY REPORT SCRIPT - Report Generation
// ============================================
// MAIN POINT: This script generates and displays the weekly productivity report with insights

// MAIN POINT: Initialize report when page loads
document.addEventListener("DOMContentLoaded", () => {
  generateReport();
  setupActionButtons();
});

// MAIN POINT: Generate complete weekly report with all statistics
async function generateReport() {
  try {
    // MAIN POINT: Fetch all tracking data from storage
    const storage = await chrome.storage.local.get("sessions");
    const sessions = storage.sessions || [];

    // MAIN POINT: Filter sessions for the current week
    const weekSessions = getWeekSessions(sessions);

    // MAIN POINT: Calculate all metrics and statistics
    const weekStats = calculateWeekStats(weekSessions);
    const dailyStats = calculateDailyStats(weekSessions);
    const topWebsites = getTopWebsites(weekSessions, 10);

    // MAIN POINT: Update all report sections with calculated data
    updateWeeklyScore(weekStats);
    updateDailyBreakdown(dailyStats);
    updateTopWebsitesTable(topWebsites);
    updateDetailedStats(weekStats);
    generateRecommendations(weekStats, topWebsites);
  } catch (error) {
    console.error("Error generating report:", error);
  }
}

// MAIN POINT: Filter sessions for current week (Monday to Sunday)
function getWeekSessions(sessions) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // MAIN POINT: Set report date range in header
  const dateStr = startOfWeek.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  document.getElementById("reportDate").textContent = `Week of ${dateStr}`;

  return sessions.filter((session) => {
    const sessionDate = new Date(session.timestamp);
    return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
  });
}

// MAIN POINT: Calculate comprehensive statistics for the week
function calculateWeekStats(sessions) {
  let stats = {
    productive: 0,
    unproductive: 0,
    neutral: 0,
    totalSessions: sessions.length,
  };

  // MAIN POINT: Sum up time in each category
  sessions.forEach((session) => {
    if (session.classification.type === "productive") {
      stats.productive += session.timeSpent;
    } else if (session.classification.type === "unproductive") {
      stats.unproductive += session.timeSpent;
    } else {
      stats.neutral += session.timeSpent;
    }
  });

  stats.total = stats.productive + stats.unproductive + stats.neutral;

  return stats;
}

// MAIN POINT: Calculate statistics for each day of the week
function calculateDailyStats(sessions) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);

  const dailyStats = {};
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // MAIN POINT: Initialize stats for each day
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = date.toDateString();

    dailyStats[dateStr] = {
      day: days[i],
      date: dateStr,
      productive: 0,
      unproductive: 0,
      neutral: 0,
      total: 0,
    };
  }

  // MAIN POINT: Aggregate sessions by date into daily stats
  sessions.forEach((session) => {
    const sessionDate = new Date(session.timestamp).toDateString();
    if (dailyStats[sessionDate]) {
      dailyStats[sessionDate].total += session.timeSpent;
      if (session.classification.type === "productive") {
        dailyStats[sessionDate].productive += session.timeSpent;
      } else if (session.classification.type === "unproductive") {
        dailyStats[sessionDate].unproductive += session.timeSpent;
      } else {
        dailyStats[sessionDate].neutral += session.timeSpent;
      }
    }
  });

  return Object.values(dailyStats);
}

// MAIN POINT: Get top websites by time spent
function getTopWebsites(sessions, limit) {
  const websiteMap = {};

  // MAIN POINT: Aggregate time by website
  sessions.forEach((session) => {
    if (!websiteMap[session.domain]) {
      websiteMap[session.domain] = {
        domain: session.domain,
        timeSpent: 0,
        type: session.classification.type,
      };
    }
    websiteMap[session.domain].timeSpent += session.timeSpent;
  });

  // MAIN POINT: Sort by time spent and return top results
  return Object.values(websiteMap)
    .sort((a, b) => b.timeSpent - a.timeSpent)
    .slice(0, limit);
}

// MAIN POINT: Update weekly productivity score and provide commentary
function updateWeeklyScore(stats) {
  const total = stats.total || 1;

  // MAIN POINT: Calculate productivity score (0-100)
  const score = Math.round(
    (stats.productive * 100 + stats.neutral * 50) / (total * 100),
  );
  const finalScore = Math.min(100, Math.max(0, score));

  document.getElementById("weeklyScore").textContent = finalScore + "%";

  // MAIN POINT: Provide feedback based on score
  let comment = "";
  if (finalScore >= 80) {
    comment = "🌟 Excellent! Keep up the great work!";
  } else if (finalScore >= 60) {
    comment = "👍 Good progress! You can improve further.";
  } else if (finalScore >= 40) {
    comment = "⚠️ Room for improvement. Try reducing distractions.";
  } else {
    comment = "❌ Low productivity. Focus on productive activities.";
  }

  document.getElementById("scoreComment").textContent = comment;
  document.getElementById("totalHours").textContent =
    Math.round(stats.total / 3600) + "h";
}

// MAIN POINT: Display daily breakdown chart showing productivity for each day
function updateDailyBreakdown(dailyStats) {
  const container = document.getElementById("dailyBreakdown");
  container.innerHTML = "";

  dailyStats.forEach((dayData) => {
    const dayElement = document.createElement("div");
    dayElement.className = "daily-item";

    const total = dayData.total || 1;
    const prodPercent = ((dayData.productive / total) * 100).toFixed(0);

    dayElement.innerHTML = `
            <div class="day-header">
                <span class="day-name">${dayData.day}</span>
                <span class="day-score">${Number(prodPercent)}% productive</span>
            </div>
            <div class="progress-bar">
                <div class="bar-segment productive" style="width: ${(dayData.productive / total) * 100}%"></div>
                <div class="bar-segment neutral" style="width: ${(dayData.neutral / total) * 100}%"></div>
                <div class="bar-segment unproductive" style="width: ${(dayData.unproductive / total) * 100}%"></div>
            </div>
            <span class="day-time">${formatTime(dayData.total)}</span>
        `;

    container.appendChild(dayElement);
  });
}

// MAIN POINT: Populate top websites table
function updateTopWebsitesTable(websites) {
  const tbody = document.getElementById("topWebsitesBody");
  tbody.innerHTML = "";

  if (websites.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="no-data">No data available</td></tr>';
    return;
  }

  // MAIN POINT: Find the most productive day from websites
  const bestDays = websites.filter((w) => w.type === "productive").slice(0, 3);

  if (bestDays.length > 0) {
    document.getElementById("bestDay").textContent = bestDays[0].domain;
  }

  // MAIN POINT: Add row for each website
  websites.forEach((website, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${website.domain}</strong></td>
            <td>${formatTime(website.timeSpent)}</td>
            <td><span class="badge ${website.type}">${website.type}</span></td>
        `;
    tbody.appendChild(row);
  });

  document.getElementById("totalWebsites").textContent = websites.length;
}

// MAIN POINT: Update detailed statistics section
function updateDetailedStats(stats) {
  const total = stats.total || 1;

  const prodHours = Math.floor(stats.productive / 3600);
  const unprodHours = Math.floor(stats.unproductive / 3600);
  const neutralHours = Math.floor(stats.neutral / 3600);

  const prodPercent = ((stats.productive / total) * 100).toFixed(1);
  const unprodPercent = ((stats.unproductive / total) * 100).toFixed(1);
  const neutralPercent = ((stats.neutral / total) * 100).toFixed(1);

  document.getElementById("prodTimeReport").textContent = prodHours + "h";
  document.getElementById("unprodTimeReport").textContent = unprodHours + "h";
  document.getElementById("neutralTimeReport").textContent = neutralHours + "h";

  document.getElementById("prodPercentReport").textContent = prodPercent + "%";
  document.getElementById("unprodPercentReport").textContent =
    unprodPercent + "%";
  document.getElementById("neutralPercentReport").textContent =
    neutralPercent + "%";
}

// MAIN POINT: Generate personalized recommendations based on weekly activity
function generateRecommendations(stats, topWebsites) {
  const recommendations = [];
  const total = stats.total || 1;
  const prodPercent = (stats.productive / total) * 100;

  // MAIN POINT: Rule-based recommendations based on productivity data
  if (prodPercent < 50) {
    recommendations.push(
      "💡 Try to spend more time on productive sites like GitHub and Stack Overflow",
    );
  }

  if (stats.unproductive > stats.productive) {
    recommendations.push(
      "⏰ Consider using website blockers during work hours",
    );
  }

  if (stats.productive > stats.unproductive * 2) {
    recommendations.push(
      "🎉 Excellent productivity ratio! Maintain this momentum",
    );
  }

  // MAIN POINT: Check for high unproductive site usage
  const unproductiveSites = topWebsites.filter(
    (w) => w.type === "unproductive",
  );
  if (unproductiveSites.length > 0) {
    recommendations.push(
      `⚠️ You spent ${formatTime(unproductiveSites[0].timeSpent)} on ${unproductiveSites[0].domain}. Consider limiting this.`,
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "✅ Great job! Keep maintaining a healthy browsing habit",
    );
  }

  // MAIN POINT: Display recommendations list
  const recList = document.getElementById("recommendationsList");
  recList.innerHTML = "";
  recommendations.forEach((rec) => {
    const li = document.createElement("li");
    li.textContent = rec;
    recList.appendChild(li);
  });
}

// MAIN POINT: Setup action buttons
function setupActionButtons() {
  document.getElementById("printBtn").addEventListener("click", () => {
    // MAIN POINT: Print the report using browser's print dialog
    window.print();
  });

  document.getElementById("emailBtn").addEventListener("click", () => {
    // MAIN POINT: Generate mailto link with report data
    generateEmailReport();
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    // MAIN POINT: Return to previous page
    window.history.back();
  });
}

// MAIN POINT: Generate email with report summary
function generateEmailReport() {
  chrome.storage.local.get("sessions", (storage) => {
    const sessions = storage.sessions || [];
    const weekSessions = getWeekSessions(sessions);
    const stats = calculateWeekStats(weekSessions);

    const emailBody = `
Weekly Productivity Report

Productivity Score: ${calculateScore(stats)}%
Total Time Tracked: ${Math.round(stats.total / 3600)}h

Breakdown:
- Productive: ${formatTime(stats.productive)}
- Unproductive: ${formatTime(stats.unproductive)}
- Neutral: ${formatTime(stats.neutral)}

This report was generated by Time Tracker Extension.
`;

    const mailtoLink = `mailto:?subject=Weekly Productivity Report&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  });
}

// MAIN POINT: Helper function to calculate productivity score
function calculateScore(stats) {
  const total = stats.total || 1;
  const score = Math.round(
    (stats.productive * 100 + stats.neutral * 50) / (total * 100),
  );
  return Math.min(100, Math.max(0, score));
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
