# ⏱️ Time Tracker & Productivity Analytics Chrome Extension

A powerful Chrome extension that tracks your browsing time and provides detailed productivity analytics with AI-powered recommendations.

## ✨ Features

### Core Tracking

- **Real-time Website Tracking**: Automatically tracks time spent on each website
- **Smart Classification**: Categorizes websites as Productive, Unproductive, or Neutral
- **Activity Detection**: Monitors user interactions (mouse, keyboard, scroll)
- **Session Management**: Maintains detailed session history with timestamps

### Analytics Dashboard

- **Comprehensive Statistics**: View total time tracked, website counts, and productivity scores
- **Visual Charts**: Pie charts for productivity breakdown and bar charts for daily activity
- **Website Breakdown Table**: Detailed view of all visited websites with visit counts
- **Time Period Filtering**: Filter data by Today, This Week, This Month, or All Time
- **Data Export**: Export tracking data as JSON for external analysis

### Weekly Reports

- **Executive Summary**: Weekly productivity score with performance feedback
- **Daily Breakdown**: Shows productivity for each day of the week
- **Top Websites**: Lists most visited sites and time spent
- **Detailed Statistics**: Breakdown of productive vs unproductive time
- **Smart Recommendations**: AI-powered suggestions to improve productivity
- **Print & Email**: Export reports for sharing or archiving

### Popup Widget

- **Quick Stats**: See today's productivity metrics at a glance
- **Current Website**: Know what site you're currently tracking
- **Real-time Scoring**: Live productivity score calculation (0-100%)
- **Quick Actions**: Fast access to dashboard, reports, and data management

## 🚀 Installation

### Manual Installation (Developer Mode)

1. **Download the extension files** to a folder on your computer
2. **Open Chrome and navigate to** `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top right corner)
4. **Click "Load unpacked"** and select the extension folder
5. **Done!** The extension will appear in your Chrome toolbar

### Using the Extension

1. **Click the Time Tracker icon** in your Chrome toolbar
2. **View real-time statistics** in the popup
3. **Access the dashboard** for detailed analytics
4. **Check weekly reports** for insights and recommendations
5. **Clear data** anytime from the popup menu

## 📊 Website Classification

### Productive Sites (High Score)

- `github.com` - Version control and code hosting
- `stackoverflow.com` - Programming Q&A
- `developer.mozilla.org` - Web development documentation
- `udemy.com`, `coursera.org` - Online learning platforms
- `freecodecamp.org` - Coding education

### Unproductive Sites (Low Score)

- `facebook.com`, `instagram.com` - Social media
- `netflix.com` - Video streaming
- `tiktok.com` - Short-form video content

### Custom Classification

The extension learns from your usage patterns and can be configured with custom website categories through the settings.

## 🔧 Technical Architecture

### Files Overview

```
time-tracker-extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker (main tracker)
├── popup.html            # Popup widget UI
├── popup.js              # Popup logic and real-time updates
├── dashboard.html        # Analytics dashboard page
├── dashboard.js          # Dashboard data visualization
├── report.html           # Weekly report page
├── report.js             # Report generation and recommendations
├── content.js            # Content script for webpage interaction
├── utils.js              # Shared utility functions
└── styles.css            # Complete styling for all pages
```

### Data Storage

- Uses **Chrome's local storage** (`chrome.storage.local`)
- Stores sessions with: domain, time spent, classification, timestamp, and metadata
- No data is sent to external servers (fully privacy-respecting)

### Key Algorithms

#### Productivity Score Calculation

```
Score = (Productive_Time × 100 + Neutral_Time × 50) / (Total_Time × 100)
```

#### Website Classification

- Each site has a score (0-5)
- Productive: score ≥ 3
- Unproductive: score < 2
- Neutral: score = 2-3

#### Session Tracking

- Captures tab switches, URL changes, and tab closures
- Records time spent in seconds with high precision
- Automatically categorizes based on domain

## 📈 Metrics Tracked

### Per Session

- `domain` - Website domain
- `title` - Page title
- `timeSpent` - Duration in seconds
- `timestamp` - Session start time
- `classification` - Productivity type and score

### Daily Aggregates

- Total time per category
- Number of websites visited
- Daily productivity score
- Most visited websites

### Weekly Reports

- Average daily time tracked
- Productivity trends
- Top 10 websites
- Performance recommendations

## 🎯 Productivity Score Interpretation

- **80-100%**: Excellent productivity! 🌟
- **60-79%**: Good progress! Keep improving
- **40-59%**: Room for improvement
- **0-39%**: Focus on productive activities

## 🔐 Privacy & Security

- ✅ **All data stored locally** - No cloud sync
- ✅ **No user tracking** - Extension doesn't track you
- ✅ **No data sharing** - Nothing sent to servers
- ✅ **Transparent tracking** - You can see exactly what's tracked
- ✅ **Easy data deletion** - Clear button to wipe all data

## 📱 Browser Compatibility

- **Chrome**: 90+
- **Edge**: 90+ (Chromium-based)
- **Brave**: Full support
- **Opera**: Full support

## 🎨 Customization

### Modifying Categories

Edit the `PRODUCTIVE_SITES` and `UNPRODUCTIVE_SITES` objects in `background.js` to customize website classifications.

### Changing Colors

Update CSS variables in `styles.css`:

```css
--color-productive: #4caf50;
--color-unproductive: #f44336;
--color-neutral: #2196f3;
```

## 🐛 Troubleshooting

### Extension not tracking?

1. Ensure extension is enabled in `chrome://extensions/`
2. Refresh your browser tabs
3. Check the console for errors (F12)

### Data not showing?

1. Spend 1+ second on websites to create sessions
2. Check storage: right-click pop-up → Inspect → Application → Storage
3. Ensure popup and dashboard are opened after browsing

### High CPU usage?

1. Reduce activity check interval in content.js
2. Clear old data regularly
3. Restart browser

## 🚀 Future Enhancements

- [ ] Goal setting and alerts
- [ ] Website blocking during work hours
- [ ] Browser sync across devices
- [ ] Cloud backup option
- [ ] Pomodoro timer integration
- [ ] Slack/Teams notifications
- [ ] Mobile app integration
- [ ] Machine learning recommendations

## 📝 Development

### Debug Mode

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Service Worker" under Time Tracker
4. Open DevTools (F12) in the popup
5. View console logs for debugging

### Testing

1. Open the popup to verify real-time updates
2. Navigate different websites to test tracking
3. Open dashboard to check data visualization
4. Generate reports to verify calculations

## 📄 License

This extension is provided as-is for personal productivity use.

## 🤝 Support

For issues or feature requests, document:

1. Steps to reproduce
2. Expected vs actual behavior
3. Browser version
4. Data from `chrome://extensions/` details page

## 📞 Contact

For questions about this extension, refer to the documentation within the code comments marked with **MAIN POINT** for key functionality explanations.

---

**Happy Tracking!** Monitor your time, boost your productivity, and achieve your goals! 🎯
