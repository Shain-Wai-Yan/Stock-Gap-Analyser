import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api-client'
import { useStore } from '../store'
import { mockGaps, mockNews, mockBacktestResult } from '../mock-data'

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL

// Gap Scanner Hook
export function useGaps(refetchInterval = 30000) {
  const setGaps = useStore((state) => state.setGaps)
  
  return useQuery({
    queryKey: ['gaps'],
    queryFn: async () => {
      if (USE_MOCK_DATA) return mockGaps
      return apiClient.getGaps()
    },
    refetchInterval,
    onSuccess: (data) => setGaps(data),
  })
}

// Gap Details Hook
export function useGapDetails(symbol: string | null) {
  return useQuery({
    queryKey: ['gap', symbol],
    queryFn: async () => {
      if (!symbol) return null
      if (USE_MOCK_DATA) {
        return mockGaps.find((g) => g.symbol === symbol) || null
      }
      return apiClient.getGapDetails(symbol)
    },
    enabled: !!symbol,
  })
}

// Fill Rate Hook
export function useFillRate(symbol: string | null) {
  return useQuery({
    queryKey: ['fillRate', symbol],
    queryFn: async () => {
      if (!symbol) return null
      if (USE_MOCK_DATA) {
        return { fill_within_24h: 0.73, fill_within_48h: 0.85 }
      }
      return apiClient.getFillRate(symbol)
    },
    enabled: !!symbol,
  })
}

// News Hook
export function useNews(symbol?: string) {
  const setNews = useStore((state) => state.setNews)
  
  return useQuery({
    queryKey: ['news', symbol],
    queryFn: async () => {
      if (USE_MOCK_DATA) return mockNews
      return apiClient.getNews(symbol)
    },
    refetchInterval: 60000,
    onSuccess: (data) => setNews(data),
  })
}

// Backtest Hook
export function useBacktest(symbol: string | null) {
  return useQuery({
    queryKey: ['backtest', symbol],
    queryFn: async () => {
      if (!symbol) return null
      if (USE_MOCK_DATA) return mockBacktestResult
      return apiClient.runBacktest(symbol)
    },
    enabled: !!symbol,
  })
}

// Chart Data Hook
export function useChartData(symbol: string | null, timeframe = '1D') {
  return useQuery({
    queryKey: ['chart', symbol, timeframe],
    queryFn: async () => {
      if (!symbol) return null
      if (USE_MOCK_DATA) {
        // Return mock OHLCV data
        return null
      }
      return apiClient.getChartData(symbol, timeframe)
    },
    enabled: !!symbol,
  })
}

// Sector Data Hook
export function useSectorData() {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return [
          { name: 'Technology', sentiment: 0.75, gapCount: 12 },
          { name: 'Healthcare', sentiment: 0.45, gapCount: 5 },
          { name: 'Finance', sentiment: -0.2, gapCount: 8 },
          { name: 'Energy', sentiment: 0.6, gapCount: 3 },
        ]
      }
      return apiClient.getSectorData()
    },
    refetchInterval: 120000,
  })
}

// Gap Reason Hook
export function useGapReason(symbol: string | null) {
  return useQuery({
    queryKey: ['gapReason', symbol],
    queryFn: async () => {
      if (!symbol) return null
      if (USE_MOCK_DATA) {
        return {
          reason: 'Strong earnings beat with +15% revenue growth. Institutional buying detected.',
          confidence: 0.87,
        }
      }
      return apiClient.getGapReason(symbol)
    },
    enabled: !!symbol,
  })
}

// Trade Journal Mutation
export function useSaveTrade() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiClient.saveTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] })
    },
  })
}

// Get Trades Hook
export function useTrades() {
  return useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      if (USE_MOCK_DATA) return []
      return apiClient.getTrades()
    },
  })
}
