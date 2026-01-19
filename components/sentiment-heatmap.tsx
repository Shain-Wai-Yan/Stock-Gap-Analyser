'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, MessageSquare } from 'lucide-react'
import type { GapStock } from '@/lib/types'

interface SentimentHeatmapProps {
  data: GapStock[]
}

export function SentimentHeatmap({ data }: SentimentHeatmapProps) {
  const sectors = Array.from(new Set(data.map((stock) => stock.sector)))

  const getSectorStats = (sector: string) => {
    const sectorStocks = data.filter((stock) => stock.sector === sector)
    const avgSentiment =
      sectorStocks.reduce((sum, stock) => sum + stock.sentiment, 0) / sectorStocks.length
    const avgGap =
      sectorStocks.reduce((sum, stock) => sum + stock.gapPercent, 0) / sectorStocks.length
    return { avgSentiment, avgGap, count: sectorStocks.length }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.6) return 'bg-success/20 border-success text-success-foreground'
    if (sentiment < 0.4) return 'bg-destructive/20 border-destructive text-destructive-foreground'
    return 'bg-warning/20 border-warning text-warning-foreground'
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Sector Sentiment Heatmap
        </CardTitle>
        <CardDescription>
          Sentiment analysis across sectors with gap correlation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sectors.map((sector) => {
            const stats = getSectorStats(sector)
            const isPositiveGap = stats.avgGap > 0

            return (
              <div
                key={sector}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${getSentimentColor(stats.avgSentiment)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-sm">{sector}</div>
                  <Badge variant="outline" className="text-xs">
                    {stats.count} stocks
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Avg Gap</div>
                    <div className="flex items-center gap-1 font-mono font-bold">
                      {isPositiveGap ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {isPositiveGap ? '+' : ''}
                      {stats.avgGap.toFixed(2)}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Sentiment</div>
                    <div className="font-mono font-bold">
                      {(stats.avgSentiment * 100).toFixed(0)}
                    </div>
                  </div>

                  <div className="w-full bg-background/50 rounded-full h-1.5 mt-2">
                    <div
                      className="h-full rounded-full bg-current transition-all"
                      style={{ width: `${stats.avgSentiment * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
