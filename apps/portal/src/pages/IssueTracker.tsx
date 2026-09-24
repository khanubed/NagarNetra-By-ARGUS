import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, CheckCircle2, Circle, ShieldAlert, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock Ticket Data
const MOCK_TICKET: Record<string, any> = {
  'TKT-82931': {
    id: 'TKT-82931',
    type: 'Severe Pothole',
    location: 'Koramangala 80ft Road, Near Sony World Signal',
    reportedAt: 'Oct 14, 2026, 09:30 AM',
    status: 'department', // detect, ward, department, ticket, resolution, escalate
    department: 'BBMP - Road Maintenance',
    description: 'AI detection via BMTC Route 342F. Cluster of 3 severe potholes identified causing traffic slow-down.',
    slaEnd: 'Oct 16, 2026, 09:30 AM',
  },
  'TKT-10042': {
    id: 'TKT-10042',
    type: 'Waterlogging Incident',
    location: 'Silk Board Junction',
    reportedAt: 'Oct 12, 2026, 11:15 AM',
    status: 'escalate',
    department: 'BWSSB - Drainage',
    description: 'Severe waterlogging detected by edge AI during heavy rain. Depth estimated at 1.2ft.',
    slaEnd: 'Oct 13, 2026, 11:15 AM (Breached)',
  },
  'TKT-99120': {
    id: 'TKT-99120',
    type: 'Broken Streetlight',
    location: 'HSR Layout Sector 2',
    reportedAt: 'Oct 15, 2026, 08:00 PM',
    status: 'detect',
    department: 'BESCOM - Lighting',
    description: 'AI night-vision detected inactive streetlight sequence spanning 200m.',
    slaEnd: 'Oct 17, 2026, 08:00 PM',
  },
  'TKT-44501': {
    id: 'TKT-44501',
    type: 'Illegal Garbage Dump',
    location: 'BTM Layout Stage 1',
    reportedAt: 'Oct 10, 2026, 02:45 PM',
    status: 'resolution',
    department: 'BBMP - Solid Waste Management',
    description: 'Large garbage pile detected blocking pedestrian pathway. Contractor dispatched and area cleared.',
    slaEnd: 'Oct 12, 2026, 02:45 PM',
  }
};

const PIPELINE_STAGES = [
  { id: 'detect', label: 'Detect', desc: 'AI Captured' },
  { id: 'ward', label: 'Ward', desc: 'Verified' },
  { id: 'department', label: 'Department', desc: 'Assigned' },
  { id: 'ticket', label: 'Ticket', desc: 'Work Order' },
  { id: 'resolution', label: 'Resolution', desc: 'Fix Confirmed' },
  { id: 'escalate', label: 'Escalate', desc: 'SLA Breach' },
];

export const IssueTracker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(id || '');
  const [isSearching, setIsSearching] = useState(false);
  const [ticket, setTicket] = useState<any>(id ? MOCK_TICKET[id] || null : null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      setSearchId(id);
      const found = MOCK_TICKET[id];
      if (found) {
        setTicket(found);
        setNotFound(false);
      } else {
        setTicket(null);
        setNotFound(true);
      }
    } else {
      setTicket(null);
      setNotFound(false);
    }
  }, [id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      navigate(`/track/${searchId.trim()}`);
    }, 500);
  };

  const getStageStatus = (stageIndex: number) => {
    if (!ticket) return 'pending';
    const currentIdx = PIPELINE_STAGES.findIndex(s => s.id === ticket.status);
    if (stageIndex < currentIdx) return 'completed';
    if (stageIndex === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-brand-primary mb-4">Issue Tracking Portal</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter a NagarNetra Ticket ID to view real-time status updates, SLA tracking, and departmental assignment details. (Try TKT-82931, TKT-10042, TKT-99120, or TKT-44501)
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12 shadow-sm rounded-lg overflow-hidden">
        <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          placeholder="e.g. TKT-82931"
          className="w-full bg-white border-2 border-brand-primary/20 h-14 pl-12 pr-32 text-lg focus:outline-none focus:border-brand-primary transition-colors font-mono"
        />
        <button 
          type="submit"
          disabled={isSearching}
          className="absolute right-2 top-2 bottom-2 px-6 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
        >
          {isSearching ? '...' : 'Track'}
        </button>
      </form>

      {notFound && !isSearching && (
        <div className="text-center p-12 bg-red-50 border border-red-100 rounded-lg">
          <ShieldAlert size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Ticket Not Found</h2>
          <p className="text-red-800/80">We couldn't find a ticket matching ID "{searchId}". Please check the ID and try again.</p>
        </div>
      )}

      {/* Show recent tickets list if no search is active and no specific ticket is being viewed */}
      {!id && !ticket && !isSearching && (
        <div className="max-w-2xl mx-auto">
          <h3 className="font-semibold text-lg mb-4 text-brand-secondary">Recent Public Tickets</h3>
          <div className="flex flex-col gap-3">
            {Object.values(MOCK_TICKET).map((mockTicket) => (
              <Link 
                key={mockTicket.id}
                to={`/track/${mockTicket.id}`}
                className="bg-white border rounded-lg p-4 hover:shadow-sm hover:border-brand-primary/40 transition-all flex justify-between items-center group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      {mockTicket.id}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {mockTicket.reportedAt}
                    </span>
                  </div>
                  <h4 className="font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors">
                    {mockTicket.type}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{mockTicket.location}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full",
                    mockTicket.status === 'resolution' ? "bg-green-100 text-green-700" :
                    mockTicket.status === 'escalate' ? "bg-red-100 text-red-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {mockTicket.status === 'resolution' ? 'Resolved' : mockTicket.status === 'escalate' ? 'Escalated' : 'Active'}
                  </div>
                  <span className="text-xs font-semibold text-brand-primary mt-2 group-hover:underline">View Status</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {ticket && !isSearching && (
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          
          <div className="bg-brand-secondary p-6 text-white flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-md text-xs font-semibold tracking-widest uppercase">
                  {ticket.id}
                </span>
                <span className="text-white/70 text-sm">{ticket.reportedAt}</span>
              </div>
              <h2 className="text-3xl font-bold">{ticket.type}</h2>
              <p className="flex items-center gap-1.5 mt-2 text-white/80 font-medium">
                <MapPin size={18} /> {ticket.location}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white/70 uppercase tracking-wider mb-1">Target Resolution</div>
              <div className={cn("text-xl font-bold", ticket.status === 'escalate' ? 'text-red-400' : 'text-amber-300')}>
                {ticket.slaEnd}
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="font-semibold text-lg mb-8 text-brand-secondary">Resolution Pipeline</h3>
            
            {/* SLA Node-and-Connector Diagram */}
            <div className="relative flex justify-between items-start mb-12">
              <div className="absolute top-4 left-0 right-0 h-1 bg-muted rounded-full -z-10"></div>
              
              {PIPELINE_STAGES.map((stage, idx) => {
                const status = getStageStatus(idx);
                // Special styling for Escalate stage if it's active
                const isEscalateActive = status === 'active' && stage.id === 'escalate';
                
                return (
                  <div key={stage.id} className="flex flex-col items-center text-center w-24 relative">
                    {/* Connector Line Fill */}
                    {idx > 0 && status !== 'pending' && (
                      <div className={cn(
                        "absolute top-4 right-1/2 w-full h-1 -z-10 -ml-12",
                        isEscalateActive ? "bg-red-500" : "bg-brand-primary"
                      )}></div>
                    )}
                    
                    {/* Node */}
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center mb-3 transition-colors border-2",
                      status === 'completed' ? "bg-brand-primary border-brand-primary text-white" :
                      isEscalateActive ? "bg-white border-red-500 text-red-500 ring-4 ring-red-500/20" :
                      status === 'active' ? "bg-white border-brand-primary text-brand-primary ring-4 ring-brand-primary/20" :
                      "bg-muted border-muted-foreground/30 text-muted-foreground"
                    )}>
                      {status === 'completed' ? <CheckCircle2 size={18} /> : 
                       status === 'active' ? <Circle size={12} className={isEscalateActive ? "fill-red-500" : "fill-brand-primary"} /> : 
                       <span className="text-xs font-semibold">{idx + 1}</span>}
                    </div>
                    
                    <div className={cn("text-sm font-semibold mb-1", 
                      isEscalateActive ? 'text-red-600' : 
                      status === 'active' ? 'text-brand-primary' : 'text-foreground'
                    )}>
                      {stage.label}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight px-1">{stage.desc}</div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Assigned Department</div>
                  <div className="font-semibold text-lg flex items-center gap-2">
                    <ShieldAlert size={18} className="text-brand-primary" />
                    {ticket.department}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Issue Description</div>
                  <div className="text-sm leading-relaxed text-foreground">{ticket.description}</div>
                </div>
              </div>

              <div className={cn(
                "border rounded-lg p-5 flex gap-4",
                ticket.status === 'escalate' ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
              )}>
                <AlertTriangle className={cn("shrink-0 mt-0.5", ticket.status === 'escalate' ? "text-red-600" : "text-amber-600")} />
                <div>
                  <h4 className={cn("font-semibold mb-1", ticket.status === 'escalate' ? "text-red-900" : "text-amber-900")}>
                    Escalation Policy
                  </h4>
                  <p className={cn("text-sm", ticket.status === 'escalate' ? "text-red-800/90 font-medium" : "text-amber-800/80")}>
                    {ticket.status === 'escalate' 
                      ? "This issue has breached its SLA and is actively escalated to the Joint Commissioner level for immediate intervention."
                      : "If this issue is not resolved by the target resolution date, it will automatically escalate to the Joint Commissioner level per the active SLA guidelines."}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
