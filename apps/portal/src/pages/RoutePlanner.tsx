import { useState } from 'react';
import { MapShell } from '../components/map/MapShell';
import { Polyline } from 'react-leaflet';
import { Navigation, Clock, ShieldCheck, HeartPulse, Gauge, ArrowRight, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock routing data mapped to semantic colors
const MOCK_ROUTES = [
  { 
    id: 'fastest', 
    label: 'Fastest', 
    icon: Clock, 
    color: '#3B82F6', // semantic-info
    eta: '32 min', 
    distance: '14.2 km',
    description: 'Quickest ETA based on current traffic.',
    coords: [[12.9716, 77.5946], [12.9650, 77.6000], [12.9400, 77.6250], [12.9350, 77.6300]] as [number, number][]
  },
  { 
    id: 'safest', 
    label: 'Safest', 
    icon: ShieldCheck, 
    color: '#22C55E', // semantic-low
    eta: '45 min', 
    distance: '16.5 km',
    description: 'Avoids all active black spots and accident zones.',
    coords: [[12.9716, 77.5946], [12.9750, 77.6100], [12.9500, 77.6400], [12.9350, 77.6300]] as [number, number][]
  },
  { 
    id: 'quality', 
    label: 'Best Road Quality', 
    icon: HeartPulse, 
    color: '#1E3A8A', // brand-primary
    eta: '38 min', 
    distance: '15.1 km',
    description: 'Prioritizes newly paved roads, avoids potholes.',
    coords: [[12.9716, 77.5946], [12.9600, 77.5900], [12.9300, 77.6150], [12.9350, 77.6300]] as [number, number][]
  },
  { 
    id: 'congestion', 
    label: 'Lowest Congestion', 
    icon: Gauge, 
    color: '#EAB308', // semantic-medium
    eta: '40 min', 
    distance: '17.0 km',
    description: 'Avoids heavy traffic bottlenecks.',
    coords: [[12.9716, 77.5946], [12.9500, 77.5800], [12.9200, 77.6000], [12.9350, 77.6300]] as [number, number][]
  },
];

export const RoutePlanner = () => {
  const [activeRouteId, setActiveRouteId] = useState('fastest');
  const [origin, setOrigin] = useState('Vidhana Soudha, Bengaluru');
  const [dest, setDest] = useState('Koramangala BDA Complex');
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Smart Route Planner</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Plan your journey using real-time civic intelligence. We optimize routes not just for time, but for safety, road health, and traffic conditions.
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Left Panel: Controls */}
        <div className="bg-card border rounded-lg shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b bg-background">
            <div className="flex flex-col gap-4 relative">
              {/* Origin / Dest Inputs */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-brand-accent" />
                <input 
                  type="text" 
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  className="w-full bg-accent/30 border border-border rounded-t-lg h-10 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>
              <div className="absolute left-[19px] top-10 bottom-10 w-0.5 bg-border border-dashed border-l z-10"></div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-semantic-critical" />
                <input 
                  type="text" 
                  value={dest}
                  onChange={e => setDest(e.target.value)}
                  className="w-full bg-accent/30 border border-border border-t-0 rounded-b-lg h-10 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>
              <button 
                className="mt-2 w-full bg-brand-primary text-white font-semibold h-10 rounded-lg hover:bg-brand-primary/90 flex items-center justify-center gap-2 transition-colors shadow-sm"
                onClick={() => setIsNavigating(true)}
              >
                <Navigation size={18} /> Start Navigation
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-muted/10 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Available Routes</h3>
            
            {MOCK_ROUTES.map((route) => {
              const Icon = route.icon;
              const isActive = activeRouteId === route.id;
              
              return (
                <button
                  key={route.id}
                  onClick={() => setActiveRouteId(route.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-all duration-200 relative overflow-hidden flex flex-col gap-2",
                    isActive 
                      ? "bg-white border-brand-primary shadow-sm" 
                      : "bg-white border-border hover:border-brand-primary/50 opacity-80 hover:opacity-100"
                  )}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 w-1 bottom-0" style={{ backgroundColor: route.color }}></div>
                  )}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded-md", isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                        <Icon size={18} style={{ color: isActive ? route.color : undefined }} />
                      </div>
                      <span className={cn("font-semibold", isActive ? "text-brand-secondary" : "text-foreground")}>{route.label}</span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className={cn("font-bold text-lg leading-none", isActive ? "text-brand-primary" : "")}>
                        {route.eta}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground mt-1">{route.distance}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 pl-9">{route.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Panel: Map */}
        <div className="lg:col-span-2 bg-card border rounded-lg overflow-hidden shadow-sm h-full relative">
          <MapShell center={[12.95, 77.6]} zoom={13}>
            {MOCK_ROUTES.map(route => (
              <Polyline
                key={route.id}
                positions={route.coords}
                pathOptions={{ 
                  color: route.id === activeRouteId ? route.color : '#94A3B8', 
                  weight: route.id === activeRouteId ? 6 : 4,
                  opacity: route.id === activeRouteId ? 1 : 0.4,
                  dashArray: route.id === activeRouteId ? undefined : '8, 8'
                }}
              />
            ))}
          </MapShell>

          {/* Navigation Overlay Mock */}
          {isNavigating && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[400] bg-brand-primary text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
              <ArrowRight size={32} className="text-white" />
              <div>
                <div className="font-bold text-xl">In 200m</div>
                <div className="text-brand-primary-foreground/90 font-medium">Turn right onto Richmond Road</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
