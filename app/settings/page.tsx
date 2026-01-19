'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Settings, Bell, Database, Zap, Save, Check } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || '')
  const [wsUrl, setWsUrl] = useState(process.env.NEXT_PUBLIC_WS_URL || '')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your gap trading terminal</p>
      </div>

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="trading">Trading Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backend Connection
              </CardTitle>
              <CardDescription>
                Connect to your FastAPI backend for real-time data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-url">API Base URL</Label>
                <Input
                  id="api-url"
                  placeholder="http://localhost:8000"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Set NEXT_PUBLIC_API_URL environment variable
                </p>
              </div>

              <div>
                <Label htmlFor="ws-url">WebSocket URL</Label>
                <Input
                  id="ws-url"
                  placeholder="ws://localhost:8000/ws"
                  value={wsUrl}
                  onChange={(e) => setWsUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Set NEXT_PUBLIC_WS_URL environment variable
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${apiUrl ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
                  <div>
                    <div className="font-semibold">Connection Status</div>
                    <div className="text-sm text-muted-foreground">
                      {apiUrl ? 'Using configured backend' : 'Using mock data'}
                    </div>
                  </div>
                </div>
                <Badge variant={apiUrl ? 'default' : 'secondary'} className={apiUrl ? 'bg-success' : ''}>
                  {apiUrl ? 'Connected' : 'Not Configured'}
                </Badge>
              </div>

              <Button onClick={handleSave} disabled={saved} className="w-full">
                {saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">Required endpoints:</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">GET /api/gaps</code> - Gap scanner data</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">GET /api/news</code> - Market news feed</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">GET /api/backtest/:symbol</code> - Backtest results</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">GET /api/chart/:symbol</code> - Chart data</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">WS /ws/gaps</code> - Real-time updates</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get desktop notifications for high-conviction gaps
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when new gap opportunities are detected
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Daily summary of gap trading opportunities
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Discord Webhook</Label>
                  <p className="text-sm text-muted-foreground">
                    Send alerts to Discord channel
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Trading Configuration
              </CardTitle>
              <CardDescription>Set your default trading parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="risk-percent">Risk Per Trade (%)</Label>
                <Input id="risk-percent" type="number" defaultValue="2" step="0.1" />
                <p className="text-sm text-muted-foreground mt-1">
                  Percentage of account to risk on each trade
                </p>
              </div>

              <div>
                <Label htmlFor="account-size">Account Size ($)</Label>
                <Input id="account-size" type="number" defaultValue="10000" step="1000" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-calculate Position Size</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically calculate position size based on risk
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show High Conviction Only</Label>
                  <p className="text-sm text-muted-foreground">
                    Filter out medium and low conviction gaps
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
