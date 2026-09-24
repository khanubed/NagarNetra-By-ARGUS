import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { Car, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const fakeChartData = [
  { time: '06:00', live: 25, historical: 22 },
  { time: '07:00', live: 45, historical: 40 },
  { time: '08:00', live: 85, historical: 70 },
  { time: '09:00', live: 95, historical: 88 },
  { time: '10:00', live: 75, historical: 80 },
  { time: '11:00', live: 60, historical: 65 },
  { time: '12:00', live: 65, historical: 60 },
  { time: '13:00', live: 70, historical: 65 },
  { time: '14:00', live: 65, historical: 62 },
  { time: '15:00', live: 80, historical: 70 },
  { time: '16:00', live: 88, historical: 75 },
  { time: '17:00', live: 98, historical: 90 },
  { time: '18:00', live: 110, historical: 95 }, // Current peak
  { time: '19:00', live: 105, historical: 90 },
  { time: '20:00', live: null, historical: 75 },
  { time: '21:00', live: null, historical: 50 },
];

const fakeBottlenecks = [
  { id: 'BN-01', name: 'Silk Board Junction', type: 'Severe Congestion', delay: '+24 min', speed: '4 km/h', trend: 'worsening' },
  { id: 'BN-02', name: 'Sony World Signal, Koramangala', type: 'Signal Backup', delay: '+12 min', speed: '8 km/h', trend: 'stable' },
  { id: 'BN-03', name: 'Tin Factory', type: 'Heavy Traffic', delay: '+18 min', speed: '6 km/h', trend: 'improving' },
  { id: 'BN-04', name: 'Marathahalli Bridge', type: 'Accident Backup', delay: '+35 min', speed: '2 km/h', trend: 'worsening' },
];

export const Traffic = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Traffic Analytics" 
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Traffic Analytics' }]} 
        actions={
          <button className="bg-muted text-foreground px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted/80">
            View Live Cameras
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="City Average Speed" value="18.4" unit="km/h" trend="-2.1%" trendLabel="vs last week" icon={<Car size={20} />} />
        <KpiCard title="Active Bottlenecks" value="14" trend="+3" trendLabel="since last hour" icon={<AlertTriangle size={20} />} severity="high" />
        <KpiCard title="Avg Route Delay" value="+12" unit="mins" trend="+4 mins" trendLabel="vs baseline" icon={<Clock size={20} />} severity="high" />
        <KpiCard title="Congestion Index" value="84" unit="/100" trend="+12" trendLabel="peak hour active" icon={<TrendingUp size={20} />} severity="critical" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Congestion Index vs Historical Baseline</h3>
          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fakeChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C212C', border: '1px solid #242B38', borderRadius: '8px' }}
                  itemStyle={{ color: '#E8ECF3' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" name="Live Congestion" dataKey="live" stroke="#F87171" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="30-Day Average" dataKey="historical" stroke="#3B9FE0" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-lg">Active Bottlenecks</h3>
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded">Top {fakeBottlenecks.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {fakeBottlenecks.map(bn => (
              <div key={bn.id} className="border rounded-lg p-4 bg-muted/20">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-sm">{bn.name}</div>
                  <div className="text-sm font-bold text-semantic-critical">{bn.delay}</div>
                </div>
                <div className="text-xs text-muted-foreground mb-3">{bn.type}</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono bg-background px-2 py-1 rounded border">{bn.speed}</span>
                  <span className={bn.trend === 'worsening' ? 'text-semantic-critical' : bn.trend === 'improving' ? 'text-semantic-good' : 'text-semantic-moderate'}>
                    {bn.trend === 'worsening' ? '↗ Worsening' : bn.trend === 'improving' ? '↘ Improving' : '→ Stable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
