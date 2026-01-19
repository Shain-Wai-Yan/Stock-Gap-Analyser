'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Newspaper, ExternalLink } from 'lucide-react'
import type { NewsItem } from '@/lib/types'

interface NewsFeedProps {
  news: NewsItem[]
}

export function NewsFeed({ news }: NewsFeedProps) {
  const getSentimentBadge = (sentiment: number) => {
    if (sentiment > 0.6) {
      return <Badge className="bg-success text-success-foreground">Bullish</Badge>
    }
    if (sentiment < 0.4) {
      return <Badge variant="destructive">Bearish</Badge>
    }
    return <Badge className="bg-warning text-warning-foreground">Neutral</Badge>
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Market News Feed
        </CardTitle>
        <CardDescription>Real-time news affecting gap movements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <div className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getSentimentBadge(item.sentiment)}
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
