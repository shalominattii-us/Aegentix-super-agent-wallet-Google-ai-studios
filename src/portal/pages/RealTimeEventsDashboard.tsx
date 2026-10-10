import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useSocket, useRealTimeEvents, useSocketSubscription } from '@/hooks/useSocket';
import { eventToNotification, showNotificationToast } from '@/components/NotificationToast';
import { SocketEvent } from '@/lib/socket-client';

export default function RealTimeEventsDashboard() {
  const { isConnected, error } = useSocket();
  const [activeTab, setActiveTab] = useState('all');

  // Subscribe to all event channels
  useSocketSubscription('all');

  // Collect events from all channels
  const ledgerEvents = useRealTimeEvents('ledger', 20);
  const treasuryEvents = useRealTimeEvents('treasury', 20);
  const agentEvents = useRealTimeEvents('agent', 20);

  // Combine all events for "all" tab
  const allEvents = [
    ...ledgerEvents.events.map((e) => ({ ...e, source: 'ledger' })),
    ...treasuryEvents.events.map((e) => ({ ...e, source: 'treasury' })),
    ...agentEvents.events.map((e) => ({ ...e, source: 'agent' })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Show toast notifications for new events
  useEffect(() => {
    if (ledgerEvents.latestEvent) {
      const notification = eventToNotification(ledgerEvents.latestEvent);
      if (notification) {
        showNotificationToast(notification);
      }
    }
  }, [ledgerEvents.latestEvent]);

  useEffect(() => {
    if (treasuryEvents.latestEvent) {
      const notification = eventToNotification(treasuryEvents.latestEvent);
      if (notification) {
        showNotificationToast(notification);
      }
    }
  }, [treasuryEvents.latestEvent]);

  useEffect(() => {
    if (agentEvents.latestEvent) {
      const notification = eventToNotification(agentEvents.latestEvent);
      if (notification) {
        showNotificationToast(notification);
      }
    }
  }, [agentEvents.latestEvent]);

  const getEventIcon = (source: string) => {
    switch (source) {
      case 'ledger':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'treasury':
        return <AlertCircle className="w-4 h-4 text-emerald-500" />;
      case 'agent':
        return <Zap className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const getEventColor = (source: string) => {
    switch (source) {
      case 'ledger':
        return 'bg-blue-100 text-blue-800';
      case 'treasury':
        return 'bg-emerald-100 text-emerald-800';
      case 'agent':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const renderEventRow = (event: SocketEvent & { source?: string }) => (
    <div key={event.id} className="border-b border-slate-700 p-4 hover:bg-slate-700/50 transition">
      <div className="flex items-start gap-4">
        <div className="mt-1">{getEventIcon(event.source || 'unknown')}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className={getEventColor(event.source || 'unknown')}>
              {event.source || 'unknown'}
            </Badge>
            <span className="text-sm text-slate-400">
              {event.data?.type || 'event'}
            </span>
            <span className="text-xs text-slate-500 ml-auto">
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-slate-300 break-words">
            {event.data?.message ||
              `${event.data?.status || 'updated'} - ${event.data?.amount ? `$${event.data.amount}` : ''} ${event.data?.chain || ''}`}
          </p>
          {event.data?.complianceFlags && event.data.complianceFlags.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {event.data.complianceFlags.map((flag: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {flag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white">Real-Time Events</h1>
            </div>
            <p className="text-slate-400">Live streaming of Ledger, Treasury, and Agent operations</p>
          </div>

          {/* Connection Status */}
          <Card className="mb-6 bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-slate-300">
                  {isConnected ? 'Connected to real-time event stream' : 'Connecting...'}
                </span>
                {error && <span className="text-red-400 ml-auto">{error.message}</span>}
              </div>
            </CardContent>
          </Card>

          {/* Event Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Total Events</div>
                <div className="text-3xl font-bold text-white">{allEvents.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Ledger Events</div>
                <div className="text-3xl font-bold text-blue-400">{ledgerEvents.events.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Treasury Events</div>
                <div className="text-3xl font-bold text-emerald-400">{treasuryEvents.events.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Agent Events</div>
                <div className="text-3xl font-bold text-purple-400">{agentEvents.events.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Events Tabs */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Event Stream</CardTitle>
              <CardDescription>Real-time updates from all system components</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-700 w-full justify-start rounded-none">
                  <TabsTrigger value="all" className="rounded-none">
                    All ({allEvents.length})
                  </TabsTrigger>
                  <TabsTrigger value="ledger" className="rounded-none">
                    Ledger ({ledgerEvents.events.length})
                  </TabsTrigger>
                  <TabsTrigger value="treasury" className="rounded-none">
                    Treasury ({treasuryEvents.events.length})
                  </TabsTrigger>
                  <TabsTrigger value="agent" className="rounded-none">
                    Agents ({agentEvents.events.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="bg-slate-700/50 rounded-lg overflow-hidden">
                    {allEvents.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">No events yet. Waiting for real-time updates...</div>
                    ) : (
                      <div>{allEvents.map((event) => renderEventRow(event))}</div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="ledger" className="mt-6">
                  <div className="bg-slate-700/50 rounded-lg overflow-hidden">
                    {ledgerEvents.events.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">No ledger events yet</div>
                    ) : (
                      <div>{ledgerEvents.events.map((event) => renderEventRow({ ...event, source: 'ledger' }))}</div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="treasury" className="mt-6">
                  <div className="bg-slate-700/50 rounded-lg overflow-hidden">
                    {treasuryEvents.events.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">No treasury events yet</div>
                    ) : (
                      <div>{treasuryEvents.events.map((event) => renderEventRow({ ...event, source: 'treasury' }))}</div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="agent" className="mt-6">
                  <div className="bg-slate-700/50 rounded-lg overflow-hidden">
                    {agentEvents.events.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">No agent events yet</div>
                    ) : (
                      <div>{agentEvents.events.map((event) => renderEventRow({ ...event, source: 'agent' }))}</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Latest Event Details */}
          {allEvents.length > 0 && (
            <Card className="mt-6 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Latest Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-700 p-4 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
                  <pre>{JSON.stringify(allEvents[0], null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
