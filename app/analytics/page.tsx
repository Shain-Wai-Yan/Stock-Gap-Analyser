'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  const stats = {
    totalTrades: 142,
    winRate: 78.2,
    profitFactor: 2.34,
    totalReturn: 12840,
    avgWin: 245,
    avgLoss: -105,
    maxDrawdown: 1250,
    sharpeRatio: 1.87
  }

  const recentTrades = [
    { symbol: 'NVDA', entry: 474.80, exit: 482.50, pnl: 770, date: '2026-01-17' },
    { symbol: 'TSLA', entry: 248.60, exit: 245.20, pnl: -340, date: '2026-01-16' },
    { symbol: 'AAPL', entry: 183.50, exit: 185.60, pnl: 210, date: '2026-01-15' },
    { symbol: 'MSFT', entry: 425.30, exit: 429.80, pnl: 450, date: '2026-01-14' },
  ]

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
        <p className="text-muted-foreground">Track your trading performance and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Return</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" />
              ${stats.totalReturn.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Win Rate</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {stats.winRate}%
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Profit Factor</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              {stats.profitFactor}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sharpe Ratio</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {stats.sharpeRatio}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Trades</span>
                  <span className="font-bold font-mono">{stats.totalTrades}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Average Win</span>
                  <span className="font-bold font-mono text-success">${stats.avgWin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Average Loss</span>
                  <span className="font-bold font-mono text-destructive">${stats.avgLoss}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Max Drawdown</span>
                  <span className="font-bold font-mono text-destructive">-${stats.maxDrawdown}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Win/Loss Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Winning Trades</span>
                      <span className="text-sm font-bold">{Math.round(stats.totalTrades * stats.winRate / 100)}</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success" style={{ width: `${stats.winRate}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Losing Trades</span>
                      <span className="text-sm font-bold">{Math.round(stats.totalTrades * (100 - stats.winRate) / 100)}</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive" style={{ width: `${100 - stats.winRate}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Your last 4 gap trades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTrades.map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-bold font-mono">{trade.symbol}</div>
                        <div className="text-sm text-muted-foreground">{trade.date}</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-muted-foreground">Entry: ${trade.entry}</div>
                        <div className="text-muted-foreground">Exit: ${trade.exit}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold font-mono text-lg ${trade.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                      </div>
                      <Badge variant={trade.pnl >= 0 ? 'default' : 'destructive'} className={trade.pnl >= 0 ? 'bg-success' : ''}>
                        {trade.pnl >= 0 ? 'Win' : 'Loss'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gap Pattern Performance</CardTitle>
              <CardDescription>Win rates by gap type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-semibold">Breakaway Gaps</div>
                  <div className="text-sm text-muted-foreground">Strong trend starts</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-success">85%</div>
                  <div className="text-xs text-muted-foreground">32 trades</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-semibold">Runaway Gaps</div>
                  <div className="text-sm text-muted-foreground">Momentum continuation</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-success">72%</div>
                  <div className="text-xs text-muted-foreground">48 trades</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-semibold">Exhaustion Gaps</div>
                  <div className="text-sm text-muted-foreground">Reversal signals</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-success">68%</div>
                  <div className="text-xs text-muted-foreground">42 trades</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-semibold">Common Gaps</div>
                  <div className="text-sm text-muted-foreground">Low conviction</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-warning">52%</div>
                  <div className="text-xs text-muted-foreground">20 trades</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
