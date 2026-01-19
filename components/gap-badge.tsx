import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface GapBadgeProps {
  gapPercent: number
  size?: 'sm' | 'md' | 'lg'
}

export function GapBadge({ gapPercent, size = 'md' }: GapBadgeProps) {
  const isPositive = gapPercent > 0
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <Badge
      variant={isPositive ? 'default' : 'destructive'}
      className={`flex items-center gap-1 font-mono ${sizeClasses[size]}`}
    >
      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isPositive ? '+' : ''}
      {gapPercent.toFixed(2)}%
    </Badge>
  )
}
