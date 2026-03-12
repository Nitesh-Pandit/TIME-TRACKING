// ============================================
// UTILITIES - Shared Helper Functions
// ============================================
// MAIN POINT: Common utility functions used across the extension

// MAIN POINT: Format seconds into human-readable time format
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

// MAIN POINT: Extract domain from a given URL
function getDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch (e) {
    return "unknown";
  }
}

// MAIN POINT: Get the start and end dates of the current week
function getWeekRange() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
}

// MAIN POINT: Check if a date is today
function isToday(date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// MAIN POINT: Get the start of the current day
function getStartOfDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// MAIN POINT: Get the end of the current day
function getEndOfDay() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
}

// MAIN POINT: Format a date to readable string (e.g., "Monday, March 10")
function formatDate(date) {
  const options = { weekday: "long", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// MAIN POINT: Calculate average time per day for a period
function calculateAverageDailyTime(sessions) {
  const dayMap = {};

  sessions.forEach((session) => {
    const date = new Date(session.timestamp).toDateString();
    if (!dayMap[date]) {
      dayMap[date] = 0;
    }
    dayMap[date] += session.timeSpent;
  });

  const days = Object.values(dayMap);
  if (days.length === 0) return 0;

  const total = days.reduce((sum, time) => sum + time, 0);
  return Math.round(total / days.length);
}

// MAIN POINT: Sort websites by time spent (descending)
function sortWebsitesByTime(websiteMap) {
  return Object.values(websiteMap).sort((a, b) => b.timeSpent - a.timeSpent);
}

// MAIN POINT: Export data to CSV format
function exportToCSV(sessions) {
  let csv = "Domain,Title,Time Spent (seconds),Timestamp,Classification\n";

  sessions.forEach((session) => {
    csv += `"${session.domain}","${session.title}",${session.timeSpent},"${session.timestamp}","${session.classification.type}"\n`;
  });

  return csv;
}

// MAIN POINT: Extract top N items from an array
function getTopItems(arr, count) {
  return arr.slice(0, count);
}

// MAIN POINT: Calculate percentage
function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// MAIN POINT: Debounce function to prevent excessive function calls
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// MAIN POINT: Local storage helper to set data with optional expiration
function setStorageItem(key, value, expiryHours = null) {
  const item = {
    value: value,
    timestamp: Date.now(),
  };

  if (expiryHours) {
    item.expiry = Date.now() + expiryHours * 60 * 60 * 1000;
  }

  localStorage.setItem(key, JSON.stringify(item));
}

// MAIN POINT: Local storage helper to get data and check expiration
function getStorageItem(key) {
  const item = localStorage.getItem(key);

  if (!item) return null;

  try {
    const parsed = JSON.parse(item);

    // MAIN POINT: Check if item has expired
    if (parsed.expiry && Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch (e) {
    return null;
  }
}

// MAIN POINT: Get color based on classification type
function getColorForType(type) {
  const colors = {
    productive: "#4CAF50",
    unproductive: "#F44336",
    neutral: "#2196F3",
  };
  return colors[type] || "#9E9E9E";
}

// MAIN POINT: Format currency for potential monetization features
function formatCurrency(cents) {
  const dollars = (cents / 100).toFixed(2);
  return `$${dollars}`;
}

console.log("Utils loaded successfully");
