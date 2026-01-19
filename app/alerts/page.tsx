'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Bell, Plus, Trash2, TrendingUp, Volume2, BarChart3, BellRing, Activity } from 'lucide-react'
import { useAlerts, useAlertMonitor, useTriggeredAlerts } from '@/lib/hooks/use-alerts'
import { useGaps } from '@/lib/hooks/use-api'
import { toast } from 'sonner'
import type { Alert } from '@/lib/types'

export default function AlertsPage() {
  const { alerts, isLoading, addAlert: saveAlert, deleteAlert: removeAlert, toggleAlert } = useAlerts()
  const { data: gaps } = useGaps(30000)
  const { triggeredAlerts, notificationsEnabled, requestNotificationPermission } = useAlertMonitor(gaps || [], true)
  const { history: triggeredHistory, refresh: refreshHistory } = useTriggeredAlerts()

  const [newAlert, setNewAlert] = useState({
    symbol: '',
    type: 'gap' as const,
    condition: 'greater_than' as const,
    value: 0
  })

  // Refresh history when alerts are triggered
  useEffect(() => {
    if (triggeredAlerts.length > 0) {
      refreshHistory()
      triggeredAlerts.forEach(alert => {
        toast.success(`Alert Triggered: ${alert.symbol}`, {
          description: `${alert.type} condition met`,
        })
      })
    }
  }, [triggeredAlerts, refreshHistory])

  const handleAddAlert = () => {
    if (!newAlert.symbol || newAlert.value <= 0) {
      toast.error('Invalid alert', {
        description: 'Please provide a valid symbol and value',
      })
      return
    }

    try {
      saveAlert({
        ...newAlert,
        enabled: true,
      })
      setNewAlert({ symbol: '', type: 'gap', condition: 'greater_than', value: 0 })
      toast.success('Alert created', {
        description: `Alert for ${newAlert.symbol} has been created`,
      })
    } catch (error) {
      toast.error('Failed to create alert', {
        description: 'Please try again',
      })
    }
  }

  const handleDeleteAlert = (id: string) => {
    try {
      removeAlert(id)
      toast.success('Alert deleted')
    } catch (error) {
      toast.error('Failed to delete alert')
    }
  }

  const handleToggleAlert = (id: string) => {
    try {
      toggleAlert(id)
    } catch (error) {
      toast.error('Failed to toggle alert')
    }
  }

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission()
    if (granted) {
      toast.success('Notifications enabled', {
        description: 'You will receive alerts when conditions are met',
      })
    } else {
      toast.error('Notifications denied', {
        description: 'Please enable notifications in your browser settings',
      })
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'gap': return <TrendingUp className="h-4 w-4" />
      case 'price': return <BarChart3 className="h-4 w-4" />
      case 'volume': return <Volume2 className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'greater_than': return '>'
      case 'less_than': return '<'
      case 'crosses_above': return 'crosses above'
      case 'crosses_below': return 'crosses below'
      default: return condition
    }
  }

  return (
    <div className="container py-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Price Alerts</h1>
          <p className="text-muted-foreground">Get notified when stocks meet your criteria</p>
        </div>
        
        {!notificationsEnabled && (
          <Button onClick={handleEnableNotifications} variant="outline">
            <BellRing className="h-4 w-4 mr-2" />
            Enable Notifications
          </Button>
        )}
      </div>

      {notificationsEnabled && (
        <Card className="mb-6 border-success bg-success/5">
          <CardContent className="p-4 flex items-center gap-3">
            <BellRing className="h-5 w-5 text-success" />
            <div className="flex-1">
              <p className="text-sm font-medium">Notifications Enabled</p>
              <p className="text-xs text-muted-foreground">You will receive alerts when conditions are met</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Alert</CardTitle>
          <CardDescription>Set up custom alerts for gap, price, or volume triggers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Symbol</Label>
              <Input
                placeholder="NVDA"
                value={newAlert.symbol}
                onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={newAlert.type} onValueChange={(value: any) => setNewAlert({ ...newAlert, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gap">Gap %</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="volume">Volume Ratio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition</Label>
              <Select value={newAlert.condition} onValueChange={(value: any) => setNewAlert({ ...newAlert, condition: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="crosses_above">Crosses Above</SelectItem>
                  <SelectItem value="crosses_below">Crosses Below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input
                type="number"
                step="0.1"
                value={newAlert.value || ''}
                onChange={(e) => setNewAlert({ ...newAlert, value: parseFloat(e.target.value) })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAlert()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddAlert} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Alert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 mb-6">
            <h2 className="text-xl font-semibold">Active Alerts ({alerts.filter(a => a.enabled).length})</h2>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <Card key={alert.id} className={alert.enabled ? 'border-primary' : 'opacity-60'}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${alert.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <div className="font-bold text-lg font-mono mb-1">{alert.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            <Badge variant="outline" className="mr-2 capitalize">{alert.type}</Badge>
                            {getConditionLabel(alert.condition)} <span className="font-mono font-bold">{alert.value}</span>
                            {alert.type === 'gap' && '%'}
                            {alert.type === 'volume' && 'x'}
                            {alert.type === 'price' && ' USD'}
                          </div>
                          {alert.lastTriggered && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Last triggered: {new Date(alert.lastTriggered).toLocaleString()} 
                              {alert.triggerCount && ` (${alert.triggerCount}x)`}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`alert-${alert.id}`} className="text-sm">
                            {alert.enabled ? 'Active' : 'Paused'}
                          </Label>
                          <Switch
                            id={`alert-${alert.id}`}
                            checked={alert.enabled}
                            onCheckedChange={() => handleToggleAlert(alert.id)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAlert(alert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Bell className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No alerts configured</h3>
                  <p className="text-muted-foreground mb-4">Create alerts to get notified of gap opportunities</p>
                </CardContent>
              </Card>
            )}
          </div>

          {triggeredHistory.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Triggers</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {triggeredHistory.slice(0, 10).map((trigger, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">{trigger.symbol}</Badge>
                          <span className="text-sm text-muted-foreground capitalize">{trigger.type}</span>
                          <span className="text-sm text-muted-foreground">{getConditionLabel(trigger.condition)} {trigger.value}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(trigger.triggeredAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
