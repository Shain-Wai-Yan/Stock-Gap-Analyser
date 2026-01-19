# Quick Start Guide

Get your Stock Gap Analysis Tool running in 5 minutes!

## Step 1: Install Dependencies (30 seconds)

```bash
npm install
```

That's it! All dependencies will be installed automatically.

## Step 2: Start Development Server (10 seconds)

```bash
npm run dev
```

## Step 3: Open in Browser

Visit: **http://localhost:3000**

## Step 4: Explore Features

### Gap Scanner (Main Dashboard)
- View all detected gaps with conviction scores
- Click any row to see detailed chart
- Use filters to narrow down opportunities
- Sort by gap %, volume ratio, or fill rate

### Enable Alerts (Recommended)
1. Click **"Alerts"** in navigation
2. Click **"Enable Notifications"** button
3. Allow notifications in browser
4. Create your first alert:
   - Symbol: NVDA
   - Type: Gap %
   - Condition: Greater Than
   - Value: 3
   - Click "Add Alert"

### Test the Chart
1. Click any stock symbol in the gap scanner
2. View professional chart with:
   - Gap levels marked
   - Previous close line
   - VWAP indicator
   - Volume bars
3. Switch between timeframes

### Command Palette
- Press `⌘K` (Mac) or `Ctrl+K` (Windows)
- Quick navigation to any page
- Try it now!

## Step 5: (Optional) Connect Backend

If you have a backend API ready:

1. Create `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

3. Restart dev server:
```bash
npm run dev
```

That's it! The app will now use your real API instead of mock data.

## What You'll See (With Mock Data)

### Dashboard
- ✅ 10+ gap opportunities
- ✅ Conviction scores (High/Medium/Low)
- ✅ Volume ratios
- ✅ Sentiment indicators
- ✅ Historical fill rates

### Charts
- ✅ Professional candlestick charts
- ✅ Gap level indicators
- ✅ VWAP overlay
- ✅ Volume histogram
- ✅ Dark/Light theme support

### Alerts
- ✅ Create custom alerts
- ✅ Browser notifications
- ✅ Alert history
- ✅ Enable/disable individual alerts

### All Features Work Offline!
No backend needed for testing and development.

## Common First-Time Questions

### Q: Is the data real?
**A:** By default, no. It's mock data for testing. Set `NEXT_PUBLIC_API_URL` to use real data.

### Q: Do alerts work without a backend?
**A:** Yes! Alerts are stored in your browser's localStorage and monitored in real-time.

### Q: Can I test on mobile?
**A:** Yes! The app is fully responsive. Just visit from your phone's browser.

### Q: Where do I get real market data?
**A:** You need to build or buy a backend API. See BACKEND_INTEGRATION_GUIDE.md for details.

### Q: Is this safe for real trading?
**A:** Test thoroughly with paper trading first! See disclaimer in README.md.

## Next Steps

### For Development
1. ✅ Play with all features
2. ✅ Test alert creation
3. ✅ Try different filters
4. ✅ Check responsive design
5. ✅ Test dark/light theme

### For Production
1. 📖 Read BACKEND_INTEGRATION_GUIDE.md
2. 🔧 Implement required API endpoints
3. 🧪 Test with real data
4. 📊 Use trading strategy from TRADING_STRATEGY_GUIDE.md
5. 🚀 Deploy (see DEPLOYMENT_CHECKLIST.md)

## Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Command palette
- `⌘D` / `Ctrl+D` - Toggle theme (when implemented)
- Click any stock symbol - View detailed chart
- `Enter` when creating alert - Add alert

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Nothing shows up
- Check browser console for errors
- Make sure you're on http://localhost:3000
- Try hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`

### Notifications not working
- Click "Enable Notifications" button
- Allow notifications in browser prompt
- Check browser settings if denied
- HTTPS required in production

## Getting Help

1. **Integration:** See BACKEND_INTEGRATION_GUIDE.md
2. **Deployment:** See DEPLOYMENT_CHECKLIST.md
3. **Trading:** See TRADING_STRATEGY_GUIDE.md
4. **Features:** See WHATS_NEW.md
5. **General:** See README.md

## Pro Tips

### 1. Use High Conviction Only
- Filter for "HIGH" conviction gaps
- These have 75-85% historical win rate
- Skip "LOW" conviction entirely

### 2. Set Useful Alerts
- Gap > 3% + Volume > 2x
- Only for liquid stocks
- Check news before trading

### 3. Test Everything
- Create dummy alerts
- Test notifications
- Practice with mock data
- Learn the interface first

### 4. Mobile Usage
- Add to home screen (PWA)
- Set up alerts before market open
- Monitor on the go
- Take profits from phone

## Development Mode vs Production

### Development (Current)
- ✅ Hot reload enabled
- ✅ Mock data by default
- ✅ Detailed error messages
- ✅ Source maps
- ✅ Fast development

### Production (After Deploy)
- ✅ Optimized bundles
- ✅ Real API data
- ✅ Better performance
- ✅ Error tracking
- ✅ Analytics

## Build for Production

When ready to deploy:

```bash
npm run build
npm start
```

Check everything works, then deploy to Vercel, Docker, or your VPS.

## Success Checklist

After 5 minutes, you should have:
- ✅ App running on localhost:3000
- ✅ Gap scanner showing data
- ✅ Created at least one alert
- ✅ Viewed a stock chart
- ✅ Tested command palette (⌘K)
- ✅ Checked mobile view
- ✅ Toggled dark/light theme

If all checked, you're ready to explore more! 🎉

## What's Next?

### Immediate (5-10 minutes)
- Explore all pages (Screener, Watchlist, Analytics)
- Create multiple alerts
- Test advanced filters
- Check backtest viewer

### Short-term (1 hour)
- Read TRADING_STRATEGY_GUIDE.md
- Understand 80% win rate approach
- Plan your trading strategy
- Set up custom filters

### Long-term (1 day)
- Read BACKEND_INTEGRATION_GUIDE.md
- Plan backend implementation
- Deploy to Vercel
- Start paper trading

## Remember

- **This is a tool, not advice** - Do your own research
- **Test with paper money first** - Never risk more than you can lose
- **Markets are risky** - Past performance ≠ future results
- **Learn continuously** - Adapt your strategy as needed

---

**Enjoy your gap trading journey!** 🚀

Questions? Check the comprehensive guides in the docs folder.
