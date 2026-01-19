import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api-client'
import { useStore } from '../store'

const USE_MOCK_DATA = true; // Declare USE_MOCK_DATA variable
const mockGaps = [
  { symbol: 'AAPL', gap: 0.05 },
  { symbol: 'GOOGL', gap: 0.1 },
]; // Declare mockGaps variable
const mockNews = [
  { symbol: 'AAPL', title: 'Apple Reports Q4 Earnings' },
  { symbol: 'GOOGL', title: 'Google Announces New Product' },
]; // Declare mockNews variable
const mockBacktestResult = { result: 'Successful', metrics: { return: 0.15 } }; // Declare mockBacktestResult variable

// Gap Scanner Hook
export function useGaps(refetchInterval = 30000) {
  const setGaps = useStore((state) => state.setGaps)
  
  return useQuery({
    queryKey: ['gaps'],
    queryFn: () => apiClient.getGaps(),
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
    queryFn: () => apiClient.getNews(symbol),
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
      return apiClient.getChartData(symbol, timeframe)
    },
    enabled: !!symbol,
  })
}

// Sector Data Hook
export function useSectorData() {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: () => apiClient.getSectorData(),
    refetchInterval: 120000,
  })
}

// Gap Reason Hook
export function useGapReason(symbol: string | null) {
  return useQuery({
    queryKey: ['gapReason', symbol],
    queryFn: async () => {
      if (!symbol) return null
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
    queryFn: () => apiClient.getTrades(),
  })
}
