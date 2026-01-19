# Backend Integration Guide

## Quick Start: Connect Your FastAPI Backend

This frontend is **fully functional** with mock data. To connect real data:

### 1. Your FastAPI Backend Should Expose These Endpoints:

\`\`\`python
# main.py (FastAPI)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for your Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/gaps")
async def get_gaps():
    """
    Returns: List[GapStock]
    
    Example response:
    [
      {
        "symbol": "NVDA",
        "company": "NVIDIA Corporation",
        "gapPercent": 3.2,
        "price": 482.50,
        "volume": 42500000,
        "volumeRatio": 2.4,
        "sentiment": 0.78,
        "sentimentLabel": "Bullish",
        "historicalFillRate": 73,
        "conviction": "high",
        "preMarketHigh": 485.20,
        "preMarketLow": 478.90,
        "vwap": 481.75,
        "sector": "Technology",
        "marketCap": "1.2T",
        "lastUpdated": "2026-01-18T10:30:00Z"
      }
    ]
    """
    return get_current_gaps()  # Your logic here

@app.get("/api/v1/news")
async def get_news():
    """Returns: List[NewsItem]"""
    return fetch_latest_news()  # Your logic here

@app.get("/api/v1/backtest")
async def run_backtest(strategy: str = "default"):
    """Returns: BacktestResult"""
    return execute_backtest(strategy)  # Your logic here

@app.get("/api/v1/chart/{symbol}")
async def get_chart_data(symbol: str, timeframe: str = "1D"):
    """Returns: List[ChartData]"""
    return fetch_ohlcv_data(symbol, timeframe)  # Your logic here
\`\`\`

### 2. Update Frontend to Use Real API

Create `/lib/api.ts`:

\`\`\`typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchGaps() {
  const response = await fetch(`${API_BASE_URL}/api/v1/gaps`)
  if (!response.ok) throw new Error('Failed to fetch gaps')
  return response.json()
}

export async function fetchNews() {
  const response = await fetch(`${API_BASE_URL}/api/v1/news`)
  if (!response.ok) throw new Error('Failed to fetch news')
  return response.json()
}

export async function fetchBacktest() {
  const response = await fetch(`${API_BASE_URL}/api/v1/backtest`)
  if (!response.ok) throw new Error('Failed to fetch backtest')
  return response.json()
}

export async function fetchChartData(symbol: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chart/${symbol}`)
  if (!response.ok) throw new Error('Failed to fetch chart')
  return response.json()
}
\`\`\`

### 3. Replace Mock Data in `/app/page.tsx`

\`\`\`typescript
'use client'

import { useEffect, useState } from 'react'
import { fetchGaps, fetchNews } from '@/lib/api'
import type { GapStock, NewsItem } from '@/lib/types'

export default function Page() {
  const [gapStocks, setGapStocks] = useState<GapStock[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [gaps, newsData] = await Promise.all([
          fetchGaps(),
          fetchNews()
        ])
        setGapStocks(gaps)
        setNews(newsData)
      } catch (error) {
        console.error('[v0] Failed to load data:', error)
        // Fallback to mock data
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
    
    // Refresh every 60 seconds
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Rest of your component...
}
\`\`\`

### 4. Add Environment Variable

Create `.env.local`:

\`\`\`bash
NEXT_PUBLIC_API_URL=https://your-backend.fly.dev
\`\`\`

For production (Vercel):
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_API_URL` = `https://your-backend.fly.dev`

### 5. Backend Implementation Examples

#### Gap Detection Logic (Python)

\`\`\`python
import yfinance as yf
from datetime import datetime, timedelta

def detect_gaps(symbols: list[str], min_gap_percent: float = 2.0):
    gaps = []
    
    for symbol in symbols:
        stock = yf.Ticker(symbol)
        
        # Get pre-market and previous close
        hist = stock.history(period="2d")
        if len(hist) < 2:
            continue
            
        prev_close = hist['Close'].iloc[-2]
        current_price = hist['Close'].iloc[-1]
        
        gap_percent = ((current_price - prev_close) / prev_close) * 100
        
        if abs(gap_percent) >= min_gap_percent:
            # Calculate volume ratio
            avg_volume = stock.info.get('averageVolume', 0)
            current_volume = hist['Volume'].iloc[-1]
            volume_ratio = current_volume / avg_volume if avg_volume > 0 else 1.0
            
            # Get sentiment (integrate FinBERT here)
            sentiment = calculate_sentiment(symbol)
            
            # Get historical fill rate
            fill_rate = calculate_historical_fill_rate(symbol, gap_percent)
            
            # Determine conviction
            conviction = 'high' if (
                abs(gap_percent) > 2.0 and
                volume_ratio > 2.0 and
                sentiment > 0.6 and
                fill_rate > 70
            ) else 'medium' if volume_ratio > 1.5 else 'low'
            
            gaps.append({
                'symbol': symbol,
                'company': stock.info.get('longName', symbol),
                'gapPercent': round(gap_percent, 2),
                'price': round(current_price, 2),
                'volume': int(current_volume),
                'volumeRatio': round(volume_ratio, 1),
                'sentiment': round(sentiment, 2),
                'sentimentLabel': get_sentiment_label(sentiment),
                'historicalFillRate': fill_rate,
                'conviction': conviction,
                'preMarketHigh': round(hist['High'].iloc[-1], 2),
                'preMarketLow': round(hist['Low'].iloc[-1], 2),
                'vwap': calculate_vwap(hist),
                'sector': stock.info.get('sector', 'Unknown'),
                'marketCap': format_market_cap(stock.info.get('marketCap', 0)),
                'lastUpdated': datetime.now().isoformat()
            })
    
    return sorted(gaps, key=lambda x: abs(x['gapPercent']), reverse=True)
\`\`\`

#### Sentiment Analysis with FinBERT

\`\`\`python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load FinBERT model (do this once at startup)
tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")

def calculate_sentiment(symbol: str) -> float:
    # Fetch recent news headlines
    news = fetch_news_for_symbol(symbol)  # Use NewsAPI or similar
    
    if not news:
        return 0.5  # Neutral
    
    sentiments = []
    for headline in news[:5]:  # Analyze top 5 headlines
        inputs = tokenizer(headline, return_tensors="pt", truncation=True, max_length=512)
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # FinBERT outputs: [negative, neutral, positive]
        sentiment_score = probs[0][2].item() - probs[0][0].item()  # positive - negative
        sentiments.append(sentiment_score)
    
    avg_sentiment = sum(sentiments) / len(sentiments)
    # Convert from [-1, 1] to [0, 1]
    return (avg_sentiment + 1) / 2
\`\`\`

#### Backtesting with VectorBT

\`\`\`python
import vectorbt as vbt
import pandas as pd

def execute_backtest(strategy: str = "gap_fill"):
    # Fetch historical data
    symbols = ["AAPL", "MSFT", "NVDA", "TSLA"]
    data = vbt.YFData.download(symbols, start="2021-01-01", end="2026-01-01")
    
    # Define gap strategy
    close = data.get("Close")
    
    # Detect gaps (simplified)
    prev_close = close.shift(1)
    gap_percent = (close - prev_close) / prev_close * 100
    
    # Entry: Gap > 2%
    entries = gap_percent > 2.0
    
    # Exit: Gap filled (price returns to previous close)
    exits = close <= prev_close
    
    # Run backtest
    portfolio = vbt.Portfolio.from_signals(
        close,
        entries,
        exits,
        init_cash=10000,
        fees=0.001  # 0.1% commission
    )
    
    # Calculate metrics
    total_return = portfolio.total_return() * 100
    sharpe_ratio = portfolio.sharpe_ratio()
    max_dd = portfolio.max_drawdown() * 100
    
    trades = portfolio.trades.records_readable
    win_rate = (trades['PnL'] > 0).sum() / len(trades) * 100
    
    return {
        'strategy': strategy,
        'totalTrades': len(trades),
        'winRate': round(win_rate, 1),
        'profitFactor': calculate_profit_factor(trades),
        'totalReturn': round(total_return, 1),
        'maxDrawdown': round(max_dd, 1),
        'sharpeRatio': round(sharpe_ratio, 2),
        'avgWin': round(trades[trades['PnL'] > 0]['PnL'].mean(), 2),
        'avgLoss': round(trades[trades['PnL'] < 0]['PnL'].mean(), 2),
        'equityCurve': portfolio.value().to_dict()
    }
\`\`\`

### 6. Deploy Backend to Fly.io

\`\`\`bash
# Create Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Deploy
fly launch
fly deploy
\`\`\`

### 7. Testing the Integration

1. Start your FastAPI backend locally: `uvicorn main:app --reload`
2. Update `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Run Next.js: `npm run dev`
4. Open http://localhost:3000 and verify data loads

### 8. Monitoring

Add logging to track API performance:

\`\`\`typescript
// lib/api.ts
export async function fetchGaps() {
  console.log('[v0] Fetching gaps from API...')
  const start = Date.now()
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/gaps`)
    const data = await response.json()
    
    console.log(`[v0] Fetched ${data.length} gaps in ${Date.now() - start}ms`)
    return data
  } catch (error) {
    console.error('[v0] API Error:', error)
    throw error
  }
}
\`\`\`

---

## Summary Checklist

- [ ] FastAPI backend created with required endpoints
- [ ] CORS configured for your Vercel domain
- [ ] Gap detection logic implemented (Alpaca/yfinance)
- [ ] Sentiment analysis integrated (FinBERT)
- [ ] Backtesting engine set up (VectorBT)
- [ ] Backend deployed to Fly.io/Railway
- [ ] Environment variables configured in Vercel
- [ ] Frontend updated to use real API
- [ ] Tested end-to-end locally
- [ ] Deployed to production

**Once complete**, your dashboard will show **real market data** instead of mock data!
