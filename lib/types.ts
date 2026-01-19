// Re-export validated types from validation.ts
export type {
  GapData,
  ChartData,
  NewsItem,
  BacktestResult,
  Alert,
} from './validation'

export type {
  ValidationError,
  ApiError,
  NetworkError,
} from './validation'

// Legacy type for backward compatibility (use GapData instead)
export interface GapStock {
  symbol: string
  company: string
  gapPercent: number
  price: number
  volume: number
  volumeRatio: number
  sentiment: number
  sentimentLabel: 'Bullish' | 'Neutral' | 'Bearish'
  historicalFillRate: number
  conviction: 'high' | 'medium' | 'low'
  preMarketHigh: number
  preMarketLow: number
  vwap: number
  sector: string
  marketCap: string
  lastUpdated: string
}

// Additional helper types
export interface FilterState {
  gapRange: [number, number]
  volumeRatioMin: number
  sentimentMin: number
  fillRateMin: number
  sectors: string[]
  conviction: ('high' | 'medium' | 'low')[]
  marketCapRange: ('micro' | 'small' | 'mid' | 'large')[]
}

export interface WatchlistItem {
  id: string
  symbol: string
  addedAt: string
  notes?: string
  alertThreshold?: number
}

export interface TradeJournalEntry {
  id: string
  symbol: string
  entryDate: string
  entryPrice: number
  exitDate?: string
  exitPrice?: number
  quantity: number
  direction: 'long' | 'short'
  reason: string
  outcome?: 'win' | 'loss' | 'breakeven'
  pnl?: number
  pnlPercent?: number
  notes?: string
}
