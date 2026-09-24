import { useState } from 'react';
import { MapShell } from '../components/map/MapShell';
import { Polyline, Popup } from 'react-leaflet';
import { Search, AlertTriangle, Activity, Info, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock Data for Road Segments
const fakeSegments = [
  { id: 'RS-101', name: 'Outer Ring Road (Bellandur)', health: 35, defects: 42, type: 'Waterlogging', length: '4.2 km', lastScan: '10 mins ago', coords: [[12.9279, 77.6271], [12.9350, 77.6500]] as [number, number][] },
  { id: 'RS-102', name: 'Koramangala 80ft Road', health: 65, defects: 12, type: 'Pothole', length: '2.1 km', lastScan: '1 hour ago', coords: [[12.9345, 77.6201], [12.9400, 77.6250]] as [number, number][] },
  { id: 'RS-103', name: 'Indiranagar 100ft Road', health: 92, defects: 2, type: 'Pothole', length: '3.5 km', lastScan: '5 mins ago', coords: [[12.9716, 77.6411], [12.9800, 77.6450]] as [number, number][] },
  { id: 'RS-104', name: 'Hosur Road (Silk Board)', health: 22, defects: 58, type: 'Road Cave-in', length: '1.8 km', lastScan: 'Just now', coords: [[12.9176, 77.6234], [12.9250, 77.6250]] as [number, number][] },
  { id: 'RS-105', name: 'Sarjapur Road', health: 50, defects: 24, type: 'Waterlogging', length: '5.0 km', lastScan: '2 hours ago', coords: [[12.9220, 77.6400], [12.9100, 77.6600]] as [number, number][] },
];

const getColor = (health: number) => {
  if (health >= 80) return '#22C55E'; // semantic-low
  if (health >= 60) return '#EAB308'; // semantic-medium
  if (health >= 40) return '#F97316'; // semantic-high
  return '#EF4444'; // semantic-critical
};

const FILTERS = ['All Hazards', 'Pothole', 'Waterlogging', 'Road Cave-in'];

export const RoadHealth = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Hazards');

  const filteredSegments = fakeSegments.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All Hazards' || s.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-primary">City Road Health Map</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Interactive map displaying the condition of roads across Bengaluru. Segment scores are calculated by NagarNetra edge-AI in real-time based on defect density.
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Map View */}
        <div className="lg:col-span-2 bg-card border rounded-lg overflow-hidden shadow-sm h-full relative">
          
          {/* Defect Layer Filters */}
          <div className="absolute top-4 left-4 z-[400] flex gap-2 pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-sm border rounded-lg shadow-sm flex items-center p-1">
              <div className="px-3 text-muted-foreground flex items-center">
                <Filter size={16} />
              </div>
              <div className="flex gap-1">
                {FILTERS.map(f => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors",
                      activeFilter === f ? "bg-brand-primary text-white" : "hover:bg-muted text-foreground"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border flex flex-col gap-3 pointer-events-auto min-w-[180px]">
            <h4 className="font-semibold text-sm border-b pb-2">Condition Legend</h4>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="w-3 h-3 rounded-sm bg-[#22C55E]"></div> Good (80-100)
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="w-3 h-3 rounded-sm bg-[#EAB308]"></div> Moderate (60-79)
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="w-3 h-3 rounded-sm bg-[#F97316]"></div> Poor (40-59)
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="w-3 h-3 rounded-sm bg-[#EF4444]"></div> Critical (0-39)
            </div>
          </div>

          <MapShell center={[12.935, 77.63]} zoom={13} scrollWheelZoom={true}>
            {filteredSegments.map((segment) => (
              <Polyline 
                key={segment.id} 
                positions={segment.coords} 
                pathOptions={{ 
                  color: getColor(segment.health), 
                  weight: 8,
                  opacity: 0.9 
                }}
              >
                <Popup className="rounded-lg">
                  <div className="p-1 min-w-[200px]">
                    <h4 className="font-semibold text-sm text-brand-primary">{segment.name}</h4>
                    <p className="text-xs text-muted-foreground">{segment.length} scanned</p>
                    <div className="mt-3 flex justify-between items-center bg-muted/30 p-2 rounded-md">
                      <span className="text-xs font-medium">Condition Score</span>
                      <span className="text-lg font-bold" style={{ color: getColor(segment.health) }}>{segment.health}/100</span>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            ))}
          </MapShell>
        </div>

        {/* Segments List */}
        <div className="bg-card border rounded-lg shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-background relative flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-brand-secondary">Segment Rankings</h3>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md font-medium">
                {filteredSegments.length} Segments
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search road by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-accent/50 border border-border rounded-md h-9 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/10">
            {filteredSegments.sort((a,b) => a.health - b.health).map((segment) => (
              <div key={segment.id} className="p-4 border rounded-lg hover:shadow-sm transition-all bg-white flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-brand-secondary">{segment.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{segment.length}</div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="font-bold text-2xl leading-none" style={{ color: getColor(segment.health) }}>
                      {segment.health}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold mt-1 tracking-wider">Score</div>
                  </div>
                </div>
                <div className="flex gap-4 border-t pt-3 mt-1 px-1">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-amber-500" />
                    <span className="text-xs font-semibold text-foreground">{segment.defects} {segment.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity size={14} className="text-brand-primary/60" />
                    <span className="text-xs font-medium text-muted-foreground">{segment.lastScan}</span>
                  </div>
                </div>
              </div>
            ))}
            {filteredSegments.length === 0 && (
              <div className="text-center p-8 text-muted-foreground flex flex-col items-center gap-2">
                <Info size={24} className="opacity-40" />
                <span className="text-sm font-medium">No roads found matching your criteria.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
