import { useGetBlackSpotsQuery } from '../features/apiSlice';
import { CircleMarker } from 'react-leaflet';
import { MapShell } from '../components/map/MapShell';
import { MapPin, Search, Info, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export const BlackSpots = () => {
  const { data: spots, isLoading } = useGetBlackSpotsQuery({});
  const [selectedSpot, setSelectedSpot] = useState<any>(null);

  // Default to first spot if none selected
  const activeSpot = selectedSpot || spots?.[0];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Black Spot Explorer</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            NagarNetra AI identifies multi-factor hazard zones (Black Spots) across the city to prioritize immediate remediation and keep citizens safe.
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Left Column: List */}
        <div className="bg-card border rounded-lg shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-background relative flex flex-col gap-3">
            <h3 className="font-semibold text-lg text-brand-secondary">Identified Caution Zones</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by area or ward..."
                className="w-full bg-accent/50 border rounded-md h-9 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                <span className="text-sm">Loading AI Analysis...</span>
              </div>
            ) : (
              spots?.map((spot: any) => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className={`w-full text-left p-4 rounded-lg transition-all border ${
                    activeSpot?.id === spot.id 
                      ? 'bg-white border-brand-primary shadow-sm ring-1 ring-brand-primary/20' 
                      : 'bg-white hover:border-brand-primary/50 opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-brand-secondary text-sm line-clamp-1">{spot.name}</div>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-100 text-red-700 rounded-full uppercase tracking-wider">
                          Priority {spot.score}
                        </span>
                      </div>
                    </div>
                    <ShieldAlert size={20} className={activeSpot?.id === spot.id ? "text-brand-primary" : "text-muted-foreground"} />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Columns: Detail & Map */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2 pb-2">
          {activeSpot && (
            <>
              {/* Educational Pitch Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-blue-900 text-lg mb-2 flex items-center gap-2">
                  <Info size={20} className="text-blue-600" />
                  Why is this a Black Spot?
                </h3>
                <p className="text-blue-800/80 text-sm leading-relaxed mb-4">
                  A single pothole is a maintenance issue. But when NagarNetra detects multiple severe defects combined with historical incidents and compounding factors like waterlogging or school proximity, it escalates the segment into a <strong>Black Spot</strong> for immediate multi-department intervention.
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 bg-white p-4 rounded-lg border border-blue-100 shadow-sm opacity-50 relative overflow-hidden group">
                    <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Standard Report</div>
                    <div className="font-medium text-gray-600">"Pothole spotted on Main Road"</div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                    <div className="text-xs font-semibold text-brand-primary uppercase mb-1 flex items-center gap-1">
                      <ShieldAlert size={12} /> AI Intelligence Engine
                    </div>
                    <div className="font-semibold text-brand-secondary">
                      "Critical Hazard: {activeSpot.factors.defects} defects near School Zone with active Waterlogging."
                    </div>
                  </div>
                </div>
              </div>

              {/* Map View */}
              <div className="bg-card border rounded-lg overflow-hidden shadow-sm h-[350px] shrink-0 relative">
                <MapShell center={[activeSpot.lat, activeSpot.lng]} zoom={16} scrollWheelZoom={false}>
                  <CircleMarker 
                    center={[activeSpot.lat, activeSpot.lng]}
                    radius={50}
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, weight: 1 }}
                  />
                  <CircleMarker 
                    center={[activeSpot.lat, activeSpot.lng]}
                    radius={10}
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1, weight: 2 }}
                  />
                </MapShell>
              </div>

              {/* Detail Profile - Public Friendly */}
              <div className="bg-white border rounded-lg shadow-sm p-6 mb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-brand-secondary">{activeSpot.name}</h2>
                    <p className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
                      <MapPin size={16} className="text-brand-primary" /> Active Caution Zone
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-red-600">{activeSpot.score}</div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Hazard Index</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-5 bg-red-50/50 border border-red-100 rounded-lg text-center">
                    <div className="text-3xl font-black text-red-600">{activeSpot.factors.defects}</div>
                    <div className="text-xs font-semibold text-red-800/60 uppercase mt-2">Verified Hazards</div>
                  </div>
                  <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-lg text-center">
                    <div className="text-3xl font-black text-orange-600">{activeSpot.factors.incidents}</div>
                    <div className="text-xs font-semibold text-orange-800/60 uppercase mt-2">Recent Incidents</div>
                  </div>
                  <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-lg text-center">
                    <div className="text-xl font-black text-blue-600 mt-2">{activeSpot.factors.waterlogging ? 'High' : 'Low'}</div>
                    <div className="text-xs font-semibold text-blue-800/60 uppercase mt-3">Waterlogging</div>
                  </div>
                  <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-lg text-center">
                    <div className="text-xl font-black text-emerald-600 mt-2">{activeSpot.factors.schoolProximity ? 'Yes' : 'No'}</div>
                    <div className="text-xs font-semibold text-emerald-800/60 uppercase mt-3">School Zone</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
