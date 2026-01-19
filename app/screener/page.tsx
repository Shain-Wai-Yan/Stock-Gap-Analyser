'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Download, RefreshCw } from 'lucide-react'
import { GapScannerTable } from '@/components/gap-scanner-table'
import { useGaps } from '@/lib/hooks/use-api'
import { useSearchParams } from 'next/navigation'
import Loading from './loading'

export default function ScreenerPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    minGap: 2,
    maxGap: 10,
    minVolume: 1.5,
    minSentiment: 0.5,
    minFillRate: 60,
    sector: 'all',
    marketCap: 'all',
    conviction: 'all'
  })

  const { data: gaps, isLoading, refetch } = useGaps()

  const filteredGaps = (gaps || []).filter(gap => {
    const gapAbs = Math.abs(gap.gapPercent)
    if (gapAbs < filters.minGap || gapAbs > filters.maxGap) return false
    if (gap.volumeRatio < filters.minVolume) return false
    if (gap.sentimentScore < filters.minSentiment) return false
    if (gap.historicalFillRate < filters.minFillRate) return false
    if (filters.sector !== 'all' && gap.sector !== filters.sector) return false
    if (filters.conviction !== 'all' && gap.conviction !== filters.conviction) return false
    return true
  })

  const resetFilters = () => {
    setFilters({
      minGap: 2,
      maxGap: 10,
      minVolume: 1.5,
      minSentiment: 0.5,
      minFillRate: 60,
      sector: 'all',
      marketCap: 'all',
      conviction: 'all'
    })
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gap Screener</h1>
          <p className="text-muted-foreground">Advanced filtering for gap trading opportunities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>Customize your scan criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Gap Range</Label>
                <Badge variant="outline">{filters.minGap}% - {filters.maxGap}%</Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Min Gap %</Label>
                  <Slider
                    value={[filters.minGap]}
                    onValueChange={([value]) => setFilters({ ...filters, minGap: value })}
                    min={0}
                    max={10}
                    step={0.5}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max Gap %</Label>
                  <Slider
                    value={[filters.maxGap]}
                    onValueChange={([value]) => setFilters({ ...filters, maxGap: value })}
                    min={filters.minGap}
                    max={20}
                    step={0.5}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Min Volume Ratio</Label>
                <Badge variant="outline">{filters.minVolume}x</Badge>
              </div>
              <Slider
                value={[filters.minVolume]}
                onValueChange={([value]) => setFilters({ ...filters, minVolume: value })}
                min={1}
                max={5}
                step={0.1}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Min Sentiment</Label>
                <Badge variant="outline">{(filters.minSentiment * 100).toFixed(0)}%</Badge>
              </div>
              <Slider
                value={[filters.minSentiment]}
                onValueChange={([value]) => setFilters({ ...filters, minSentiment: value })}
                min={0}
                max={1}
                step={0.1}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Min Fill Rate</Label>
                <Badge variant="outline">{filters.minFillRate}%</Badge>
              </div>
              <Slider
                value={[filters.minFillRate]}
                onValueChange={([value]) => setFilters({ ...filters, minFillRate: value })}
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div>
              <Label>Sector</Label>
              <Select value={filters.sector} onValueChange={(value) => setFilters({ ...filters, sector: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Conviction</Label>
              <Select value={filters.conviction} onValueChange={(value) => setFilters({ ...filters, conviction: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High Only</SelectItem>
                  <SelectItem value="medium">Medium Only</SelectItem>
                  <SelectItem value="low">Low Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full bg-transparent" onClick={resetFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Results</CardTitle>
                  <CardDescription>{filteredGaps.length} stocks match your criteria</CardDescription>
                </div>
                <Badge className="bg-primary">{filteredGaps.length} Results</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredGaps.length > 0 ? (
                <GapScannerTable data={filteredGaps} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters to see more stocks</p>
                  <Button variant="outline" onClick={resetFilters} className="bg-transparent">
                    Reset Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
