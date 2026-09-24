import { ShieldCheck, TrendingUp, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { MapShell } from '../components/map/MapShell';
import { CircleMarker } from 'react-leaflet';
import { Link } from 'react-router-dom';

const MOCK_PULSE_DATA = [
  { time: '00:00', score: 62 },
  { time: '04:00', score: 65 },
  { time: '08:00', score: 48 }, // Morning rush hour
  { time: '12:00', score: 55 },
  { time: '16:00', score: 50 }, // Evening rush hour
  { time: '20:00', score: 70 },
  { time: '23:59', score: 75 },
];

const MOCK_RISK_DATA = [
  { subject: 'Road Damage', A: 85, fullMark: 100 },
  { subject: 'Congestion', A: 92, fullMark: 100 },
  { subject: 'Waterlogging', A: 30, fullMark: 100 },
  { subject: 'Accidents', A: 45, fullMark: 100 },
  { subject: 'Construction', A: 70, fullMark: 100 },
  { subject: 'Streetlights', A: 20, fullMark: 100 },
];

const MOCK_ACTIVE_ISSUES = [
  { id: 'TKT-892', type: 'Severe Pothole Cluster', loc: 'ORR Bellandur', time: '10 mins ago', status: 'Verifying' },
  { id: 'TKT-891', type: 'Waterlogging', loc: 'Silk Board', time: '25 mins ago', status: 'Department Assigned' },
  { id: 'TKT-890', type: 'Broken Divider', loc: 'Indiranagar', time: '1 hr ago', status: 'Work Order Issued' },
];

export const Home = () => {
  const currentPulse = MOCK_PULSE_DATA[MOCK_PULSE_DATA.length - 1].score;

  return (
    <div className="flex flex-col gap-8 pb-16">
      
      {/* Hero Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-brand-secondary text-white p-8 rounded-lg shadow-sm relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-primary rounded-full blur-[100px] opacity-40"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} className="text-emerald-400" /> Live Bengaluru Civic Grid
          </div>
          <h1 className="text-4xl font-bold mb-3">NagarNetra Public Dashboard</h1>
          <p className="text-gray-300 text-lg font-medium">
            Real-time urban intelligence powered by edge-AI on BMTC buses. 
            Track road health, active hazards, and city-wide response metrics instantly.
          </p>
        </div>
        <div className="relative z-10 flex gap-4">
          <Link to="/track" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold py-2.5 px-6 rounded-md transition-all shadow-sm">
            Track Ticket
          </Link>
          <Link to="/civic-hub" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-2.5 px-6 rounded-md transition-all">
            Report Issue
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Top Left: City Pulse */}
        <div className="lg:col-span-2 bg-card border rounded-lg p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-brand-secondary flex items-center gap-2">
                <Activity className="text-brand-primary" /> City Pulse Index
              </h2>
              <p className="text-muted-foreground text-sm mt-1">Aggregated live score of city mobility & safety (0-100).</p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-black ${currentPulse >= 75 ? 'text-green-600' : currentPulse >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                {currentPulse}
              </div>
              <div className="text-xs font-semibold text-green-600 flex items-center justify-end gap-1 uppercase tracking-wider mt-1">
                <TrendingUp size={12} /> Improving
              </div>
            </div>
          </div>
          
          <div className="flex-1 h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_PULSE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value}/100`, 'Pulse Score']}
                />
                <Area type="monotone" dataKey="score" stroke="#1E3A8A" strokeWidth={3} fillOpacity={1} fill="url(#colorPulse)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Right: Urban Risk Index */}
        <div className="bg-card border rounded-lg p-6 shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold text-brand-secondary mb-1">Urban Risk Factors</h2>
          <p className="text-muted-foreground text-xs mb-6">Real-time breakdown of current city hazards.</p>
          
          <div className="flex-1 min-h-[250px] -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={MOCK_RISK_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Risk Level" dataKey="A" stroke="#EF4444" strokeWidth={2} fill="#EF4444" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 bg-red-50 border border-red-100 rounded-md p-3 flex gap-3 items-start">
            <ShieldAlert size={18} className="text-red-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-red-900">High Congestion Alert:</span> 
              <span className="text-red-800 font-medium"> Traffic speeds down 40% on ORR due to verified road damage.</span>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bottom Left: Live Map Overview */}
        <div className="lg:col-span-2 bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-brand-secondary">Live Civic Map</h2>
            <p className="text-muted-foreground text-sm mt-1">High-level view of active AI detections and Black Spots.</p>
          </div>
          <div className="flex-1 h-[350px] relative z-0">
            <MapShell center={[12.9716, 77.5946]} zoom={12} scrollWheelZoom={false}>
              {/* Dummy Black Spots */}
              <CircleMarker center={[12.9343, 77.6050]} radius={20} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3, weight: 0 }} />
              <CircleMarker center={[12.9279, 77.6271]} radius={35} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 0 }} />
              <CircleMarker center={[12.9172, 77.6228]} radius={25} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.4, weight: 0 }} />
            </MapShell>
            
            <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-md shadow-sm border border-gray-100 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-50"></div>
                <span className="text-xs font-semibold text-gray-700">Black Spot Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="text-xs font-semibold text-gray-700">Active Work Order</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right: Active & Resolved Feed */}
        <div className="bg-card border rounded-lg p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-brand-secondary">Live Feed</h2>
            <Link to="/transparency" className="text-brand-primary text-sm font-semibold hover:underline">View All</Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-50 border border-amber-100 rounded-md p-4 text-center">
              <div className="text-3xl font-black text-amber-600">342</div>
              <div className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider mt-1">Active Issues</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center">
              <div className="text-3xl font-black text-green-600">8,450</div>
              <div className="text-[10px] font-semibold text-green-800 uppercase tracking-wider mt-1">Resolved YTD</div>
            </div>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {MOCK_ACTIVE_ISSUES.map((issue) => (
              <div key={issue.id} className="p-4 rounded-md border bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-sm text-brand-secondary group-hover:text-brand-primary transition-colors">{issue.type}</div>
                  <div className="text-[10px] font-semibold text-gray-400">{issue.time}</div>
                </div>
                <div className="text-xs text-muted-foreground mb-3 font-medium">{issue.loc}</div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${issue.status === 'Verifying' ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'}`}></div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">{issue.status}</div>
                </div>
              </div>
            ))}
          </div>
          
          <Link to="/verification" className="mt-4 w-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white font-semibold py-2.5 rounded-md transition-all flex justify-center items-center gap-2 text-sm">
            <CheckCircle2 size={16} /> Help Verify Issues
          </Link>
        </div>

      </div>
    </div>
  );
};
