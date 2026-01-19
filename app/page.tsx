'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GapScannerTable } from '@/components/gap-scanner-table'
import { StockChart } from '@/components/stock-chart'
import { SentimentHeatmap } from '@/components/sentiment-heatmap'
import { NewsFeed } from '@/components/news-feed'
import { BacktestViewer } from '@/components/backtest-viewer'
import { TopPlays } from '@/components/top-plays'
import { CommandPalette } from '@/components/command-palette'
import { SectorTreemap } from '@/components/sector-treemap'
import { GapReasonWidget } from '@/components/gap-reason-widget'
import { RiskCalculator } from '@/components/risk-calculator'
import { TradeJournal } from '@/components/trade-journal'
import { useStore } from '@/lib/store'
import { useGaps, useNews, useBacktest } from '@/lib/hooks/use-api'
import { useRealtimeGaps } from '@/lib/hooks/use-websocket'
import { useAlertMonitor } from '@/lib/hooks/use-alerts'
import { Activity, TrendingUp, Clock, Wifi, WifiOff, BellRing } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const selectedSymbol = useStore((state) => state.selectedSymbol)
  const isMarketOpen = useStore((state) => state.isMarketOpen)
  const lastUpdate = useStore((state) => state.lastUpdate)

  // Data fetching with auto-refresh
  const { data: gaps, isLoading: gapsLoading, error: gapsError } = useGaps(30000)
  const { data: news, isLoading: newsLoading } = useNews()
  const { data: backtestResult } = useBacktest(selectedSymbol)

  // WebSocket for real-time updates (only if configured)
  const { status: wsStatus } = useRealtimeGaps()
  
  // Alert monitoring
  const { triggeredAlerts, notificationsEnabled } = useAlertMonitor(gaps || [], true)
  
  // Show toast notifications for triggered alerts
  useEffect(() => {
    if (triggeredAlerts.length > 0) {
      triggeredAlerts.forEach(alert => {
        toast.success(`Alert: ${alert.symbol}`, {
          description: `${alert.type} condition met: ${alert.condition} ${alert.value}`,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/alerts',
          },
        })
      })
    }
  }, [triggeredAlerts])

  const displayGaps = gaps || []
  const displayNews = news || []
  
  const getWSStatusColor = () => {
    switch (wsStatus) {
      case 'connected': return 'text-success'
      case 'connecting': return 'text-warning'
      case 'error': return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-10">
      <CommandPalette />
      
      {/* Main Content */}
      <main className="container px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Top Section - High Conviction Plays */}
        <TopPlays gaps={displayGaps.slice(0, 3)} />

        {/* API Error Display */}
        {gapsError && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">API Connection Error</CardTitle>
              <CardDescription>
                Unable to connect to backend. Using mock data. Set NEXT_PUBLIC_API_URL environment variable.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Scanner & Chart */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            {/* Gap Scanner */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg md:text-xl">Gap Scanner</CardTitle>
                    <CardDescription className="text-sm">
                      Real-time pre-market and intraday gap detection
                    </CardDescription>
                  </div>
                  {gapsLoading && <Activity className="h-5 w-5 animate-spin text-muted-foreground" />}
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <GapScannerTable data={displayGaps} />
              </CardContent>
            </Card>

            {/* Tabs for Different Views */}
            <Tabs defaultValue="chart" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                <TabsTrigger value="chart" className="text-xs sm:text-sm">Chart</TabsTrigger>
                <TabsTrigger value="backtest" className="text-xs sm:text-sm">Backtest</TabsTrigger>
                <TabsTrigger value="sentiment" className="text-xs sm:text-sm">Sentiment</TabsTrigger>
                <TabsTrigger value="sectors" className="text-xs sm:text-sm">Sectors</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-4">
                <StockChart symbol={selectedSymbol} />
              </TabsContent>

              <TabsContent value="backtest" className="space-y-4">
                {backtestResult ? (
                  <BacktestViewer result={backtestResult} />
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                      Select a stock to view backtest results
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="sentiment" className="space-y-4">
                <SentimentHeatmap />
              </TabsContent>

              <TabsContent value="sectors" className="space-y-4">
                <SectorTreemap />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* AI Gap Reason */}
            <GapReasonWidget />

            {/* Risk Calculator */}
            <RiskCalculator />

            {/* Trade Journal */}
            <TradeJournal />

            {/* News Feed */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl">Market News</CardTitle>
                <CardDescription className="text-sm">Latest gap-related headlines</CardDescription>
              </CardHeader>
              <CardContent>
                {newsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Activity className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <NewsFeed news={displayNews} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 z-40">
        <div className="container px-4 flex h-10 items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
            <span className="whitespace-nowrap">API: {gapsError ? 'Error' : process.env.NEXT_PUBLIC_API_URL ? 'Connected' : 'Mock'}</span>
            <span className="hidden sm:inline">•</span>
            <span className={`whitespace-nowrap hidden sm:inline ${getWSStatusColor()}`}>
              WS: {wsStatus.charAt(0).toUpperCase() + wsStatus.slice(1)}
            </span>
            <span className="hidden md:inline">•</span>
            <span className={`whitespace-nowrap hidden md:inline flex items-center gap-1 ${notificationsEnabled ? 'text-success' : 'text-muted-foreground'}`}>
              <BellRing className="h-3 w-3" />
              Alerts: {notificationsEnabled ? 'On' : 'Off'}
            </span>
            {lastUpdate && (
              <>
                <span className="hidden lg:inline">•</span>
                <span className="whitespace-nowrap hidden lg:inline">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </span>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center gap-1">
            Press <kbd className="px-1.5 py-0.5 text-[10px] border rounded bg-muted">⌘K</kbd> for commands
          </div>
        </div>
      </footer>
    </div>
  )
}
