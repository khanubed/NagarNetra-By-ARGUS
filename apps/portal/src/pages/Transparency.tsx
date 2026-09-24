import { Activity, ShieldCheck, TrendingUp, IndianRupee, Users, Clock, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const MOCK_SAVINGS_DATA = [
  { month: 'Jan', savings: 12 },
  { month: 'Feb', savings: 18 },
  { month: 'Mar', savings: 25 },
  { month: 'Apr', savings: 32 },
  { month: 'May', savings: 41 },
  { month: 'Jun', savings: 55 },
];

const MOCK_DEPARTMENTS = [
  { name: 'BBMP - Road Maintenance', sla: 88, resolutionTime: '4.2 days', open: 342, closed: 4210 },
  { name: 'BWSSB - Drainage', sla: 76, resolutionTime: '6.5 days', open: 124, closed: 890 },
  { name: 'Traffic Police - Infrastructure', sla: 94, resolutionTime: '2.1 days', open: 45, closed: 1205 },
  { name: 'BESCOM - Lighting', sla: 82, resolutionTime: '5.0 days', open: 210, closed: 1450 },
  { name: 'BBMP - Solid Waste', sla: 91, resolutionTime: '1.8 days', open: 89, closed: 2310 },
];

const getSlaColor = (sla: number) => {
  if (sla >= 90) return 'text-green-600 bg-green-50 border-green-200';
  if (sla >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (sla >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

const getSlaBarColor = (sla: number) => {
  if (sla >= 90) return 'bg-green-500';
  if (sla >= 80) return 'bg-blue-500';
  if (sla >= 70) return 'bg-amber-500';
  return 'bg-red-500';
};

export const Transparency = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-brand-primary mb-4">Public Transparency Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          NagarNetra is committed to radical transparency. Here you can see exactly how the AI is performing, how fast departments are responding, and how much taxpayer money is being saved.
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total AI Detections</div>
            <div className="text-4xl font-black text-brand-secondary">14,293</div>
            <div className="text-sm font-medium text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +24% this month
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-green-100 text-green-700 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Issues Resolved</div>
            <div className="text-4xl font-black text-brand-secondary">8,450</div>
            <div className="text-sm font-medium text-muted-foreground mt-2">
              <span className="text-green-600 font-semibold">59%</span> overall resolution rate
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Avg SLA Compliance</div>
            <div className="text-4xl font-black text-brand-secondary">92%</div>
            <div className="text-sm font-medium text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> Improved from 84%
            </div>
          </div>
        </div>
      </div>

      {/* Department Scorecards */}
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-muted/10">
          <h2 className="text-2xl font-semibold text-brand-secondary">Department Scorecards</h2>
          <p className="text-muted-foreground text-sm mt-1">Real-time performance metrics holding civic departments accountable to SLAs.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">SLA Compliance</th>
                <th className="p-4 font-semibold hidden md:table-cell">Avg Resolution Time</th>
                <th className="p-4 font-semibold hidden sm:table-cell text-right">Active Tickets</th>
                <th className="p-4 font-semibold text-right">Resolved YTD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {MOCK_DEPARTMENTS.sort((a,b) => b.sla - a.sla).map((dept, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-semibold text-brand-secondary">{dept.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("px-2.5 py-1 rounded-md text-xs font-bold border", getSlaColor(dept.sla))}>
                        {dept.sla}%
                      </div>
                      <div className="hidden sm:block w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", getSlaBarColor(dept.sla))} style={{ width: `${dept.sla}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                    {dept.resolutionTime}
                  </td>
                  <td className="p-4 text-right hidden sm:table-cell">
                    <span className="font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 text-sm">
                      {dept.open.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-semibold text-brand-secondary text-sm">
                      {dept.closed.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Stats Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Budget Savings */}
        <div className="bg-card border rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-brand-secondary">Taxpayer Savings</h2>
              <p className="text-muted-foreground mt-1 text-sm">Estimated survey costs saved by using automated Edge AI on existing bus fleets.</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
              <IndianRupee size={24} />
            </div>
          </div>
          
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-5xl font-black text-emerald-600">₹55L</span>
            <span className="text-muted-foreground font-semibold">Saved YTD</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SAVINGS_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}L`, 'Savings']}
                />
                <Area type="monotone" dataKey="savings" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Citizen Engagement */}
        <div className="bg-gradient-to-br from-brand-primary to-blue-900 rounded-lg shadow-sm p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Users size={120} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Citizen Verification Engine</h2>
            <p className="text-blue-100 text-sm max-w-sm mb-8 font-medium">
              NagarNetra's accuracy relies on active citizens verifying edge-cases before work orders are generated.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-4xl font-black mb-1 text-white">42K+</div>
                <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Active Verifiers</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-1 text-white">98.5%</div>
                <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider">AI Accuracy Rate</div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 bg-black/20 backdrop-blur-sm p-5 rounded-lg border border-white/10 mt-auto">
            <h4 className="font-semibold mb-1">Join the Community</h4>
            <p className="text-sm text-blue-100 mb-4">Help validate AI detections and earn trust points in your ward.</p>
            <Link to="/verification" className="bg-white text-brand-primary font-semibold px-6 py-2.5 rounded-md text-sm hover:bg-blue-50 transition-colors w-full flex items-center justify-center gap-2">
              Open Verification Center <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};
