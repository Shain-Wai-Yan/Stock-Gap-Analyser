'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useStore } from '../store'
import { GapArraySchema, validateData } from '../validation'
import { toast } from '@/hooks/use-toast'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/gaps'
const HEARTBEAT_INTERVAL = 30000 // 30 seconds
const RECONNECT_DELAY = 5000 // 5 seconds
const MAX_RECONNECT_ATTEMPTS = 10

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export function useRealtimeGaps() {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  
  const [status, setStatus] = useState<WebSocketStatus>('disconnected')
  const setGaps = useStore((state) => state.setGaps)
  const setIsMarketOpen = useStore((state) => state.setIsMarketOpen)
  const setLastUpdate = useStore((state) => state.setLastUpdate)

  const cleanup = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current)
      heartbeatTimerRef.current = null
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    // Don't connect if no WebSocket URL configured
    if (!process.env.NEXT_PUBLIC_WS_URL) {
      console.log('[v0] WebSocket URL not configured, skipping connection')
      return
    }

    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[v0] Max WebSocket reconnection attempts reached')
      setStatus('error')
      toast({
        title: 'Connection Failed',
        description: 'Unable to establish real-time connection. Using polling mode.',
        variant: 'destructive',
      })
      return
    }

    cleanup()
    setStatus('connecting')
    console.log('[v0] Connecting to WebSocket:', WS_URL)

    try {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('[v0] WebSocket connected successfully')
        setStatus('connected')
        reconnectAttemptsRef.current = 0

        // Send heartbeat every 30 seconds
        heartbeatTimerRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }))
          }
        }, HEARTBEAT_INTERVAL)

        // Show success toast only after first reconnect
        if (reconnectAttemptsRef.current > 0) {
          toast({
            title: 'Connected',
            description: 'Real-time data stream restored',
          })
        }
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)

          // Handle pong response
          if (message.type === 'pong') {
            return
          }

          // Handle gap updates
          if (message.type === 'gap_update' && message.data) {
            const validatedGaps = validateData(GapArraySchema, message.data, 'WebSocket gaps')
            setGaps(validatedGaps)
            setLastUpdate(new Date())
          }

          // Handle new high-conviction gap alerts
          if (message.type === 'gap_new' && message.data) {
            const gap = message.data
            if (gap.conviction === 'high') {
              toast({
                title: `🚨 High Conviction Gap: ${gap.symbol}`,
                description: `${gap.gapPercent > 0 ? '+' : ''}${gap.gapPercent.toFixed(2)}% gap with ${gap.volumeRatio.toFixed(1)}x volume`,
              })
            }
          }

          // Handle market status
          if (message.type === 'market_status' && message.marketOpen !== undefined) {
            setIsMarketOpen(message.marketOpen)
          }
        } catch (error) {
          console.error('[v0] WebSocket message parse/validation error:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('[v0] WebSocket error:', error)
        setStatus('error')
      }

      ws.onclose = (event) => {
        console.log('[v0] WebSocket disconnected:', event.code, event.reason)
        setStatus('disconnected')
        cleanup()

        // Attempt reconnection with exponential backoff
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++
          const delay = RECONNECT_DELAY * reconnectAttemptsRef.current
          console.log(`[v0] Reconnecting in ${delay / 1000}s (attempt ${reconnectAttemptsRef.current})`)
          
          reconnectTimerRef.current = setTimeout(() => {
            connect()
          }, delay)
        }
      }
    } catch (error) {
      console.error('[v0] WebSocket connection error:', error)
      setStatus('error')
    }
  }, [cleanup, setGaps, setIsMarketOpen, setLastUpdate])

  useEffect(() => {
    connect()
    return cleanup
  }, [connect, cleanup])

  return { status, reconnect: connect }
}
