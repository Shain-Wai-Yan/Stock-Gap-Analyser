'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGapReason } from '@/lib/hooks/use-api'
import { useStore } from '@/lib/store'
import { Brain, Loader2 } from 'lucide-react'

export function GapReasonWidget() {
  const selectedSymbol = useStore((state) => state.selectedSymbol)
  const { data: reason, isLoading } = useGapReason(selectedSymbol)

  if (!selectedSymbol) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a stock to see AI-powered gap analysis
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!reason) return null

  const confidenceColor =
    reason.confidence > 0.8
      ? 'bg-success'
      : reason.confidence > 0.6
        ? 'bg-warning'
        : 'bg-destructive'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Gap Analysis - {selectedSymbol}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Confidence:</span>
            <Badge className={confidenceColor}>
              {(reason.confidence * 100).toFixed(0)}%
            </Badge>
          </div>
          <p className="text-sm leading-relaxed">{reason.reason}</p>
        </div>
      </CardContent>
    </Card>
  )
}
