# Stock Gap Analysis Tool

A professional-grade gap trading analysis tool built with Next.js 16, designed to help traders identify and capitalize on high-probability gap fill opportunities with an 80%+ target win rate.

## Features

### Core Analysis
- **Real-time Gap Scanner** - Automatically detects and ranks pre-market and intraday gaps
- **Historical Fill Rate Analysis** - Shows probability of gap filling based on historical data
- **Conviction Scoring** - AI-powered ranking system (High/Medium/Low)
- **Volume Analysis** - Volume ratio tracking and unusual activity detection
- **Sentiment Analysis** - Market sentiment scoring for each gap opportunity

### Advanced Features
- **Professional Charting** - Powered by Lightweight Charts with gap levels, VWAP, and volume
- **Custom Alerts** - Price, gap, and volume alerts with browser notifications
- **Backtest Viewer** - Historical performance analysis of gap strategies
- **Sector Heatmap** - Visual representation of gap activity by sector
- **News Feed** - Real-time news related to gap opportunities
- **Trade Journal** - Track and analyze your gap trades
- **Risk Calculator** - Position sizing and risk management tools
- **Command Palette** - Quick navigation with keyboard shortcuts (⌘K)

### Technical Features
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme** - Automatic theme switching
- **Real-time Updates** - 30-second auto-refresh of market data
- **WebSocket Support** - For real-time streaming data (optional)
- **Offline Ready** - Works with mock data for testing and development
- **Production Ready** - Built with TypeScript, validated APIs, error handling

## Quick Start

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd stockgapanalysistool
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

The app will start with **mock data** by default, so you can explore all features immediately without any backend setup.

## Backend Integration

The app is designed to work with mock data out of the box, but can easily connect to your backend API.

### Environment Setup

Create a `.env.local` file:

```env
# Optional: Connect to your backend API
NEXT_PUBLIC_API_URL=https://your-backend-api.com
BACKEND_API_KEY=your-api-key

# Optional: WebSocket for real-time updates
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com
```

### Integration Guide

See [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md) for detailed instructions on:
- Required API endpoints
- Data schemas
- Database setup
- Real-time data integration
- Alert system backend
- Deployment guides

## Project Structure

```
stockgapanalysistool/
├── app/                    # Next.js 16 App Router
│   ├── page.tsx           # Main dashboard
│   ├── alerts/            # Alerts management page
│   ├── screener/          # Advanced gap screener
│   ├── watchlist/         # Watchlist management
│   ├── analytics/         # Performance analytics
│   └── api/               # API routes (ready for backend)
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── gap-scanner-table.tsx
│   ├── stock-chart.tsx
│   ├── lightweight-chart.tsx
│   └── ...
├── lib/                   # Core logic and utilities
│   ├── api-client.ts      # API client with retry logic
│   ├── alert-storage.ts   # Alert persistence (localStorage)
│   ├── alert-monitor.ts   # Alert condition checking
│   ├── store.ts           # Zustand state management
│   ├── types.ts           # TypeScript definitions
│   ├── validation.ts      # Zod schemas and validation
│   ├── mock-data.ts       # Mock data for development
│   └── hooks/             # Custom React hooks
└── public/                # Static assets
```

## Key Technologies

- **Framework**: Next.js 16 (App Router, React 19.2)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Charts**: Lightweight Charts by TradingView
- **State**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Validation**: Zod
- **TypeScript**: Full type safety
- **Notifications**: Browser Notification API + Sonner

## Alert System

The app includes a powerful alert system:

### Features
- Create alerts for gap %, price, or volume
- Multiple condition types (greater than, less than, crosses, etc.)
- Browser push notifications
- Alert history and trigger tracking
- Enable/disable alerts individually
- 5-minute cooldown between triggers

### Storage Options

**Current**: localStorage (works offline, no backend needed)

**Backend Integration**: Easily switch to API-based storage for multi-device sync and persistence. See integration guide.

### Usage

1. Go to Alerts page
2. Click "Enable Notifications" to allow browser notifications
3. Create an alert with your criteria
4. Toggle alerts on/off as needed
5. Receive notifications when conditions are met

## Win Rate Optimization

To achieve 80%+ win rate on gap trades:

### Filter Criteria (Already Implemented)
- Gap % between 2-8% (optimal range)
- Volume ratio > 2x average
- Historical fill rate > 70%
- Positive sentiment score > 0.6
- High conviction ranking

### What the Backend Should Provide
- Real-time pre-market data
- Historical fill rate calculations
- News sentiment analysis
- Volume profile data
- Sector strength indicators

See [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md) for backend implementation strategies.

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Environment Variables

```env
# API Configuration (optional)
NEXT_PUBLIC_API_URL=          # Your backend API URL
BACKEND_API_KEY=              # API key for server-side calls
NEXT_PUBLIC_WS_URL=           # WebSocket URL for real-time data

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_MOCK_DATA=true   # Use mock data if no API
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Docker

```bash
docker build -t gap-analysis-tool .
docker run -p 3000:3000 gap-analysis-tool
```

### Manual

```bash
npm run build
npm start
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Responsive design

### Notification Support
- Desktop: Chrome, Firefox, Edge, Safari 16+
- Mobile: Android Chrome, Samsung Internet
- iOS: Safari 16.4+ (with limitations)

## Roadmap

### Implemented ✅
- Gap scanner with conviction scoring
- Professional charting with Lightweight Charts
- Alert system with notifications
- Historical backtest viewer
- News feed integration
- Responsive design
- Dark/Light theme
- Mock data for development
- API-ready architecture

### Planned 🚧
- Machine learning gap prediction
- Multi-timeframe analysis
- Options flow integration
- Social sentiment tracking
- Mobile app (React Native)
- Advanced position sizing
- Trade automation signals

## Contributing

This is a personal trading tool. If you fork it:
1. Replace mock data with real data sources
2. Implement the backend APIs (see integration guide)
3. Test thoroughly before trading with real money
4. Never trade more than you can afford to lose

## Disclaimer

This tool is for educational and informational purposes only. It is not financial advice. Trading stocks involves risk, and you can lose money. Past performance does not guarantee future results. Always do your own research and consider consulting with a financial advisor before making trading decisions.

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Check the [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)
- Review the browser console for errors
- Ensure environment variables are properly set
- Test with mock data first before connecting real APIs

---

**Built with ❤️ for gap traders** | Made with Next.js 16, React 19, and shadcn/ui
