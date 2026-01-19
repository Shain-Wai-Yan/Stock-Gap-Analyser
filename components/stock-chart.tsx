'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, Activity, DollarSign, BarChart3 } from 'lucide-react'
import { LightweightChart } from './lightweight-chart'
import type { GapStock, GapData } from '@/lib/types'
import { useStore } from '@/lib/store'
import { useGapDetails, useChartData } from '@/lib/hooks/use-api'

interface StockChartProps {
  symbol: string | null
}

export function StockChart({ symbol }: StockChartProps) {
  const gaps = useStore((state) => state.gaps)
  const { data: gapDetails } = useGapDetails(symbol)
  const { data: chartData, isLoading: chartLoading } = useChartData(symbol)
  
  // Find the stock from gaps or use API details
  const stock = gaps.find(g => g.symbol === symbol) || gapDetails
  
  if (!symbol || !stock) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Select a stock from the scanner to view details</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isPositiveGap = stock.gapPercent > 0
  
  // Map GapData to GapStock-like structure
  const displayStock = {
    symbol: stock.symbol,
    company: stock.name || stock.symbol,
    gapPercent: stock.gapPercent,
    price: stock.currentPrice,
    volume: stock.volume,
    volumeRatio: stock.volumeRatio,
    sentiment: stock.sentimentScore,
    sentimentLabel: stock.sentimentScore > 0.6 ? 'Bullish' : stock.sentimentScore < 0.4 ? 'Bearish' : 'Neutral',
    historicalFillRate: stock.historicalFillRate,
    conviction: stock.conviction,
    preMarketHigh: stock.preMarketHigh,
    preMarketLow: stock.preMarketLow,
    vwap: stock.vwap,
    sector: stock.sector,
    marketCap: stock.marketCap,
  } as const

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold font-mono flex items-center gap-3">
              {displayStock.symbol}
              <Badge
                variant={isPositiveGap ? 'default' : 'destructive'}
                className="text-base font-mono"
              >
                {isPositiveGap ? '+' : ''}
                {displayStock.gapPercent.toFixed(2)}%
              </Badge>
            </CardTitle>
            <CardDescription className="text-base mt-1">{displayStock.company}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold font-mono">${displayStock.price.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">{displayStock.sector}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Volume Ratio
            </div>
            <div className="text-2xl font-bold font-mono">{displayStock.volumeRatio.toFixed(1)}x</div>
            <div className="text-xs text-muted-foreground">
              Vol: {(displayStock.volume / 1000000).toFixed(1)}M
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Fill Rate
            </div>
            <div className="text-2xl font-bold font-mono text-success">{displayStock.historicalFillRate}%</div>
            <div className="text-xs text-muted-foreground">Historical avg</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Sentiment</div>
            <div className="text-2xl font-bold">{displayStock.sentimentLabel}</div>
            <div className="text-xs text-muted-foreground font-mono">
              Score: {(displayStock.sentiment * 100).toFixed(0)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              VWAP
            </div>
            <div className="text-2xl font-bold font-mono">${displayStock.vwap.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Market Cap: {displayStock.marketCap}</div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="text-sm text-muted-foreground mb-2">Pre-Market Range</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Low</div>
              <div className="text-lg font-mono">${displayStock.preMarketLow.toFixed(2)}</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-muted rounded-full relative overflow-hidden">
                <div
                  className="absolute h-full bg-primary rounded-full"
                  style={{
                    left: '0%',
                    width: `${((displayStock.price - displayStock.preMarketLow) / (displayStock.preMarketHigh - displayStock.preMarketLow)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">High</div>
              <div className="text-lg font-mono">${displayStock.preMarketHigh.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Price Chart
            </div>
            <div className="text-xs text-muted-foreground">
              {chartData && chartData.length > 0 && `${chartData.length} candles`}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg border border-border overflow-hidden">
            {chartLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : chartData && chartData.length > 0 ? (
              <LightweightChart
                data={chartData}
                previousClose={stock.previousClose}
                gapLevel={stock.currentPrice}
                vwap={displayStock.vwap}
                height={400}
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chart data unavailable</p>
                  <p className="text-xs mt-1">Connect backend API to enable charting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
