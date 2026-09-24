import { useState } from 'react';
import { Search, Trophy, MapPin, TrendingUp, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_WARDS = [
  { id: 150, name: 'Bellandur', rank: 1, score: 92, activeIssues: 12, resolved: 340, trend: '+4' },
  { id: 174, name: 'HSR Layout', rank: 2, score: 88, activeIssues: 18, resolved: 290, trend: '+2' },
  { id: 112, name: 'Domlur', rank: 3, score: 85, activeIssues: 22, resolved: 180, trend: '-1' },
  { id: 177, name: 'J.P. Nagar', rank: 4, score: 79, activeIssues: 35, resolved: 210, trend: '+5' },
  { id: 149, name: 'Varthur', rank: 198, score: 34, activeIssues: 142, resolved: 45, trend: '-12' },
];

export const WardIntelligence = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWards = MOCK_WARDS.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.id.toString().includes(searchTerm)
  );

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-brand-primary mb-4">Ward Intelligence & Leaderboards</h1>
        <p className="text-lg text-muted-foreground">
          See how your neighborhood compares. NagarNetra tracks real-time resolution rates and active hazards across all 198 BBMP wards to foster healthy civic competition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Leaderboard List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Ward Name or Number (e.g. 150)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-border h-12 rounded-lg pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-sm font-medium"
            />
          </div>

          <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-5">Ward</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-3 text-right pr-4">Active Issues</div>
            </div>
            
            <div className="divide-y">
              {filteredWards.map(ward => (
                <div key={ward.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/10 transition-colors">
                  <div className="col-span-2 flex justify-center">
                    {ward.rank <= 3 ? (
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shadow-sm",
                        ward.rank === 1 ? "bg-amber-400" : ward.rank === 2 ? "bg-slate-300" : "bg-amber-700"
                      )}>
                        {ward.rank}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-muted-foreground bg-accent">
                        {ward.rank}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-5">
                    <div className="font-semibold text-brand-secondary text-lg">{ward.name}</div>
                    <div className="text-sm text-muted-foreground font-medium">Ward {ward.id}</div>
                  </div>
                  
                  <div className="col-span-2 text-center flex flex-col items-center">
                    <div className={cn(
                      "font-black text-xl",
                      ward.score >= 80 ? "text-green-600" : ward.score >= 50 ? "text-amber-600" : "text-red-600"
                    )}>
                      {ward.score}
                    </div>
                    <div className={cn(
                      "text-xs font-semibold flex items-center gap-0.5",
                      ward.trend.startsWith('+') ? "text-green-600" : "text-red-600"
                    )}>
                      <TrendingUp size={12} className={ward.trend.startsWith('-') ? "rotate-180" : ""} /> {ward.trend}
                    </div>
                  </div>
                  
                  <div className="col-span-3 text-right pr-4">
                    <div className="font-semibold text-lg">{ward.activeIssues}</div>
                    <div className="text-xs text-muted-foreground font-medium">Pending</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Highlights */}
        <div className="flex flex-col gap-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-sm relative overflow-hidden">
            <Trophy size={80} className="absolute -right-4 -bottom-4 text-amber-200/50 pointer-events-none" />
            <h3 className="font-semibold text-amber-900 mb-2 relative z-10">Top Performing Ward</h3>
            <div className="text-3xl font-black text-amber-600 mb-1 relative z-10">Bellandur (150)</div>
            <p className="text-amber-800/90 text-sm mb-4 relative z-10">Highest resolution rate this week. 92% of AI-detected issues fixed within 48 hours.</p>
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 bg-amber-100/70 p-2.5 rounded-md relative z-10">
              <ShieldCheck size={16} /> 340 Issues Resolved
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-brand-secondary mb-4 flex items-center gap-2">
              <MapPin className="text-brand-primary" /> Your Ward
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Sign in or allow location access to see detailed metrics and active hazards for your specific neighborhood.</p>
            <button className="w-full bg-accent hover:bg-accent/80 text-brand-secondary font-semibold py-2.5 rounded-md text-sm transition-colors border shadow-sm">
              Detect My Ward
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
