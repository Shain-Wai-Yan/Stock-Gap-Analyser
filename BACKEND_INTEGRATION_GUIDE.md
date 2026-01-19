# Backend Integration Guide

This guide explains how to connect your Stock Gap Analysis Tool to a backend API for production use.

## Current Setup

The application currently uses:
- **Mock Data**: Simulated gap data, news, and market information
- **localStorage**: For alerts and user preferences
- **Client-side logic**: All calculations and filtering happen in the browser

## Integration Steps

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.com
BACKEND_API_KEY=your-secret-api-key

# WebSocket Configuration (optional)
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com

# For Supabase Integration (optional)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Backend API Endpoints Required

Your backend should implement these endpoints:

#### Gap Scanner
```
GET /api/gaps
Response: GapData[]

GET /api/gaps/:symbol
Response: GapData

GET /api/fill-rate/:symbol
Response: { fill_within_24h: number, fill_within_48h: number }
```

#### News & Sentiment
```
GET /api/news
GET /api/news/:symbol
Response: NewsItem[]
```

#### Chart Data
```
GET /api/chart/:symbol?timeframe=1D
Response: ChartData[]
```

#### Backtesting
```
POST /api/backtest/:symbol
Body: { /* backtest parameters */ }
Response: BacktestResult
```

#### Alerts (if using backend storage)
```
GET /api/alerts - Get all alerts
POST /api/alerts - Create alert
PATCH /api/alerts/:id - Update alert
DELETE /api/alerts/:id - Delete alert
```

### 3. Data Schemas

All API responses should match these TypeScript interfaces:

```typescript
interface GapData {
  symbol: string
  name: string
  gapPercent: number
  currentPrice: number
  previousClose: number
  volume: number
  volumeRatio: number
  sentimentScore: number // 0-1
  historicalFillRate: number // 0-100
  conviction: 'high' | 'medium' | 'low'
  sector: string
  marketCap: string
  preMarketHigh: number
  preMarketLow: number
  vwap: number
  gapFillProbability: number // 0-1
  reasons?: string[]
  timestamp?: string
}

interface ChartData {
  time: number | string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
  sentiment?: 'bullish' | 'neutral' | 'bearish'
  relatedSymbols?: string[]
}
```

### 4. Integrating Real-time Data

#### Option A: Polling (Current)
The app already polls for data every 30 seconds. Just set `NEXT_PUBLIC_API_URL`.

#### Option B: WebSocket
1. Set `NEXT_PUBLIC_WS_URL` in your environment
2. Update `/lib/hooks/use-websocket.ts` with your WebSocket connection logic

```typescript
// In use-websocket.ts
useEffect(() => {
  const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!)
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'gap_update') {
      setGaps(data.gaps)
    }
  }
  
  return () => ws.close()
}, [])
```

### 5. Alert System Integration

#### Using localStorage (Current Default)
Alerts are stored locally in the browser. No backend required.

#### Using Backend Storage
1. Implement the alert API endpoints (see `/app/api/alerts/route.ts`)
2. Update `/lib/alert-storage.ts` to use API calls instead of localStorage:

```typescript
// Replace AlertStorage class methods with:
export class AlertStorage {
  static async getAlerts(): Promise<Alert[]> {
    const response = await fetch('/api/alerts')
    return response.json()
  }

  static async saveAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> {
    const response = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    })
    return response.json()
  }

  // ... similar for other methods
}
```

### 6. Database Schema (if using backend storage)

#### Alerts Table
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(10) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'gap', 'price', 'volume'
  condition VARCHAR(20) NOT NULL, -- 'greater_than', 'less_than', etc.
  value NUMERIC NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_triggered TIMESTAMP,
  trigger_count INTEGER DEFAULT 0
);
```

#### Trade Journal Table (optional)
```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(10) NOT NULL,
  entry_date TIMESTAMP NOT NULL,
  entry_price NUMERIC NOT NULL,
  exit_date TIMESTAMP,
  exit_price NUMERIC,
  quantity INTEGER NOT NULL,
  direction VARCHAR(10) NOT NULL, -- 'long' or 'short'
  reason TEXT,
  outcome VARCHAR(20), -- 'win', 'loss', 'breakeven'
  pnl NUMERIC,
  pnl_percent NUMERIC,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t gap-analysis-tool .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=your-api gap-analysis-tool
```

### Manual
```bash
npm install
npm run build
npm start
```

## Testing Your Integration

1. **Test with Mock Data First**
   - Run without `NEXT_PUBLIC_API_URL` set
   - Verify all features work with mock data

2. **Test API Connection**
   - Set `NEXT_PUBLIC_API_URL` to your backend
   - Check browser console for API errors
   - Verify data is loading correctly

3. **Test Alerts**
   - Create test alerts
   - Verify they trigger correctly
   - Check notifications work

4. **Monitor Performance**
   - Check API response times
   - Monitor for errors in production
   - Set up error tracking (Sentry, etc.)

## Backend Implementation Tips

### High Win Rate (80%+) Gap Analysis

To achieve an 80% win rate, your backend should:

1. **Filter for High-Quality Gaps**
   - Gap % between 2-8% (sweet spot)
   - Volume ratio > 2x average
   - Historical fill rate > 70%
   - Positive sentiment score > 0.6

2. **Avoid These Gaps**
   - Gaps on low liquidity stocks
   - Gaps > 15% (too risky)
   - Gaps on earnings day without confirmation
   - Negative sentiment + large gap

3. **Calculate Conviction Score**
```python
def calculate_conviction(gap_data):
    score = 0
    
    # Historical fill rate (40% weight)
    score += gap_data.historical_fill_rate * 0.4
    
    # Volume confirmation (30% weight)
    if gap_data.volume_ratio > 2:
        score += 30
    
    # Sentiment (20% weight)
    score += gap_data.sentiment_score * 20
    
    # Gap size (10% weight)
    if 2 <= abs(gap_data.gap_percent) <= 8:
        score += 10
    
    if score >= 75:
        return 'high'
    elif score >= 60:
        return 'medium'
    else:
        return 'low'
```

4. **Real-time Data Sources**
   - Use APIs like Polygon.io, Alpaca, or IEX Cloud
   - WebSocket for real-time quotes
   - News API for sentiment analysis

## Support

For issues or questions:
- Check the browser console for errors
- Verify environment variables are set
- Ensure API endpoints match the schemas
- Test with mock data first

## Next Steps

Once integrated:
1. Monitor your win rate over 30 days
2. Adjust filters based on performance
3. Add more sophisticated backtesting
4. Implement position sizing calculations
5. Add trade journaling features
