import { NextResponse } from 'next/server'
import { mockNews } from '@/lib/mock-data'

/**
 * GET /api/news
 * Fetch latest market news
 * 
 * Replace this with your backend API call
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    // TODO: Replace with actual backend API call
    // const backendUrl = process.env.BACKEND_API_URL
    // const url = symbol 
    //   ? `${backendUrl}/api/news?symbol=${symbol}`
    //   : `${backendUrl}/api/news`
    // const response = await fetch(url)
    // const data = await response.json()
    // return NextResponse.json(data)

    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Filter by symbol if provided
    const filteredNews = symbol
      ? mockNews.filter(news => 
          news.relatedSymbols?.includes(symbol.toUpperCase())
        )
      : mockNews

    return NextResponse.json(filteredNews, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
