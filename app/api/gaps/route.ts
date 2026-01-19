import { NextResponse } from 'next/server'

/**
 * GET /api/gaps
 * Fetch all current gap opportunities from backend
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const minGap = searchParams.get('min_gap') || '1.0'
    const maxGap = searchParams.get('max_gap') || '10.0'
    const limit = searchParams.get('limit') || '50'

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_URL
    
    if (!backendUrl) {
      console.error('[v0] NEXT_PUBLIC_API_URL not set')
      return NextResponse.json(
        { error: 'Backend URL not configured. Please set NEXT_PUBLIC_API_URL environment variable.' },
        { status: 503 }
      )
    }
    
    const url = `${backendUrl}/api/gaps?min_gap=${minGap}&max_gap=${maxGap}&limit=${limit}`
    
    console.log('[v0] Fetching gaps from backend:', url)
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    })

    if (!response.ok) {
      console.error('[v0] Backend gaps fetch failed:', response.status)
      return NextResponse.json(
        { error: 'Failed to fetch gaps from backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[v0] Backend gaps response:', JSON.stringify(data, null, 2))
    
    // Backend returns array directly: [...gaps...]
    const backendGaps = Array.isArray(data) ? data : []
    
    console.log('[v0] Backend gaps count:', backendGaps.length)
    
    // Map backend gaps to frontend GapData schema
    const transformedGaps = backendGaps.map((gap: any) => ({
      symbol: gap.symbol || '',
      name: gap.name || gap.symbol || '',
      gapPercent: gap.gap_percent || 0,
      currentPrice: gap.current_price || 0,
      previousClose: gap.previous_close || 0,
      volume: gap.volume || 0,
      volumeRatio: gap.volume_ratio || 1,
      sentimentScore: gap.sentiment_score || 0.5,
      historicalFillRate: gap.historical_fill_rate || 65,
      conviction: mapConviction(gap.conviction),
      sector: gap.sector || 'Unknown',
      marketCap: gap.market_cap || 'Unknown',
      preMarketHigh: gap.premarket_high || gap.current_price || 0,
      preMarketLow: gap.premarket_low || gap.current_price || 0,
      vwap: gap.vwap || gap.current_price || 0,
      gapFillProbability: 0.65, // Default from historical fill rate
      reasons: [],
      timestamp: gap.last_updated || new Date().toISOString(),
    }))
    
    console.log('[v0] Transformed gaps:', JSON.stringify(transformedGaps, null, 2))

    return NextResponse.json(transformedGaps, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching gaps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gap data' },
      { status: 500 }
    )
  }
}

function mapConviction(backendConviction: string | undefined): 'high' | 'medium' | 'low' {
  const conviction = (backendConviction || 'LOW').toUpperCase()
  if (conviction === 'HIGH') return 'high'
  if (conviction === 'MEDIUM') return 'medium'
  return 'low'
}
