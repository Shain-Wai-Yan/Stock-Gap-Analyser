'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSectorData } from '@/lib/hooks/use-api'
import { Loader2 } from 'lucide-react'

export function SectorTreemap() {
  const { data: sectors, isLoading } = useSectorData()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sector Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!sectors) return null

  const maxGapCount = Math.max(...sectors.map((s) => s.gapCount))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {sectors.map((sector) => {
            const intensity = sector.gapCount / maxGapCount
            const sentimentColor =
              sector.sentiment > 0.5
                ? 'bg-success/80'
                : sector.sentiment > 0
                  ? 'bg-warning/80'
                  : 'bg-destructive/80'

            return (
              <div
                key={sector.name}
                className={`${sentimentColor} rounded p-4 flex flex-col justify-between transition-all hover:scale-105 cursor-pointer`}
                style={{
                  height: `${80 + intensity * 100}px`,
                  opacity: 0.6 + intensity * 0.4,
                }}
              >
                <div>
                  <div className="text-sm font-semibold text-foreground">{sector.name}</div>
                  <div className="text-xs text-foreground/80 mt-1">
                    {sector.gapCount} gaps
                  </div>
                </div>
                <div className="text-lg font-bold text-foreground">
                  {(sector.sentiment * 100).toFixed(0)}%
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
