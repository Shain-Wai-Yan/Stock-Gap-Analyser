'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Filter, X, Save } from 'lucide-react'
import type { FilterState } from '@/lib/types'

const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Cyclical',
  'Communication Services',
  'Industrials',
  'Consumer Defensive',
  'Energy',
  'Basic Materials',
  'Real Estate',
  'Utilities',
]

const MARKET_CAPS = [
  { value: 'micro', label: 'Micro (<$300M)' },
  { value: 'small', label: 'Small ($300M-$2B)' },
  { value: 'mid', label: 'Mid ($2B-$10B)' },
  { value: 'large', label: 'Large (>$10B)' },
]

const PRESET_FILTERS = {
  'High Conviction Only': {
    gapRange: [2, 50] as [number, number],
    volumeRatioMin: 2.0,
    sentimentMin: 0.6,
    fillRateMin: 70,
    conviction: ['high' as const],
  },
  'Gap Downs': {
    gapRange: [-50, -2] as [number, number],
    volumeRatioMin: 1.5,
    sentimentMin: 0,
    fillRateMin: 0,
    conviction: [],
  },
  'Tech Sector Gaps': {
    gapRange: [2, 50] as [number, number],
    sectors: ['Technology', 'Communication Services'],
    volumeRatioMin: 1.5,
    sentimentMin: 0,
    fillRateMin: 0,
    conviction: [],
  },
}

interface AdvancedFiltersProps {
  onApplyFilters: (filters: FilterState) => void
  activeFiltersCount?: number
}

export function AdvancedFilters({ onApplyFilters, activeFiltersCount = 0 }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    gapRange: [-50, 50],
    volumeRatioMin: 1.0,
    sentimentMin: 0,
    fillRateMin: 0,
    sectors: [],
    conviction: [],
    marketCapRange: [],
  })

  const [isOpen, setIsOpen] = useState(false)

  const applyFilters = () => {
    onApplyFilters(filters)
    setIsOpen(false)
  }

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      gapRange: [-50, 50],
      volumeRatioMin: 1.0,
      sentimentMin: 0,
      fillRateMin: 0,
      sectors: [],
      conviction: [],
      marketCapRange: [],
    }
    setFilters(defaultFilters)
    onApplyFilters(defaultFilters)
  }

  const applyPreset = (presetName: keyof typeof PRESET_FILTERS) => {
    const preset = PRESET_FILTERS[presetName]
    const newFilters = { ...filters, ...preset }
    setFilters(newFilters)
  }

  const toggleSector = (sector: string) => {
    setFilters((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter((s) => s !== sector)
        : [...prev.sectors, sector],
    }))
  }

  const toggleConviction = (conv: 'high' | 'medium' | 'low') => {
    setFilters((prev) => ({
      ...prev,
      conviction: prev.conviction.includes(conv)
        ? prev.conviction.filter((c) => c !== conv)
        : [...prev.conviction, conv],
    }))
  }

  const toggleMarketCap = (cap: 'micro' | 'small' | 'mid' | 'large') => {
    setFilters((prev) => ({
      ...prev,
      marketCapRange: prev.marketCapRange.includes(cap)
        ? prev.marketCapRange.filter((m) => m !== cap)
        : [...prev.marketCapRange, cap],
    }))
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 relative bg-transparent">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-[80vh] overflow-y-auto" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Advanced Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 text-xs bg-transparent"
            >
              <X className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(PRESET_FILTERS).map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset as keyof typeof PRESET_FILTERS)}
                  className="text-xs bg-transparent"
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>

          {/* Gap Range */}
          <div className="space-y-2">
            <Label>Gap Range (%)</Label>
            <Slider
              value={filters.gapRange}
              onValueChange={(value) =>
                setFilters({ ...filters, gapRange: value as [number, number] })
              }
              min={-50}
              max={50}
              step={0.5}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{filters.gapRange[0]}%</span>
              <span>{filters.gapRange[1]}%</span>
            </div>
          </div>

          {/* Volume Ratio */}
          <div className="space-y-2">
            <Label>Minimum Volume Ratio</Label>
            <Input
              type="number"
              value={filters.volumeRatioMin}
              onChange={(e) =>
                setFilters({ ...filters, volumeRatioMin: parseFloat(e.target.value) || 0 })
              }
              step={0.1}
              min={0}
              className="h-9"
            />
          </div>

          {/* Sentiment Score */}
          <div className="space-y-2">
            <Label>Minimum Sentiment Score</Label>
            <Slider
              value={[filters.sentimentMin]}
              onValueChange={(value) =>
                setFilters({ ...filters, sentimentMin: value[0] })
              }
              min={0}
              max={1}
              step={0.1}
              className="py-4"
            />
            <div className="text-xs text-muted-foreground text-center">
              {(filters.sentimentMin * 100).toFixed(0)}%
            </div>
          </div>

          {/* Fill Rate */}
          <div className="space-y-2">
            <Label>Minimum Fill Rate</Label>
            <Slider
              value={[filters.fillRateMin]}
              onValueChange={(value) =>
                setFilters({ ...filters, fillRateMin: value[0] })
              }
              min={0}
              max={100}
              step={5}
              className="py-4"
            />
            <div className="text-xs text-muted-foreground text-center">
              {filters.fillRateMin}%
            </div>
          </div>

          {/* Conviction Levels */}
          <div className="space-y-2">
            <Label>Conviction Level</Label>
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as const).map((conv) => (
                <div key={conv} className="flex items-center space-x-2">
                  <Checkbox
                    id={conv}
                    checked={filters.conviction.includes(conv)}
                    onCheckedChange={() => toggleConviction(conv)}
                  />
                  <label
                    htmlFor={conv}
                    className="text-sm font-medium capitalize cursor-pointer"
                  >
                    {conv}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Market Cap */}
          <div className="space-y-2">
            <Label>Market Cap</Label>
            <div className="grid grid-cols-2 gap-2">
              {MARKET_CAPS.map((cap) => (
                <div key={cap.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={cap.value}
                    checked={filters.marketCapRange.includes(cap.value as any)}
                    onCheckedChange={() => toggleMarketCap(cap.value as any)}
                  />
                  <label
                    htmlFor={cap.value}
                    className="text-xs cursor-pointer"
                  >
                    {cap.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sectors */}
          <div className="space-y-2">
            <Label>Sectors</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
              {SECTORS.map((sector) => (
                <div key={sector} className="flex items-center space-x-2">
                  <Checkbox
                    id={sector}
                    checked={filters.sectors.includes(sector)}
                    onCheckedChange={() => toggleSector(sector)}
                  />
                  <label
                    htmlFor={sector}
                    className="text-xs cursor-pointer"
                  >
                    {sector}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
