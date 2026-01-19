import { NextResponse } from 'next/server'

/**
 * GET /api/trades
 * Fetch all trades from backend
 */
export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://p01--stock-analyser-backend--xz6t2t2ksd68.code.run'
    const url = `${backendUrl}/api/trades`
    
    console.log('[v0] Fetching trades from backend:', url)
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      console.error('[v0] Backend trades fetch failed:', response.status)
      return NextResponse.json(
        { error: 'Failed to fetch trades from backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[v0] Backend trades response:', JSON.stringify(data, null, 2))
    
    const tradesArray = Array.isArray(data.data) ? data.data : []

    return NextResponse.json(tradesArray, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching trades:', error)
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  }
}

/**
 * POST /api/trades
 * Save a new trade to backend
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://p01--stock-analyser-backend--xz6t2t2ksd68.code.run'
    const url = `${backendUrl}/api/trades`
    
    console.log('[v0] Saving trade to backend:', url)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error('[v0] Backend trade save failed:', response.status)
      return NextResponse.json(
        { error: 'Failed to save trade to backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Error saving trade:', error)
    return NextResponse.json(
      { error: 'Failed to save trade' },
      { status: 500 }
    )
  }
}
