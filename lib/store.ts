import { create } from 'zustand'
import type { GapData, NewsItem, BacktestResult } from './types'

interface AppState {
  selectedSymbol: string | null
  gaps: GapData[]
  news: NewsItem[]
  backtestResults: BacktestResult | null
  isMarketOpen: boolean
  lastUpdate: Date | null
  
  // Actions
  setSelectedSymbol: (symbol: string | null) => void
  setGaps: (gaps: GapData[]) => void
  setNews: (news: NewsItem[]) => void
  setBacktestResults: (results: BacktestResult | null) => void
  setIsMarketOpen: (isOpen: boolean) => void
  setLastUpdate: (date: Date) => void
}

export const useStore = create<AppState>((set) => ({
  selectedSymbol: null,
  gaps: [],
  news: [],
  backtestResults: null,
  isMarketOpen: false,
  lastUpdate: null,

  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setGaps: (gaps) => set({ gaps, lastUpdate: new Date() }),
  setNews: (news) => set({ news, lastUpdate: new Date() }),
  setBacktestResults: (results) => set({ backtestResults: results }),
  setIsMarketOpen: (isOpen) => set({ isMarketOpen: isOpen }),
  setLastUpdate: (date) => set({ lastUpdate: date }),
}))
