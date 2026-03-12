# Quick Start Guide - Time Tracker Extension

## 📦 Installation Steps

### Step 1: Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Turn ON **"Developer mode"** (toggle at top right)
3. Click **"Load unpacked"**
4. Select the `time-tracker-extension` folder
5. Done! You should see the extension icon in your toolbar

### Step 2: Start Tracking

1. Click the **Time Tracker icon** ⏱️ in your toolbar
2. Start browsing normally - the extension automatically tracks your activities
3. Watch the real-time stats in the popup

### Step 3: View Analytics

- **Popup Widget**: See quick stats at a glance (click extension icon)
- **Full Dashboard**: Click "View Dashboard" button to see detailed analytics
- **Weekly Report**: Click "Weekly Report" for insights and recommendations

## 🎯 Main Features at a Glance

| Feature                 | Location                  | Purpose                         |
| ----------------------- | ------------------------- | ------------------------------- |
| **Real-time Popup**     | Extension icon → Popup    | Quick overview of current stats |
| **Analytics Dashboard** | Popup → "View Dashboard"  | Detailed breakdown by website   |
| **Weekly Report**       | Popup → "Weekly Report"   | Summary and recommendations     |
| **Data Export**         | Dashboard → "Export Data" | Download data as JSON           |
| **Clear Data**          | Popup → "Clear Data"      | Remove all tracking history     |

## 📊 Understanding the Metrics

### Productivity Score (0-100%)

- Based on time spent on productive vs unproductive sites
- Higher = more productive browsing
- Updates in real-time as you browse

### Website Categories

- **🟢 Productive**: GitHub, Stack Overflow, Dev docs, Learning platforms
- **🔴 Unproductive**: Social media, Netflix, TikTok
- **🔵 Neutral**: Anything else (News, Shopping, etc.)

## 🔍 What Gets Tracked

✅ **Tracked:**

- Website domain and title
- Time spent (in seconds)
- When you visited (timestamp)
- Activity (scrolling, typing, mouse movement)

❌ **NOT Tracked:**

- Page content
- Passwords
- Cookies
- Personal information
- Any data is sent to servers

## 💾 Data Management

### View Your Data

1. Open Chrome DevTools (F12)
2. Go to **Application → Storage → Local Storage**
3. Find "chrome-extension://..."
4. Look for "sessions" key to see all tracked data

### Backup Your Data

1. Click extension icon → "Weekly Report" → "Export Data"
2. Your data will download as JSON file

### Delete Your Data

1. Click extension icon → "Clear Data"
2. Confirm deletion
3. All historical data will be removed

## 🎨 Customizing Website Categories

### To add/change a website classification:

**Edit `background.js` (around line 10-30):**

```javascript
const PRODUCTIVE_SITES = {
  "github.com": 5, // Your productive sites
  "stackoverflow.com": 4,
  "myworksite.com": 5, // Add custom sites here
};

const UNPRODUCTIVE_SITES = {
  "facebook.com": 0, // Your unproductive sites
  "instagram.com": 0,
  "myprocrastinatesite.com": 0, // Add custom sites
};
```

**Score meanings:**

- 5 = Highly productive
- 4-3 = Productive
- 2 = Neutral
- 1 = Somewhat unproductive
- 0 = Very unproductive

**After editing:**

1. Go to `chrome://extensions/`
2. Click the refresh icon under Time Tracker
3. Data will start using new categories

## 📈 Daily Workflow

### Morning

1. Click extension icon
2. Check yesterday's productivity score
3. Set initial expectations for the day

### During Work

- Extension tracks automatically
- No need to do anything
- Works silently in background

### End of Day

1. Check popup for daily summary
2. Note which sites took most time
3. Plan improvements for tomorrow

### Weekly Review

1. Click "Weekly Report"
2. Review productivity trends
3. Read recommendations
4. Print/export if needed

## 🐛 Common Issues & Solutions

| Problem                         | Solution                                          |
| ------------------------------- | ------------------------------------------------- |
| **Extension not showing stats** | Refresh browser tab, must spend 1+ sec per site   |
| **Popup shows "No data"**       | Close/reopen popup, wait 5 seconds after browsing |
| **Dashboard is blank**          | Click refresh button, ensure you've browsed       |
| **Can't load extension**        | Check Developer mode is ON, file path is correct  |
| **High RAM usage**              | This is normal, close unused tabs                 |

## 🔐 Privacy Checklist

✅ All data stays on your computer
✅ No cloud synchronization
✅ No data sharing with anyone
✅ Can delete all data anytime
✅ Open source - inspect code yourself
✅ No ads or tracking pixels
✅ Works offline

## 📞 Need Help?

### Check the Code

- Comments marked with **// MAIN POINT:** explain key functionality
- Each file has detailed documentation
- Read the full `README.md` for technical details

### Debug Console

1. Right-click popup → Inspect
2. Go to Console tab
3. See detailed logs of extension behavior
4. Report any errors you see

## 🎯 Tips for Better Productivity

1. **Review Weekly Reports** - Understand your patterns
2. **Block Unproductive Sites** - During focus hours
3. **Set Goals** - Aim for 80%+ productivity score
4. **Track Trends** - Look for improvements over time
5. **Adjust Categories** - Customize for your work style

## 📚 File Documentation

Each file has **MAIN POINT** comments explaining:

- What the code does
- Why it's important
- How it contributes to tracking

Examples:

- `background.js` - Core tracking logic
- `popup.js` - Real-time stats display
- `dashboard.js` - Analytics visualization
- `report.js` - Weekly insights
- `styles.css` - All UI styling

---

**Ready to track your time? Start now!** 🚀

Click the extension icon and watch your productivity data come to life!
