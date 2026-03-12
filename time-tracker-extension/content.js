// ============================================
// CONTENT SCRIPT - Web Page Injection
// ============================================
// MAIN POINT: This script runs on web pages to track user engagement and interactions

// MAIN POINT: Track when user interacts with the page (mouse, keyboard, scroll)
let lastActivityTime = Date.now();
let isPageActive = true;

document.addEventListener("mousemove", () => {
  lastActivityTime = Date.now();
  isPageActive = true;
});

document.addEventListener("keydown", () => {
  lastActivityTime = Date.now();
  isPageActive = true;
});

document.addEventListener("scroll", () => {
  lastActivityTime = Date.now();
  isPageActive = true;
});

// MAIN POINT: Detect when tab loses focus (user is inactive)
window.addEventListener("blur", () => {
  isPageActive = false;
});

window.addEventListener("focus", () => {
  isPageActive = true;
  lastActivityTime = Date.now();
});

// MAIN POINT: Periodically check for inactivity and notify background script
setInterval(() => {
  const inactivityDuration = Date.now() - lastActivityTime;

  // MAIN POINT: Consider user inactive after 5 minutes of no interaction
  if (inactivityDuration > 5 * 60 * 1000) {
    isPageActive = false;
  }

  // MAIN POINT: Send activity status to background script
  chrome.runtime
    .sendMessage({
      action: "updateActivityStatus",
      isActive: isPageActive,
    })
    .catch(() => {
      // Connection might not exist, ignore error
    });
}, 10000); // Check every 10 seconds

// MAIN POINT: Detect and categorize webpage content for better analytics
function analyzePageContent() {
  const title = document.title;
  const url = window.location.href;
  const keywords = extractKeywords();

  return {
    title: title,
    url: url,
    keywords: keywords,
    language: document.documentElement.lang || "en",
  };
}

// MAIN POINT: Extract relevant keywords from page content
function extractKeywords() {
  const metaTags = document.querySelectorAll('meta[name="keywords"]');
  const keywords = [];

  metaTags.forEach((tag) => {
    const content = tag.getAttribute("content");
    if (content) {
      keywords.push(...content.split(",").map((k) => k.trim()));
    }
  });

  return keywords;
}

// MAIN POINT: Detect if page contains coding/development related content
function isDevPage() {
  const devKeywords = [
    "code",
    "programming",
    "javascript",
    "python",
    "java",
    "debug",
    "algorithm",
    "data",
  ];
  const pageText = document.body.innerText.toLowerCase();

  return devKeywords.some((keyword) => pageText.includes(keyword));
}

// MAIN POINT: Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageInfo") {
    // MAIN POINT: Return page information to background script
    sendResponse({
      title: document.title,
      url: window.location.href,
      isActive: isPageActive,
      isDeveloperPage: isDevPage(),
    });
  }
});

console.log("Content script loaded for:", window.location.hostname);
