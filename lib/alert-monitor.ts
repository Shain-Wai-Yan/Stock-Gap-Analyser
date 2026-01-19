import type { Alert, GapData } from './types'
import { AlertStorage } from './alert-storage'

/**
 * Alert Monitor
 * Checks current market data against configured alerts and triggers notifications
 */

export class AlertMonitor {
  private static lastCheck: Map<string, number> = new Map()
  private static cooldownPeriod = 5 * 60 * 1000 // 5 minutes cooldown between same alert triggers

  /**
   * Check all active alerts against current gap data
   */
  static checkAlerts(gaps: GapData[]): Alert[] {
    const alerts = AlertStorage.getAlerts()
    const triggeredAlerts: Alert[] = []

    for (const alert of alerts) {
      if (!alert.enabled) continue

      // Check cooldown period
      const lastTrigger = this.lastCheck.get(alert.id)
      if (lastTrigger && Date.now() - lastTrigger < this.cooldownPeriod) {
        continue
      }

      // Find matching gap data
      const gap = gaps.find((g) => g.symbol === alert.symbol)
      if (!gap) continue

      // Check if alert condition is met
      const isTriggered = this.evaluateCondition(alert, gap)

      if (isTriggered) {
        console.log(`[v0] Alert triggered: ${alert.symbol} ${alert.type} ${alert.condition} ${alert.value}`)
        AlertStorage.markAlertTriggered(alert.id)
        triggeredAlerts.push(alert)
        this.lastCheck.set(alert.id, Date.now())

        // Send notification
        this.sendNotification(alert, gap)
      }
    }

    return triggeredAlerts
  }

  /**
   * Evaluate if an alert condition is met
   */
  private static evaluateCondition(alert: Alert, gap: GapData): boolean {
    let currentValue: number

    // Get the current value based on alert type
    switch (alert.type) {
      case 'gap':
        currentValue = Math.abs(gap.gapPercent)
        break
      case 'price':
        currentValue = gap.currentPrice
        break
      case 'volume':
        currentValue = gap.volumeRatio
        break
      default:
        return false
    }

    // Evaluate condition
    switch (alert.condition) {
      case 'greater_than':
        return currentValue > alert.value
      case 'less_than':
        return currentValue < alert.value
      case 'equals':
        return Math.abs(currentValue - alert.value) < 0.01
      case 'crosses_above':
        // For crossing conditions, we'd need historical data
        // For now, treat it like greater_than
        return currentValue > alert.value
      case 'crosses_below':
        return currentValue < alert.value
      default:
        return false
    }
  }

  /**
   * Send browser notification
   */
  private static async sendNotification(alert: Alert, gap: GapData): Promise<void> {
    // Check if notifications are supported
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.log('[v0] Notifications not supported')
      return
    }

    // Request permission if not already granted
    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }

    if (Notification.permission !== 'granted') {
      console.log('[v0] Notification permission denied')
      return
    }

    // Create notification
    const title = `Alert: ${alert.symbol}`
    const body = this.getNotificationBody(alert, gap)
    
    try {
      const notification = new Notification(title, {
        body,
        icon: '/icon-192x192.png', // Add your app icon
        badge: '/icon-96x96.png',
        tag: alert.id, // Prevent duplicate notifications
        requireInteraction: true,
        data: {
          symbol: alert.symbol,
          alertId: alert.id,
        },
      })

      notification.onclick = () => {
        window.focus()
        // You can add navigation logic here
        notification.close()
      }
    } catch (error) {
      console.error('[v0] Failed to send notification:', error)
    }
  }

  /**
   * Generate notification body text
   */
  private static getNotificationBody(alert: Alert, gap: GapData): string {
    const typeLabel = {
      gap: 'Gap',
      price: 'Price',
      volume: 'Volume Ratio',
    }[alert.type]

    const currentValue = {
      gap: `${gap.gapPercent.toFixed(2)}%`,
      price: `$${gap.currentPrice.toFixed(2)}`,
      volume: `${gap.volumeRatio.toFixed(1)}x`,
    }[alert.type]

    const targetValue = {
      gap: `${alert.value}%`,
      price: `$${alert.value}`,
      volume: `${alert.value}x`,
    }[alert.type]

    return `${typeLabel}: ${currentValue} (target: ${targetValue})\nConviction: ${gap.conviction.toUpperCase()}`
  }

  /**
   * Request notification permissions
   */
  static async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  /**
   * Check if notifications are enabled
   */
  static areNotificationsEnabled(): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false
    }
    return Notification.permission === 'granted'
  }
}
