'use client';

import { useState, useEffect, useCallback } from 'react'
import type { Alert, GapData } from '../types'
import { AlertStorage } from '../alert-storage'
import { AlertMonitor } from '../alert-monitor'

/**
 * Custom hook for managing alerts
 */
export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load alerts on mount
  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = useCallback(() => {
    setIsLoading(true)
    try {
      const loadedAlerts = AlertStorage.getAlerts()
      setAlerts(loadedAlerts)
    } catch (error) {
      console.error('[v0] Failed to load alerts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'createdAt'>) => {
    try {
      const newAlert = AlertStorage.saveAlert(alert)
      setAlerts((prev) => [...prev, newAlert])
      return newAlert
    } catch (error) {
      console.error('[v0] Failed to add alert:', error)
      throw error
    }
  }, [])

  const updateAlert = useCallback((id: string, updates: Partial<Alert>) => {
    try {
      const updatedAlert = AlertStorage.updateAlert(id, updates)
      if (updatedAlert) {
        setAlerts((prev) => prev.map((a) => (a.id === id ? updatedAlert : a)))
      }
      return updatedAlert
    } catch (error) {
      console.error('[v0] Failed to update alert:', error)
      throw error
    }
  }, [])

  const deleteAlert = useCallback((id: string) => {
    try {
      const success = AlertStorage.deleteAlert(id)
      if (success) {
        setAlerts((prev) => prev.filter((a) => a.id !== id))
      }
      return success
    } catch (error) {
      console.error('[v0] Failed to delete alert:', error)
      throw error
    }
  }, [])

  const toggleAlert = useCallback((id: string) => {
    try {
      const success = AlertStorage.toggleAlert(id)
      if (success) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
        )
      }
      return success
    } catch (error) {
      console.error('[v0] Failed to toggle alert:', error)
      throw error
    }
  }, [])

  return {
    alerts,
    isLoading,
    addAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
    refresh: loadAlerts,
  }
}

/**
 * Hook for monitoring alerts against market data
 */
export function useAlertMonitor(gaps: GapData[], enabled: boolean = true) {
  const [triggeredAlerts, setTriggeredAlerts] = useState<Alert[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  // Check notification status on mount
  useEffect(() => {
    setNotificationsEnabled(AlertMonitor.areNotificationsEnabled())
  }, [])

  // Monitor alerts when gaps data changes
  useEffect(() => {
    if (!enabled || gaps.length === 0) return

    const triggered = AlertMonitor.checkAlerts(gaps)
    if (triggered.length > 0) {
      setTriggeredAlerts(triggered)
    }
  }, [gaps, enabled])

  const requestNotificationPermission = useCallback(async () => {
    const granted = await AlertMonitor.requestNotificationPermission()
    setNotificationsEnabled(granted)
    return granted
  }, [])

  return {
    triggeredAlerts,
    notificationsEnabled,
    requestNotificationPermission,
  }
}

/**
 * Hook for getting triggered alerts history
 */
export function useTriggeredAlerts() {
  const [history, setHistory] = useState<ReturnType<typeof AlertStorage.getTriggeredAlerts>>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = useCallback(() => {
    const triggeredHistory = AlertStorage.getTriggeredAlerts()
    setHistory(triggeredHistory)
  }, [])

  return {
    history,
    refresh: loadHistory,
  }
}
