'use client'

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
} from 'lucide-react'
import type { BacktestResult } from '@/lib/types'

interface BacktestViewerProps {
  result: BacktestResult
}

export function BacktestViewer({ result }: BacktestViewerProps) {
  const StatCard = ({
    label,
    value,
    subtitle,
    icon: Icon,
    positive,
  }: {
    label: string
    value: string | number
    subtitle?: string
    icon: React.ElementType
    positive?: boolean
  }) => (
    <div className="p-4 rounded-lg bg-muted/50 border border-border">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-4 w-4 ${positive ? 'text-success' : positive === false ? 'text-destructive' : 'text-muted-foreground'}`} />
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      <div className={`text-2xl font-bold font-mono ${positive ? 'text-success' : positive === false ? 'text-destructive' : ''}`}>
        {value}
      </div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  )

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Backtesting Results
        </CardTitle>
        <CardDescription className="font-mono text-xs">{result.strategy}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Win Rate"
            value={`${result.winRate.toFixed(1)}%`}
            subtitle={`${result.totalTrades} trades`}
            icon={Target}
            positive={result.winRate > 70}
          />
          <StatCard
            label="Total Return"
            value={`${result.totalReturn > 0 ? '+' : ''}${result.totalReturn.toFixed(1)}%`}
            icon={DollarSign}
            positive={result.totalReturn > 0}
          />
          <StatCard
            label="Max Drawdown"
            value={`${result.maxDrawdown.toFixed(1)}%`}
            icon={TrendingDown}
            positive={false}
          />
          <StatCard
            label="Sharpe Ratio"
            value={result.sharpeRatio.toFixed(2)}
            icon={TrendingUp}
            positive={result.sharpeRatio > 1.5}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Profit Factor"
            value={result.profitFactor.toFixed(2)}
            icon={DollarSign}
            positive={result.profitFactor > 2}
          />
          <StatCard
            label="Avg Win"
            value={`+${result.avgWin.toFixed(1)}%`}
            icon={TrendingUp}
            positive
          />
          <StatCard
            label="Avg Loss"
            value={`${result.avgLoss.toFixed(1)}%`}
            icon={TrendingDown}
            positive={false}
          />
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="text-sm font-medium mb-3 flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Equity Curve
          </div>
          <div className="h-[200px] flex items-center justify-center bg-background rounded border border-border">
            <div className="text-center text-muted-foreground">
              <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Equity curve visualization</p>
              <p className="text-xs mt-1">Integrate Recharts for full chart</p>
            </div>
          </div>
        </div>

        {result.winRate > 75 && (
          <div className="flex items-start gap-3 p-4 bg-success/10 border border-success rounded-lg">
            <TrendingUp className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-success">High-Probability Strategy</div>
              <div className="text-sm text-muted-foreground mt-1">
                This strategy shows strong historical performance with a {result.winRate.toFixed(1)}% win rate. Consider paper trading for validation.
              </div>
            </div>
          </div>
        )}

        {result.maxDrawdown < -15 && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-destructive">High Drawdown Risk</div>
              <div className="text-sm text-muted-foreground mt-1">
                Max drawdown of {result.maxDrawdown.toFixed(1)}% indicates significant risk. Implement strict risk management.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
