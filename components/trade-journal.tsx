'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { useSaveTrade, useTrades } from '@/lib/hooks/use-api'
import { BookOpen, Save } from 'lucide-react'
import { toast } from 'sonner'

export function TradeJournal() {
  const selectedSymbol = useStore((state) => state.selectedSymbol)
  const [reason, setReason] = useState('')
  const saveTrade = useSaveTrade()
  const { data: trades } = useTrades()

  const handleSave = async () => {
    if (!selectedSymbol || !reason.trim()) {
      toast.error('Please select a stock and enter a reason')
      return
    }

    try {
      await saveTrade.mutateAsync({
        symbol: selectedSymbol,
        reason: reason.trim(),
        entry: 0,
        stop: 0,
        target: 0,
      })
      
      toast.success('Trade logged successfully')
      setReason('')
    } catch (error) {
      toast.error('Failed to save trade')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Trade Journal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Why am I taking this trade? What's my thesis?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!selectedSymbol || !reason.trim() || saveTrade.isPending}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Trade Note
          </Button>

          {trades && trades.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold">Recent Entries</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {trades.slice(0, 3).map((trade: any, idx: number) => (
                  <div key={idx} className="p-2 bg-muted rounded text-xs">
                    <div className="font-semibold">{trade.symbol}</div>
                    <div className="text-muted-foreground line-clamp-2">
                      {trade.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
