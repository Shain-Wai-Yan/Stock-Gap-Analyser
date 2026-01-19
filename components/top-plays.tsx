'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flame, TrendingUp, Activity, Sparkles, ExternalLink } from 'lucide-react'
import type { GapStock } from '@/lib/types'
import { GapBadge } from './gap-badge'

interface TopPlaysProps {
  plays?: GapStock[]
}

export function TopPlays({ plays = [] }: TopPlaysProps) {
  const topThree = plays.filter((p) => p.conviction === 'high').slice(0, 3)

  return (
    <Card className="border-border bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-success" />
          Top 3 High-Conviction Plays
        </CardTitle>
        <CardDescription>AI-analyzed opportunities with best confluence signals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {topThree.map((play, index) => (
          <div
            key={play.symbol}
            className="p-4 rounded-lg border-2 border-success/20 bg-card hover:border-success/40 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-success text-success-foreground font-bold text-base px-3 py-1">
                  #{index + 1}
                </Badge>
                <div>
                  <div className="font-bold text-lg font-mono">{play.symbol}</div>
                  <div className="text-sm text-muted-foreground">{play.company}</div>
                </div>
              </div>
              <GapBadge gapPercent={play.gapPercent} size="lg" />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 rounded bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Vol Ratio</div>
                <div className="font-bold font-mono flex items-center justify-center gap-1">
                  <Activity className="h-3 w-3 text-primary" />
                  {play.volumeRatio.toFixed(1)}x
                </div>
              </div>
              <div className="text-center p-2 rounded bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Fill Rate</div>
                <div className="font-bold font-mono text-success">{play.historicalFillRate}%</div>
              </div>
              <div className="text-center p-2 rounded bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Sentiment</div>
                <div className="font-bold font-mono">{(play.sentiment * 100).toFixed(0)}</div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
              <Sparkles className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">AI Reasoning: </span>
                {play.gapPercent > 0 ? 'Bullish' : 'Bearish'} gap of{' '}
                {Math.abs(play.gapPercent).toFixed(1)}% with {play.volumeRatio.toFixed(1)}x
                volume surge and {play.sentimentLabel.toLowerCase()} sentiment. Historical fill
                rate of {play.historicalFillRate}% indicates high probability of gap fill within
                48 hours.
              </div>
            </div>

            <Button variant="outline" className="w-full mt-3 group-hover:bg-success group-hover:text-success-foreground transition-colors bg-transparent">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Full Analysis
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
          </div>
        ))}

        {topThree.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Flame className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No high-conviction plays detected at this time.</p>
            <p className="text-sm mt-1">Scanning for new opportunities...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
