// ============================================
// BACKGROUND SERVICE WORKER - Time Tracker Core
// ============================================
// MAIN POINT: This script runs continuously in the background to monitor active tabs
// and track time spent on each website

// MAIN POINT: Dictionary of productive and unproductive websites for classification
const PRODUCTIVE_SITES = {
  "github.com": 5,
  "leetcode.com": 5,
  "stackoverflow.com": 4,
  "developer.mozilla.org": 5,
  "w3schools.com": 4,
  "youtube.com": 2,
  "udemy.com": 5,
  "coursera.org": 5,
  "freecodecamp.org": 5,
};

const UNPRODUCTIVE_SITES = {
  "facebook.com": 0,
  "instagram.com": 0,
  "twitter.com": 1,
  "tiktok.com": 0,
  "reddit.com": 1,
  "linkedin.com": 2,
  "youtube.com": 2,
  "netflix.com": 0,
  "twitch.tv": 1,
};

// MAIN POINT: Track the currently active tab and time spent
let currentTab = null;
let trackingStartTime = null;

// MAIN POINT: When a tab becomes active, start tracking time on it
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // Save time from previous tab before switching
  if (currentTab !== null) {
    await saveTimeTracking(currentTab);
  }

  // MAIN POINT: Get the tab URL and start tracking new tab
  const tab = await chrome.tabs.get(activeInfo.tabId);
  currentTab = activeInfo.tabId;
  trackingStartTime = Date.now();
});

// MAIN POINT: When tab URL is updated, track the new URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tabId === currentTab) {
    trackingStartTime = Date.now();
  }
});

// MAIN POINT: When tab is closed, save the tracking data before removing
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (tabId === currentTab) {
    await saveTimeTracking(currentTab);
    currentTab = null;
    trackingStartTime = null;
  }
});

// MAIN POINT: Function to extract domain from URL for website identification
function getDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch (e) {
    return "unknown";
  }
}

// MAIN POINT: Function to classify websites as productive or unproductive
function classifyWebsite(domain) {
  // MAIN POINT: Priority: Check if in productive list first
  if (PRODUCTIVE_SITES[domain]) {
    return {
      type: "productive",
      score: PRODUCTIVE_SITES[domain],
    };
  }

  // MAIN POINT: Check if in unproductive list
  if (UNPRODUCTIVE_SITES[domain]) {
    return {
      type: "unproductive",
      score: UNPRODUCTIVE_SITES[domain],
    };
  }

  // MAIN POINT: Default classification for unknown sites (neutral)
  return {
    type: "neutral",
    score: 3,
  };
}

// MAIN POINT: Save time tracking data to Chrome storage
async function saveTimeTracking(tabId) {
  if (!trackingStartTime || !currentTab) return;

  try {
    const tab = await chrome.tabs.get(tabId);
    const timeSpent = Math.floor((Date.now() - trackingStartTime) / 1000); // In seconds

    // MAIN POINT: Only save if user spent at least 1 second on the tab
    if (timeSpent < 1) return;

    const domain = getDomainFromUrl(tab.url);
    const classification = classifyWebsite(domain);

    // MAIN POINT: Get existing data from storage
    const storage = await chrome.storage.local.get("sessions");
    const sessions = storage.sessions || [];

    // MAIN POINT: Create a new session record with all tracking details
    const newSession = {
      id: Date.now(),
      domain: domain,
      title: tab.title || "Untitled",
      url: tab.url,
      timeSpent: timeSpent,
      timestamp: new Date().toISOString(),
      classification: classification,
    };

    sessions.push(newSession);

    // MAIN POINT: Save updated sessions to Chrome storage
    await chrome.storage.local.set({ sessions: sessions });
  } catch (error) {
    console.error("Error saving tracking data:", error);
  }
}

// MAIN POINT: Check if tab is in focus at regular intervals to ensure data accuracy
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0) {
    currentTab = tabs[0].id;
    trackingStartTime = Date.now();
  }
});

console.log("Background service worker is running...");
