import { Badge } from '@/components/ui/badge'
import { Flame, AlertTriangle, AlertCircle } from 'lucide-react'

interface ConvictionBadgeProps {
  conviction: 'high' | 'medium' | 'low'
}

export function ConvictionBadge({ conviction }: ConvictionBadgeProps) {
  const variants = {
    high: {
      icon: Flame,
      label: 'High Conviction',
      className: 'bg-success text-success-foreground border-success',
    },
    medium: {
      icon: AlertTriangle,
      label: 'Medium',
      className: 'bg-warning text-warning-foreground border-warning',
    },
    low: {
      icon: AlertCircle,
      label: 'Low',
      className: 'bg-muted text-muted-foreground border-border',
    },
  }

  const config = variants[conviction]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}
