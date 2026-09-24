import { useGetRecentEventsQuery } from '../features/apiSlice';
import { CircleMarker, Popup } from 'react-leaflet';
import { MapShell } from '../components/map/MapShell';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { Layers } from 'lucide-react';

const severityColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e'
};

export const Heatmaps = () => {
  const { data: events, isLoading } = useGetRecentEventsQuery({});
  const [activeLayer, setActiveLayer] = useState<string>('All Severity');

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spatial Density Heatmaps</h1>
          <p className="text-muted-foreground mt-1">Live urban sensing data aggregated across 198 wards.</p>
        </div>
      </div>

      <div className="flex-1 bg-card border rounded-xl overflow-hidden shadow-sm relative">
        {/* Floating Layer Control */}
        <div className="absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur border shadow-sm rounded-lg p-4 w-64">
          <h3 className="font-semibold flex items-center gap-2 mb-3"><Layers size={16} /> Data Layers</h3>
          <div className="space-y-2">
            {['All Severity', 'Critical Incidents', 'Waterlogging Only', 'Pothole Density'].map(layer => (
              <label key={layer} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1.5 rounded transition-colors">
                <input 
                  type="radio" 
                  name="layer" 
                  checked={activeLayer === layer}
                  onChange={() => setActiveLayer(layer)}
                  className="text-primary focus:ring-primary h-4 w-4"
                />
                {layer}
              </label>
            ))}
          </div>
        </div>

        <MapShell center={[12.9716, 77.5946]} zoom={12} scrollWheelZoom={true} theme="dark">
          {!isLoading && events?.map((event: any) => {
            // Apply layer filters
            if (activeLayer === 'Critical Incidents' && event.severity !== 'critical') return null;
            if (activeLayer === 'Waterlogging Only' && event.type !== 'Waterlogging') return null;
            if (activeLayer === 'Pothole Density' && event.type !== 'Pothole') return null;

            return (
              <CircleMarker 
                key={event.id} 
                center={[event.lat, event.lng]}
                radius={activeLayer === 'All Severity' ? 12 : 18} // Larger radii for "heatmap" blend effect
                pathOptions={{ 
                  color: 'transparent',
                  fillColor: severityColors[event.severity as keyof typeof severityColors],
                  fillOpacity: activeLayer === 'All Severity' ? 0.15 : 0.3, // High transparency to blend
                }}
              />
            )
          })}
        </MapShell>
      </div>
    </div>
  );
};
