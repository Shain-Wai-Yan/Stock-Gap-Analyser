'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { Calculator } from 'lucide-react'

export function RiskCalculator() {
  const selectedSymbol = useStore((state) => state.selectedSymbol)
  const gaps = useStore((state) => state.gaps)
  const selectedGap = gaps.find((g) => g.symbol === selectedSymbol)

  const [riskAmount, setRiskAmount] = useState('100')
  const [entryPrice, setEntryPrice] = useState(selectedGap?.currentPrice.toFixed(2) || '')
  const [stopLoss, setStopLoss] = useState('')

  const calculatePosition = () => {
    const risk = parseFloat(riskAmount)
    const entry = parseFloat(entryPrice)
    const stop = parseFloat(stopLoss)

    if (!risk || !entry || !stop) return null

    const riskPerShare = Math.abs(entry - stop)
    if (riskPerShare === 0) return null

    const shares = Math.floor(risk / riskPerShare)
    const totalCost = shares * entry

    return {
      shares,
      totalCost,
      riskPerShare,
    }
  }

  const position = calculatePosition()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Position Size Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="risk">Risk Amount ($)</Label>
            <Input
              id="risk"
              type="number"
              value={riskAmount}
              onChange={(e) => setRiskAmount(e.target.value)}
              placeholder="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry">Entry Price ($)</Label>
            <Input
              id="entry"
              type="number"
              step="0.01"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="150.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stop">Stop Loss ($)</Label>
            <Input
              id="stop"
              type="number"
              step="0.01"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="148.00"
            />
          </div>

          {position && (
            <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shares:</span>
                <span className="font-semibold">{position.shares}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cost:</span>
                <span className="font-semibold">${position.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk/Share:</span>
                <span className="font-semibold text-destructive">
                  ${position.riskPerShare.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <Button className="w-full" disabled={!position}>
            Execute Trade (Paper)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
