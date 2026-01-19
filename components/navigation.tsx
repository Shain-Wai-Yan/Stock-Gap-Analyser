'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity, Search, Star, Bell, BarChart3, Settings, TrendingUp, Clock, Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { useGaps } from '@/lib/hooks/use-api'

export function Navigation() {
  const pathname = usePathname()
  const isMarketOpen = useStore((state) => state.isMarketOpen)
  const lastUpdate = useStore((state) => state.lastUpdate)
  const { data: gaps } = useGaps()

  const routes = [
    { href: '/', label: 'Dashboard', icon: Activity },
    { href: '/screener', label: 'Screener', icon: Search },
    { href: '/watchlist', label: 'Watchlist', icon: Star },
    { href: '/alerts', label: 'Alerts', icon: Bell },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between gap-2">
        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
          <div className="flex items-center gap-2 mr-2 md:mr-4 flex-shrink-0">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm md:text-base hidden sm:inline whitespace-nowrap">GapTrader Pro</span>
          </div>
          {routes.map((route) => {
            const Icon = route.icon
            const isActive = pathname === route.href
            
            return (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-1 md:gap-2 h-8 md:h-9 px-2 md:px-3 bg-transparent flex-shrink-0',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden md:inline text-xs md:text-sm whitespace-nowrap">{route.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
          <Badge variant="outline" className="hidden xl:flex gap-1 text-xs">
            <TrendingUp className="h-3 w-3" />
            {gaps?.length || 0} Gaps
          </Badge>
          
          {lastUpdate && (
            <div className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
              <Clock className="h-3 w-3" />
              {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          
          <Badge
            variant={isMarketOpen ? 'default' : 'secondary'}
            className={cn(
              'text-xs flex-shrink-0',
              isMarketOpen && 'bg-success'
            )}
          >
            {isMarketOpen ? (
              <>
                <Wifi className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Pre-Market</span>
              </>
            )}
          </Badge>
        </div>
      </div>
    </nav>
  )
}
