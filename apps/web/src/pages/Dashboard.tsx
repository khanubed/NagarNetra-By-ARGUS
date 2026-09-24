import { useGetDashboardStatsQuery, useGetRecentEventsQuery } from '../features/apiSlice';
import { KpiCard } from '../components/ui/KpiCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Ticket, AlertCircle, MapPin, HeartPulse, Map as MapIcon, Activity } from 'lucide-react';
import { CircleMarker, Popup } from 'react-leaflet';
import { MapShell } from '../components/map/MapShell';
import 'leaflet/dist/leaflet.css';

const severityColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e'
};

export const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery({});
  const { data: events, isLoading: eventsLoading } = useGetRecentEventsQuery({});

  // Only take the first 50 for the recent feed list to not lag the DOM
  const recentFeed = events?.slice(0, 50);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Authority Dashboard</h1>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-semantic-low opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-semantic-low"></span>
          </span>
          Live updating
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard 
          title="Active Tickets" 
          value={statsLoading ? "..." : stats?.activeTickets} 
          icon={<Ticket size={20} />} 
          trend={stats?.ticketsTrend}
        />
        <KpiCard 
          title="Critical Alerts" 
          value={statsLoading ? "..." : stats?.criticalAlerts} 
          icon={<AlertCircle size={20} />} 
          trend={stats?.alertsTrend}
        />
        <KpiCard 
          title="Identified Black Spots" 
          value={statsLoading ? "..." : stats?.blackSpots} 
          icon={<MapPin size={20} />} 
        />
        <KpiCard 
          title="City Pulse Score" 
          value={statsLoading ? "..." : `${stats?.cityPulseScore}/100`} 
          icon={<HeartPulse size={20} />} 
          trend={stats?.pulseTrend}
        />
      </div>

      {/* Map & Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Map */}
        <div className="xl:col-span-2 bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px] relative group">
          <div className="absolute top-4 left-4 z-[1000] bg-background/90 backdrop-blur border shadow-sm rounded-lg p-3">
            <h2 className="font-semibold flex items-center gap-2 text-sm"><MapIcon size={16} /> Fleet Detections</h2>
            <div className="text-xs text-muted-foreground mt-1">{events?.length || 0} recent points</div>
          </div>
          <div className="flex-1 bg-muted z-0 relative">
            <MapShell center={[12.9716, 77.5946]} zoom={13} scrollWheelZoom={false}>
              {!eventsLoading && events?.map((event: any) => (
                <CircleMarker 
                  key={event.id} 
                  center={[event.lat, event.lng]}
                  radius={event.severity === 'critical' ? 7 : event.severity === 'high' ? 5 : 4}
                  pathOptions={{ 
                    color: severityColors[event.severity as keyof typeof severityColors],
                    fillColor: severityColors[event.severity as keyof typeof severityColors],
                    fillOpacity: 0.8,
                    weight: event.severity === 'critical' ? 2 : 1
                  }}
                >
                  <Popup>
                    <div className="font-semibold text-sm">{event.type}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={event.severity} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 font-mono">{event.id} • {event.confidence}% AI Conf</div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapShell>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border rounded-xl shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="p-4 border-b bg-background flex justify-between items-center">
            <h2 className="font-semibold flex items-center gap-2"><Activity size={18} /> Event Stream</h2>
            <span className="text-xs font-medium px-2 py-1 bg-muted rounded text-muted-foreground">{events?.length} Total</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
            {eventsLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-muted rounded-md w-full"></div>)}
              </div>
            ) : (
              recentFeed?.map((event: any) => (
                <div key={event.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors bg-background">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{event.type}</span>
                    <StatusBadge status={event.severity} />
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{event.time}</span>
                    <span className="font-medium text-foreground bg-primary/5 px-1.5 rounded">{event.confidence}% Conf.</span>
                  </div>
                </div>
              ))
            )}
            {!eventsLoading && (
              <div className="text-center pt-2">
                <button className="text-xs text-brand-primary font-medium hover:underline">View all {events?.length} events...</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
