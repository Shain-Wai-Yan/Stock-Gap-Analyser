'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Star, TrendingUp, TrendingDown } from 'lucide-react'
import { useStore } from '@/lib/store'

interface WatchlistItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  alertPrice?: number
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 482.50, change: 8.70, changePercent: 1.84 },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 245.20, change: -3.40, changePercent: -1.37 },
    { symbol: 'AAPL', name: 'Apple Inc', price: 185.60, change: 2.10, changePercent: 1.14 },
  ])
  const [newSymbol, setNewSymbol] = useState('')
  const setSelectedSymbol = useStore((state) => state.setSelectedSymbol)

  const addToWatchlist = () => {
    if (newSymbol && !watchlist.find(item => item.symbol === newSymbol.toUpperCase())) {
      setWatchlist([...watchlist, {
        symbol: newSymbol.toUpperCase(),
        name: 'Loading...',
        price: 0,
        change: 0,
        changePercent: 0
      }])
      setNewSymbol('')
    }
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol))
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
        <p className="text-muted-foreground">Track your favorite stocks and set price alerts</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Symbol</CardTitle>
          <CardDescription>Add stocks to monitor for gap opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter symbol (e.g., NVDA)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
              className="max-w-xs"
            />
            <Button onClick={addToWatchlist} disabled={!newSymbol}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {watchlist.map((item) => (
          <Card key={item.symbol} className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-warning"
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </Button>
                  <div onClick={() => setSelectedSymbol(item.symbol)}>
                    <div className="font-bold text-xl font-mono">{item.symbol}</div>
                    <div className="text-sm text-muted-foreground">{item.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold">${item.price.toFixed(2)}</div>
                    <div className="flex items-center gap-1">
                      {item.changePercent >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className={item.changePercent >= 0 ? 'text-success' : 'text-destructive'}>
                        {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Set Alert</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromWatchlist(item.symbol)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {watchlist.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Star className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
            <p className="text-muted-foreground mb-4">Add stocks to track them for gap opportunities</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
