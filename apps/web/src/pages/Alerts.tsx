import { useGetRecentEventsQuery } from '../features/apiSlice';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfidenceBar } from '../components/ui/ConfidenceBar';
import { Filter } from 'lucide-react';

export const Alerts = () => {
  const { data: events, isLoading } = useGetRecentEventsQuery({});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Live Alerts</h1>
        <button className="flex items-center gap-2 text-sm bg-card border px-3 py-1.5 rounded-md hover:bg-accent">
          <Filter size={16} /> Filter
        </button>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Event ID</th>
                <th className="px-6 py-3 font-medium">Type & Location</th>
                <th className="px-6 py-3 font-medium">Severity</th>
                <th className="px-6 py-3 font-medium">AI Confidence</th>
                <th className="px-6 py-3 font-medium">Time Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading alerts...</td></tr>
              ) : (
                events?.map((event: any) => (
                  <tr key={event.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{event.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{event.type}</div>
                      <div className="text-xs text-muted-foreground">{event.lat.toFixed(4)}, {event.lng.toFixed(4)}</div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={event.severity} /></td>
                    <td className="px-6 py-4 w-48"><ConfidenceBar score={event.confidence} label="" /></td>
                    <td className="px-6 py-4 text-muted-foreground">{event.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
