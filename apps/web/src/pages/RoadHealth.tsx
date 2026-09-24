import { MapShell } from '../components/map/MapShell';
import { PageHeader } from '../components/layout/PageHeader';
import { Polyline, Popup } from 'react-leaflet';
import { Download, Search, AlertTriangle, Activity } from 'lucide-react';
import { useState } from 'react';

// Fake Data for Road Segments
const fakeSegments = [
  { id: 'RS-101', name: 'Outer Ring Road (Bellandur)', health: 35, defects: 42, length: '4.2 km', lastScan: '10 mins ago', coords: [[12.9279, 77.6271], [12.9350, 77.6500]] as [number, number][], status: 'Critical' },
  { id: 'RS-102', name: 'Koramangala 80ft Road', health: 65, defects: 12, length: '2.1 km', lastScan: '1 hour ago', coords: [[12.9345, 77.6201], [12.9400, 77.6250]] as [number, number][], status: 'Moderate' },
  { id: 'RS-103', name: 'Indiranagar 100ft Road', health: 92, defects: 2, length: '3.5 km', lastScan: '5 mins ago', coords: [[12.9716, 77.6411], [12.9800, 77.6450]] as [number, number][], status: 'Good' },
  { id: 'RS-104', name: 'Hosur Road (Silk Board)', health: 22, defects: 58, length: '1.8 km', lastScan: 'Just now', coords: [[12.9176, 77.6234], [12.9250, 77.6250]] as [number, number][], status: 'Critical' },
  { id: 'RS-105', name: 'Sarjapur Road', health: 50, defects: 24, length: '5.0 km', lastScan: '2 hours ago', coords: [[12.9220, 77.6400], [12.9100, 77.6600]] as [number, number][], status: 'Poor' },
];

const getColor = (health: number) => {
  if (health >= 80) return '#15803D'; // Good
  if (health >= 60) return '#B45309'; // Moderate
  if (health >= 40) return '#C2410C'; // Poor
  return '#B91C1C'; // Critical
};

export const RoadHealth = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSegments = fakeSegments.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      <PageHeader 
        title="Road Health" 
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Road Health' }]} 
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex gap-2 items-center">
            <Download size={16} /> Export Report
          </button>
        }
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Map View */}
        <div className="lg:col-span-2 bg-card border rounded-xl overflow-hidden shadow-sm h-full relative">
          <MapShell center={[12.935, 77.63]} zoom={13} scrollWheelZoom={true}>
            {fakeSegments.map((segment) => (
              <Polyline 
                key={segment.id} 
                positions={segment.coords} 
                pathOptions={{ 
                  color: getColor(segment.health), 
                  weight: 6,
                  opacity: 0.8 
                }}
              >
                <Popup className="rounded-lg">
                  <div className="p-1">
                    <h4 className="font-bold text-sm">{segment.name}</h4>
                    <p className="text-xs text-muted-foreground">{segment.id} • {segment.length}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs font-medium">Health Score</span>
                      <span className="text-sm font-bold" style={{ color: getColor(segment.health) }}>{segment.health}/100</span>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            ))}
          </MapShell>
        </div>

        {/* Segments List */}
        <div className="bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-background relative flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Segment Rankings</h3>
              <span className="text-xs bg-muted px-2 py-1 rounded font-mono">{fakeSegments.length} Segments</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search road segment..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-accent/50 border-none rounded-md h-9 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredSegments.sort((a,b) => a.health - b.health).map((segment) => (
              <div key={segment.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm">{segment.name}</div>
                    <div className="text-xs text-muted-foreground">{segment.id} • {segment.length}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg" style={{ color: getColor(segment.health) }}>{segment.health}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Score</div>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 border-t pt-2">
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={14} className="text-muted-foreground" />
                    <span className="text-xs font-medium">{segment.defects} Defects</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{segment.lastScan}</span>
                  </div>
                </div>
              </div>
            ))}
            {filteredSegments.length === 0 && (
              <div className="text-center p-4 text-muted-foreground text-sm">No segments found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
