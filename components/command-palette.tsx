'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useStore } from '@/lib/store'
import { TrendingUp, BarChart3, Newspaper, Calculator } from 'lucide-react'

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const gaps = useStore((state) => state.gaps)
  const setSelectedSymbol = useStore((state) => state.setSelectedSymbol)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelectSymbol = (symbol: string) => {
    setSelectedSymbol(symbol)
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search stocks..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Stocks">
          {gaps.slice(0, 10).map((gap) => (
            <CommandItem
              key={gap.symbol}
              onSelect={() => handleSelectSymbol(gap.symbol)}
              className="cursor-pointer"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>{gap.symbol}</span>
              <span className="ml-2 text-muted-foreground">
                {gap.gapPercent > 0 ? '+' : ''}{gap.gapPercent.toFixed(2)}%
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Views">
          <CommandItem onSelect={() => setOpen(false)} className="cursor-pointer">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Scanner</span>
          </CommandItem>
          <CommandItem onSelect={() => setOpen(false)} className="cursor-pointer">
            <Newspaper className="mr-2 h-4 w-4" />
            <span>News Feed</span>
          </CommandItem>
          <CommandItem onSelect={() => setOpen(false)} className="cursor-pointer">
            <Calculator className="mr-2 h-4 w-4" />
            <span>Backtest</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
