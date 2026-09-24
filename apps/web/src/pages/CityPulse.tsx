import { useGetAnalyticsQuery, useGetDashboardStatsQuery } from '../features/apiSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HeartPulse, TrendingUp, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';

const getScoreColor = (score: number) => {
  if (score >= 80) return '#15803D'; // Good
  if (score >= 60) return '#B45309'; // Moderate
  if (score >= 40) return '#C2410C'; // Poor
  return '#B91C1C'; // Critical
};

export const CityPulse = () => {
  const { data: analytics, isLoading } = useGetAnalyticsQuery({});
  const { data: stats } = useGetDashboardStatsQuery({});

  const score = stats?.cityPulseScore || 78;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="City Pulse Score™" 
        breadcrumbs={[{ label: 'Governance' }, { label: 'City Pulse' }]}
        actions={
          <div className="flex gap-4 items-center">
            <div className="text-right mr-4">
              <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>{score}</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Current Score</div>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
              Recalculate
            </button>
          </div>
        }
      />

      <p className="text-muted-foreground -mt-4 mb-6">
        Executive KPI aggregating Road Health, Traffic Flow, Public Safety, and Dept Efficiency.
      </p>

      {/* Component Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Road Health', score: 84, icon: TrendingUp },
          { label: 'Traffic Flow', score: 71, icon: Activity },
          { label: 'Public Safety', score: 76, icon: ShieldCheck },
          { label: 'Dept Efficiency', score: 80, icon: AlertTriangle },
        ].map(comp => (
          <div key={comp.label} className="bg-card border rounded-xl p-4 flex flex-col shadow-sm hover:border-primary/50 transition-colors cursor-pointer">
            <div className="text-muted-foreground mb-4"><comp.icon size={20} /></div>
            <div className="mt-auto">
              <div className="text-3xl font-bold" style={{ color: getScoreColor(comp.score) }}>{comp.score}</div>
              <div className="text-sm font-medium text-foreground">{comp.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 30 Day Trend Chart */}
      <div className="bg-card border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">30-Day Pulse Trend</h2>
        <div className="h-[400px] w-full">
          {!isLoading && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="pulseScore" stroke={getScoreColor(score)} strokeWidth={3} fillOpacity={1} fill="url(#colorPulse)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
