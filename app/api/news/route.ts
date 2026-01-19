import { NextResponse } from 'next/server'

/**
 * GET /api/news
 * Fetch latest market news from backend
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const limit = searchParams.get('limit') || '10'

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://p01--stock-analyser-backend--xz6t2t2ksd68.code.run'
    const url = symbol 
      ? `${backendUrl}/api/news/${symbol}?limit=${limit}`
      : `${backendUrl}/api/news?limit=${limit}`
    
    console.log('[v0] Fetching news from backend:', url)
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error('[v0] Backend news fetch failed:', response.status)
      return NextResponse.json(
        { error: 'Failed to fetch news from backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[v0] Backend news raw response type:', typeof data)
    console.log('[v0] Backend news response keys:', Object.keys(data || {}))
    console.log('[v0] Backend news response:', JSON.stringify(data, null, 2))
    
    // Backend returns { success: true, data: [...], count: n }
    // Extract the data array - it's already in data.data
    let newsArray: any[] = []
    
    if (Array.isArray(data)) {
      // Response is directly an array
      newsArray = data
    } else if (data && Array.isArray(data.data)) {
      // Response is wrapped in { data: [...] }
      newsArray = data.data
    } else {
      console.error('[v0] Unexpected news response format:', data)
    }
    
    console.log('[v0] Extracted news array length:', newsArray.length)
    console.log('[v0] First news item:', newsArray[0])

    return NextResponse.json(newsArray, {
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
