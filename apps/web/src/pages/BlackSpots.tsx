import { useGetBlackSpotsQuery } from '../features/apiSlice';
import { CircleMarker, Popup } from 'react-leaflet';
import { MapShell } from '../components/map/MapShell';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, MapPin, Search } from 'lucide-react';
import { useState } from 'react';

export const BlackSpots = () => {
  const { data: spots, isLoading } = useGetBlackSpotsQuery({});
  const [selectedSpot, setSelectedSpot] = useState<any>(null);

  // Default to first spot if none selected
  const activeSpot = selectedSpot || spots?.[0];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Black Spot Intelligence Engine</h1>
          <p className="text-muted-foreground mt-1">Multi-factor causal clusters with stable identity tracking.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Left Column: List */}
        <div className="bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-background relative">
            <Search className="absolute left-7 top-6 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search segments or wards..."
              className="w-full bg-accent/50 border-none rounded-md h-9 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Clustering data...</div>
            ) : (
              spots?.map((spot: any) => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSpot?.id === spot.id ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">{spot.id}</span>
                    <span className="font-bold text-semantic-critical">{spot.score}/100</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{spot.name}</div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-muted rounded text-foreground uppercase">
                      {spot.status.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Columns: Detail & Map */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto">
          {activeSpot && (
            <>
              {/* Map View */}
              <div className="bg-card border rounded-xl overflow-hidden shadow-sm h-[300px] shrink-0">
                <MapShell center={[activeSpot.lat, activeSpot.lng]} zoom={15} scrollWheelZoom={false}>
                  <CircleMarker 
                    center={[activeSpot.lat, activeSpot.lng]}
                    radius={30}
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 1 }}
                  />
                  <CircleMarker 
                    center={[activeSpot.lat, activeSpot.lng]}
                    radius={5}
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1, weight: 2 }}
                  />
                </MapShell>
              </div>

              {/* Detail Profile */}
              <div className="bg-card border rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{activeSpot.id}</h2>
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin size={16} /> {activeSpot.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-semantic-critical">{activeSpot.score}</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Priority Score</div>
                  </div>
                </div>

                <h3 className="font-semibold border-b pb-2 mb-4">Causal Profile</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold">{activeSpot.factors.defects}</div>
                    <div className="text-xs text-muted-foreground mt-1">Recurring Defects</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold">{activeSpot.factors.incidents}</div>
                    <div className="text-xs text-muted-foreground mt-1">Recent Incidents</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-lg font-bold">{activeSpot.factors.waterlogging ? 'High' : 'Low'}</div>
                    <div className="text-xs text-muted-foreground mt-1">Waterlogging Risk</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-lg font-bold">{activeSpot.factors.schoolProximity ? 'Yes' : 'No'}</div>
                    <div className="text-xs text-muted-foreground mt-1">School Zone ({'<'} 200m)</div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button className="px-4 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-accent transition-colors">
                    View Associated Tickets
                  </button>
                  <button className="px-4 py-2 bg-brand-primary text-white rounded-md text-sm font-medium hover:bg-brand-primary/90 transition-colors">
                    Issue Joint Work Order
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
