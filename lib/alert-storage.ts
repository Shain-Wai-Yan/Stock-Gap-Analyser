import type { Alert } from './types'

/**
 * Alert Storage Manager
 * Uses localStorage for now, but can easily be swapped for API calls
 * to a backend service like Supabase, MongoDB, or custom REST API
 */

const STORAGE_KEY = 'gap_analysis_alerts'
const TRIGGERED_ALERTS_KEY = 'gap_analysis_triggered_alerts'

export class AlertStorage {
  /**
   * Get all alerts
   */
  static getAlerts(): Alert[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      return JSON.parse(stored)
    } catch (error) {
      console.error('[v0] Failed to load alerts:', error)
      return []
    }
  }

  /**
   * Save an alert
   */
  static saveAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Alert {
    const newAlert: Alert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    const alerts = this.getAlerts()
    alerts.push(newAlert)
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
    } catch (error) {
      console.error('[v0] Failed to save alert:', error)
      throw new Error('Failed to save alert to storage')
    }

    return newAlert
  }

  /**
   * Update an existing alert
   */
  static updateAlert(id: string, updates: Partial<Alert>): Alert | null {
    const alerts = this.getAlerts()
    const index = alerts.findIndex((a) => a.id === id)
    
    if (index === -1) return null

    alerts[index] = { ...alerts[index], ...updates }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
    } catch (error) {
      console.error('[v0] Failed to update alert:', error)
      throw new Error('Failed to update alert')
    }

    return alerts[index]
  }

  /**
   * Delete an alert
   */
  static deleteAlert(id: string): boolean {
    const alerts = this.getAlerts()
    const filtered = alerts.filter((a) => a.id !== id)
    
    if (filtered.length === alerts.length) return false

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('[v0] Failed to delete alert:', error)
      return false
    }

    return true
  }

  /**
   * Toggle alert enabled/disabled
   */
  static toggleAlert(id: string): boolean {
    const alerts = this.getAlerts()
    const alert = alerts.find((a) => a.id === id)
    
    if (!alert) return false

    alert.enabled = !alert.enabled
    alert.lastTriggered = undefined // Reset last triggered when toggling
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
    } catch (error) {
      console.error('[v0] Failed to toggle alert:', error)
      return false
    }

    return true
  }

  /**
   * Mark an alert as triggered
   */
  static markAlertTriggered(id: string): void {
    const alerts = this.getAlerts()
    const alert = alerts.find((a) => a.id === id)
    
    if (!alert) return

    alert.lastTriggered = new Date().toISOString()
    alert.triggerCount = (alert.triggerCount || 0) + 1
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
      
      // Store triggered alert for notification history
      const triggered = this.getTriggeredAlerts()
      triggered.unshift({
        alertId: id,
        symbol: alert.symbol,
        type: alert.type,
        condition: alert.condition,
        value: alert.value,
        triggeredAt: alert.lastTriggered,
      })
      
      // Keep only last 50 triggered alerts
      if (triggered.length > 50) {
        triggered.splice(50)
      }
      
      localStorage.setItem(TRIGGERED_ALERTS_KEY, JSON.stringify(triggered))
    } catch (error) {
      console.error('[v0] Failed to mark alert as triggered:', error)
    }
  }

  /**
   * Get triggered alerts history
   */
  static getTriggeredAlerts(): Array<{
    alertId: string
    symbol: string
    type: string
    condition: string
    value: number
    triggeredAt: string
  }> {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(TRIGGERED_ALERTS_KEY)
      if (!stored) return []
      return JSON.parse(stored)
    } catch (error) {
      console.error('[v0] Failed to load triggered alerts:', error)
      return []
    }
  }

  /**
   * Clear all alerts (useful for testing/reset)
   */
  static clearAll(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TRIGGERED_ALERTS_KEY)
    } catch (error) {
      console.error('[v0] Failed to clear alerts:', error)
    }
  }
}

/**
 * For backend API integration, replace the above class with:
 * 
 * export class AlertStorage {
 *   static async getAlerts(): Promise<Alert[]> {
 *     const response = await fetch('/api/alerts')
 *     return response.json()
 *   }
 * 
 *   static async saveAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> {
 *     const response = await fetch('/api/alerts', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(alert),
 *     })
 *     return response.json()
 *   }
 *   
 *   // ... similar for other methods
 * }
 */
