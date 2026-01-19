import { NextResponse } from 'next/server'
import { mockGaps } from '@/lib/mock-data'

/**
 * GET /api/gaps
 * Fetch all current gap opportunities
 * 
 * Replace this with your backend API call:
 * const response = await fetch('YOUR_BACKEND_URL/gaps')
 * const data = await response.json()
 * return NextResponse.json(data)
 */
export async function GET() {
  try {
    // TODO: Replace with actual backend API call
    // Example:
    // const backendUrl = process.env.BACKEND_API_URL
    // const response = await fetch(`${backendUrl}/api/gaps`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`
    //   }
    // })
    // const data = await response.json()
    // return NextResponse.json(data)

    // For now, return mock data with a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return NextResponse.json(mockGaps, {
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
