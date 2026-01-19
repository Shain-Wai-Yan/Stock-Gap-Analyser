'use client'

import { useEffect, useRef } from 'react'
import { createChart, ColorType, type IChartApi, type ISeriesApi } from 'lightweight-charts'
import type { ChartData } from '@/lib/types'

interface LightweightChartProps {
  data: ChartData[]
  gapLevel?: number
  previousClose?: number
  vwap?: number
  height?: number
}

export function LightweightChart({ 
  data, 
  gapLevel, 
  previousClose,
  vwap,
  height = 400 
}: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return

    console.log('[v0] Initializing Lightweight Chart with', data.length, 'candles')

    // Get theme colors
    const isDark = document.documentElement.classList.contains('dark')
    const bgColor = isDark ? 'rgba(18, 18, 18, 0)' : 'rgba(255, 255, 255, 0)'
    const textColor = isDark ? '#999' : '#666'
    const gridColor = isDark ? 'rgba(42, 46, 57, 0.5)' : 'rgba(197, 203, 206, 0.5)'

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: bgColor },
        textColor: textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      rightPriceScale: {
        borderColor: gridColor,
      },
      timeScale: {
        borderColor: gridColor,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1, // Normal crosshair
      },
    })

    chartRef.current = chart

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    // Format and set data
    const formattedData = data.map((d) => ({
      time: typeof d.time === 'string' ? Math.floor(new Date(d.time).getTime() / 1000) : d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))

    candlestickSeries.setData(formattedData)

    // Add previous close line (gap reference)
    if (previousClose) {
      const gapLineSeries = chart.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
        lineStyle: 2, // Dashed
        title: 'Previous Close',
        priceLineVisible: false,
        lastValueVisible: true,
      })

      gapLineSeries.setData(
        formattedData.map((d) => ({
          time: d.time,
          value: previousClose,
        }))
      )
    }

    // Add gap fill level line
    if (gapLevel && gapLevel !== previousClose) {
      const fillLineSeries = chart.addLineSeries({
        color: '#FF6D00',
        lineWidth: 2,
        lineStyle: 2, // Dashed
        title: 'Gap Fill Target',
        priceLineVisible: false,
        lastValueVisible: true,
      })

      fillLineSeries.setData(
        formattedData.map((d) => ({
          time: d.time,
          value: gapLevel,
        }))
      )
    }

    // Add VWAP line
    if (vwap) {
      const vwapLineSeries = chart.addLineSeries({
        color: '#9C27B0',
        lineWidth: 1,
        title: 'VWAP',
        priceLineVisible: false,
        lastValueVisible: true,
      })

      vwapLineSeries.setData(
        formattedData.map((d) => ({
          time: d.time,
          value: vwap,
        }))
      )
    }

    // Add volume histogram
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Set as overlay
    })

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // Push volume to bottom 20%
        bottom: 0,
      },
    })

    const volumeData = data.map((d, index) => ({
      time: typeof d.time === 'string' ? Math.floor(new Date(d.time).getTime() / 1000) : d.time,
      value: d.volume,
      color: d.close >= d.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
    }))

    volumeSeries.setData(volumeData)

    // Fit content to view
    chart.timeScale().fitContent()

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
    }
  }, [data, gapLevel, previousClose, vwap, height])

  // Handle theme changes
  useEffect(() => {
    if (!chartRef.current) return

    const isDark = document.documentElement.classList.contains('dark')
    const bgColor = isDark ? 'rgba(18, 18, 18, 0)' : 'rgba(255, 255, 255, 0)'
    const textColor = isDark ? '#999' : '#666'
    const gridColor = isDark ? 'rgba(42, 46, 57, 0.5)' : 'rgba(197, 203, 206, 0.5)'

    chartRef.current.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: bgColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
    })
  }, [])

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full relative"
      style={{ minHeight: height }}
    />
  )
}
