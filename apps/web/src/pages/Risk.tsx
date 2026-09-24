import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { ShieldAlert, Map, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { useState } from 'react';

const fakeWards = [
  { id: 'W-150', name: 'Bellandur', score: 82, breakdown: { road: 90, traffic: 95, accident: 70, water: 95, school: 40, citizen: 85 } },
  { id: 'W-174', name: 'HSR Layout', score: 65, breakdown: { road: 50, traffic: 80, accident: 60, water: 70, school: 50, citizen: 65 } },
  { id: 'W-112', name: 'Domlur', score: 45, breakdown: { road: 40, traffic: 55, accident: 40, water: 20, school: 60, citizen: 45 } },
  { id: 'W-089', name: 'Malleswaram', score: 35, breakdown: { road: 30, traffic: 40, accident: 30, water: 10, school: 80, citizen: 30 } },
  { id: 'W-193', name: 'Arakere', score: 76, breakdown: { road: 85, traffic: 60, accident: 65, water: 90, school: 55, citizen: 80 } },
];

const factorWeights = [
  { factor: 'Road Damage', weight: '25%' },
  { factor: 'Traffic Density', weight: '15%' },
  { factor: 'Accidents', weight: '25%' },
  { factor: 'Waterlogging', weight: '12%' },
  { factor: 'School Prox.', weight: '13%' },
  { factor: 'Citizen', weight: '10%' },
];

export const Risk = () => {
  const [selectedWard, setSelectedWard] = useState(fakeWards[0]);

  const radarData = [
    { subject: 'Road Damage', A: selectedWard.breakdown.road, fullMark: 100 },
    { subject: 'Traffic Density', A: selectedWard.breakdown.traffic, fullMark: 100 },
    { subject: 'Accident Freq.', A: selectedWard.breakdown.accident, fullMark: 100 },
    { subject: 'Waterlogging', A: selectedWard.breakdown.water, fullMark: 100 },
    { subject: 'School Prox.', A: selectedWard.breakdown.school, fullMark: 100 },
    { subject: 'Citizen Complaints', A: selectedWard.breakdown.citizen, fullMark: 100 },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      <PageHeader 
        title="Urban Risk Analytics" 
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Risk Analytics' }]} 
        actions={
          <button className="bg-muted text-foreground px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted/80">
            Adjust Parameters
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="City Average URI" value="58" unit="/100" trend="+4" trendLabel="vs last month" icon={<ShieldAlert size={20} />} severity="high" />
        <KpiCard title="High Risk Wards" value="12" unit="wards" trend="0" trendLabel="no change" icon={<Map size={20} />} severity="critical" />
        <KpiCard title="Highest Risk Factor" value="Road Damage" unit="" icon={<AlertTriangle size={20} />} severity="high" />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border rounded-xl shadow-sm flex flex-col p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-semibold text-lg">Risk Factor Decomposition</h3>
              <p className="text-sm text-muted-foreground">Showing composition for {selectedWard.name} ({selectedWard.id})</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-semantic-critical">{selectedWard.score}</div>
              <div className="text-xs uppercase text-muted-foreground font-medium tracking-wider">URI Score</div>
            </div>
          </div>
          
          <div className="flex-1 min-h-[400px] flex items-center justify-center -mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#8B94A4', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#555', fontSize: 10 }} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C212C', border: '1px solid #242B38', borderRadius: '8px' }}
                  itemStyle={{ color: '#E8ECF3' }}
                />
                <Radar name={selectedWard.name} dataKey="A" stroke="#F87171" fill="#F87171" fillOpacity={0.4} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 pt-6 border-t">
            {factorWeights.map((fw, i) => (
              <div key={i} className="text-center p-2 bg-muted/20 rounded-md border">
                <div className="text-[10px] text-muted-foreground uppercase mb-1">{fw.factor}</div>
                <div className="font-mono text-sm">{fw.weight}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-background flex justify-between items-center">
            <h3 className="font-semibold text-lg">Ward Leaderboard</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {fakeWards.sort((a,b) => b.score - a.score).map((ward, idx) => (
              <button 
                key={ward.id}
                onClick={() => setSelectedWard(ward)}
                className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors border ${
                  selectedWard.id === ward.id ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-red-500/20 text-red-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{ward.name}</div>
                    <div className="text-xs text-muted-foreground">{ward.id}</div>
                  </div>
                </div>
                <div className="font-bold font-mono" style={{ 
                  color: ward.score >= 80 ? '#B91C1C' : ward.score >= 60 ? '#C2410C' : ward.score >= 40 ? '#B45309' : '#15803D'
                }}>
                  {ward.score}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
