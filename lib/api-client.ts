import {
  type GapData,
  type NewsItem,
  type BacktestResult,
  type ChartData,
  GapArraySchema,
  GapDataSchema,
  NewsArraySchema,
  BacktestResultSchema,
  ChartArraySchema,
  validateData,
  ApiError,
  NetworkError,
} from './validation'

// Use Next.js API routes which will proxy to backend
// This allows for better error handling, caching, and transformation
const API_BASE_URL = ''  // Empty string means same-origin /api/* routes

class ApiClient {
  private baseUrl: string
  private defaultTimeout = 15000 // 15 seconds
  private maxRetries = 3

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Enhanced fetch with retry logic, timeout, and proper error handling
   */
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit,
    retries = this.maxRetries
  ): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout)

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`[v0] API request: ${endpoint} (attempt ${attempt + 1}/${retries})`)

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new ApiError(
            `API Error: ${response.statusText}`,
            response.status,
            errorData
          )
        }

        const data = await response.json()
        console.log(`[v0] API response received: ${endpoint}`)
        return data
      } catch (error) {
        clearTimeout(timeoutId)

        // Don't retry on abort (timeout) or client errors (4xx)
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new NetworkError('Request timeout', error as Error)
        }

        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          throw error
        }

        // Retry on network errors or server errors (5xx)
        if (attempt === retries - 1) {
          if (error instanceof ApiError) {
            throw error
          }
          throw new NetworkError(
            `Network error after ${retries} attempts`,
            error as Error
          )
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = 1000 * Math.pow(2, attempt)
        console.log(`[v0] Retrying after ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw new NetworkError(`Max retries (${retries}) exceeded`)
  }

  // Gap Scanner
  async getGaps(): Promise<GapData[]> {
    const response = await this.fetch<unknown>('/api/gaps')
    // Response is already transformed by Next.js API route
    return validateData(GapArraySchema, response, 'gaps')
  }

  async getGapDetails(symbol: string): Promise<GapData> {
    const response = await this.fetch<unknown>(`/api/gaps/${symbol}`)
    return validateData(GapDataSchema, response, `gap details for ${symbol}`)
  }

  // Historical Fill Rate
  async getFillRate(symbol: string): Promise<{ fill_within_24h: number; fill_within_48h: number }> {
    return this.fetch(`/api/fill-rate/${symbol}`)
  }

  // News & Sentiment
  async getNews(symbol?: string): Promise<NewsItem[]> {
    const endpoint = symbol ? `/api/news?symbol=${symbol}` : '/api/news'
    const response = await this.fetch<unknown>(endpoint)
    return validateData(NewsArraySchema, response, 'news')
  }

  // Backtesting
  async runBacktest(symbol: string, params?: Record<string, unknown>): Promise<BacktestResult> {
    const response = await this.fetch<unknown>(`/api/backtest/${symbol}`, {
      method: 'GET',
    })
    return validateData(BacktestResultSchema, response, `backtest for ${symbol}`)
  }

  // Chart Data
  async getChartData(symbol: string, timeframe: string = '1D'): Promise<ChartData[]> {
    const data = await this.fetch<unknown>(`/api/chart/${symbol}?timeframe=${timeframe}`)
    return validateData(ChartArraySchema, data, `chart data for ${symbol}`)
  }

  // Sector Analysis
  async getSectorData() {
    return this.fetch('/api/sectors')
  }

  // AI Reasoning
  async getGapReason(symbol: string): Promise<{ reason: string; confidence: number }> {
    return this.fetch(`/api/gap-reason/${symbol}`)
  }

  // Trade Journal
  async saveTrade(trade: { symbol: string; reason: string; entry: number; stop: number; target: number }) {
    return this.fetch('/api/trades', {
      method: 'POST',
      body: JSON.stringify(trade),
    })
  }

  async getTrades() {
    return this.fetch('/api/trades')
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
