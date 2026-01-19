import { z } from 'zod'

// Gap Data Schema
export const GapDataSchema = z.object({
  symbol: z.string().min(1).max(10).regex(/^[A-Z]+$/, 'Symbol must be uppercase letters only'),
  name: z.string().min(1),
  gapPercent: z.number().min(-100).max(100),
  currentPrice: z.number().positive(),
  previousClose: z.number().positive(),
  volume: z.number().nonnegative(),
  volumeRatio: z.number().positive(),
  sentimentScore: z.number().min(0).max(1),
  historicalFillRate: z.number().min(0).max(100),
  conviction: z.enum(['high', 'medium', 'low']),
  sector: z.string(),
  marketCap: z.string(),
  preMarketHigh: z.number().positive(),
  preMarketLow: z.number().positive(),
  vwap: z.number().positive(),
  gapFillProbability: z.number().min(0).max(1),
  reasons: z.array(z.string()).optional(),
  timestamp: z.string().datetime().optional(),
})

export const GapArraySchema = z.array(GapDataSchema)

// Chart Data Schema
export const ChartDataSchema = z.object({
  time: z.union([z.number(), z.string()]),
  open: z.number().positive(),
  high: z.number().positive(),
  low: z.number().positive(),
  close: z.number().positive(),
  volume: z.number().nonnegative(),
})

export const ChartArraySchema = z.array(ChartDataSchema)

// News Item Schema - Very lenient to accept backend format
export const NewsItemSchema = z.object({
  id: z.string().or(z.number()).transform(String).catch(''),
  title: z.string().catch('Untitled'),
  summary: z.string().catch(''),
  source: z.string().catch('Unknown'),
  url: z.string().catch('https://example.com'),
  publishedAt: z.string().catch(() => new Date().toISOString()),
  sentiment: z.enum(['bullish', 'neutral', 'bearish']).catch('neutral'),
  relatedSymbols: z.array(z.string()).catch([]),
}).passthrough() // Allow extra fields from backend

export const NewsArraySchema = z.array(NewsItemSchema).catch([])

// Backtest Result Schema
export const BacktestResultSchema = z.object({
  symbol: z.string(),
  totalTrades: z.number().nonnegative(),
  winRate: z.number().min(0).max(100),
  profitFactor: z.number().nonnegative(),
  sharpeRatio: z.number(),
  maxDrawdown: z.number().min(-100).max(0),
  totalReturn: z.number(),
  avgWin: z.number(),
  avgLoss: z.number(),
  equityCurve: z.array(z.object({
    date: z.string(),
    equity: z.number(),
  })),
  trades: z.array(z.object({
    entryDate: z.string(),
    exitDate: z.string(),
    entryPrice: z.number(),
    exitPrice: z.number(),
    pnl: z.number(),
    pnlPercent: z.number(),
  })).optional(),
})

// Alert Schema
export const AlertSchema = z.object({
  id: z.string(),
  symbol: z.string().regex(/^[A-Z]+$/),
  type: z.enum(['gap', 'price', 'volume']),
  condition: z.enum(['greater_than', 'less_than', 'equals', 'crosses_above', 'crosses_below']),
  value: z.number(),
  enabled: z.boolean(),
  createdAt: z.string(),
  lastTriggered: z.string().optional(),
  triggerCount: z.number().optional(),
})

export const AlertArraySchema = z.array(AlertSchema)

// Validation helper function
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown, context: string): T {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    console.error(`[v0] Validation failed for ${context}:`, result.error.format())
    throw new ValidationError(
      `Invalid data format for ${context}`,
      result.error.errors
    )
  }
  
  return result.data
}

// Custom Error Classes
export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: z.ZodIssue[]
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'NetworkError'
  }
}

// Type exports
export type GapData = z.infer<typeof GapDataSchema>
export type ChartData = z.infer<typeof ChartDataSchema>
export type NewsItem = z.infer<typeof NewsItemSchema>
export type BacktestResult = z.infer<typeof BacktestResultSchema>
export type Alert = z.infer<typeof AlertSchema>
