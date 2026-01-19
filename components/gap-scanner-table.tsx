'use client'

import { useState, useMemo } from 'react'
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, TrendingUp, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GapBadge } from './gap-badge'
import { ConvictionBadge } from './conviction-badge'
import { AdvancedFilters } from './advanced-filters'
import { useStore } from '@/lib/store'
import type { GapData, FilterState } from '@/lib/types'

interface GapScannerTableProps {
  data: GapData[]
  onRowClick?: (row: GapData) => void
}

export function GapScannerTable({ data, onRowClick }: GapScannerTableProps) {
  const setSelectedSymbol = useStore((state) => state.setSelectedSymbol)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'gapPercent', desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    gapRange: [-50, 50],
    volumeRatioMin: 1.0,
    sentimentMin: 0,
    fillRateMin: 0,
    sectors: [],
    conviction: [],
    marketCapRange: [],
  })

  // Apply advanced filters to data
  const filteredData = useMemo(() => {
    return data.filter((gap) => {
      // Gap range filter
      if (gap.gapPercent < advancedFilters.gapRange[0] || gap.gapPercent > advancedFilters.gapRange[1]) {
        return false
      }

      // Volume ratio filter
      if (gap.volumeRatio < advancedFilters.volumeRatioMin) {
        return false
      }

      // Sentiment filter
      if (gap.sentimentScore < advancedFilters.sentimentMin) {
        return false
      }

      // Fill rate filter
      if (gap.historicalFillRate < advancedFilters.fillRateMin) {
        return false
      }

      // Sectors filter
      if (advancedFilters.sectors.length > 0 && !advancedFilters.sectors.includes(gap.sector)) {
        return false
      }

      // Conviction filter
      if (advancedFilters.conviction.length > 0 && !advancedFilters.conviction.includes(gap.conviction)) {
        return false
      }

      return true
    })
  }, [data, advancedFilters])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (advancedFilters.gapRange[0] !== -50 || advancedFilters.gapRange[1] !== 50) count++
    if (advancedFilters.volumeRatioMin > 1.0) count++
    if (advancedFilters.sentimentMin > 0) count++
    if (advancedFilters.fillRateMin > 0) count++
    if (advancedFilters.sectors.length > 0) count++
    if (advancedFilters.conviction.length > 0) count++
    if (advancedFilters.marketCapRange.length > 0) count++
    return count
  }, [advancedFilters])

  const columns: ColumnDef<GapData>[] = [
    {
      accessorKey: 'symbol',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-mono"
        >
          Symbol
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono font-bold text-foreground">{row.getValue('symbol')}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Company',
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-muted-foreground">
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'gapPercent',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Gap %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <GapBadge gapPercent={row.getValue('gapPercent')} />,
    },
    {
      accessorKey: 'currentPrice',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono">${row.getValue<number>('currentPrice').toFixed(2)}</div>
      ),
    },
    {
      accessorKey: 'volumeRatio',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Vol Ratio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const ratio = row.getValue<number>('volumeRatio')
        return (
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="font-mono">{ratio.toFixed(1)}x</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'sentimentScore',
      header: 'Sentiment',
      cell: ({ row }) => {
        const sentiment = row.getValue<number>('sentimentScore')
        const label =
          sentiment > 0.6 ? 'Bullish' : sentiment < 0.4 ? 'Bearish' : 'Neutral'
        const color =
          sentiment > 0.6 ? 'text-success' : sentiment < 0.4 ? 'text-destructive' : 'text-warning'
        return (
          <div className="flex items-center gap-2">
            <div className={`text-sm font-medium ${color}`}>{label}</div>
            <div className="text-xs text-muted-foreground font-mono">
              {(sentiment * 100).toFixed(0)}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'historicalFillRate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fill Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const fillRate = row.getValue<number>('historicalFillRate')
        const color = fillRate > 70 ? 'text-success' : fillRate > 60 ? 'text-warning' : 'text-muted-foreground'
        return <div className={`font-mono font-semibold ${color}`}>{fillRate}%</div>
      },
    },
    {
      accessorKey: 'conviction',
      header: 'Conviction',
      cell: ({ row }) => <ConvictionBadge conviction={row.getValue('conviction')} />,
    },
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 md:gap-4 flex-wrap">
        <Input
          placeholder="Filter by symbol..."
          value={(table.getColumn('symbol')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('symbol')?.setFilterValue(event.target.value)}
          className="max-w-xs font-mono h-9"
        />
        <AdvancedFilters 
          onApplyFilters={setAdvancedFilters}
          activeFiltersCount={activeFiltersCount}
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
          <TrendingUp className="h-4 w-4" />
          <span className="whitespace-nowrap">
            {filteredData.length} of {data.length} gaps
          </span>
        </div>
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => setSelectedSymbol(row.original.symbol)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No gaps detected. Market scanning in progress...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
