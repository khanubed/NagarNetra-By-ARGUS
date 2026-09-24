import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Building2, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, Search } from 'lucide-react';

const fakeDepartments = [
  { id: 'D-01', name: 'Public Works Dept (PWD)', sla: 74, avgRes: '4.2 days', open: 142, reopen: '12%', status: 'high' },
  { id: 'D-02', name: 'Traffic Police', sla: 92, avgRes: '1.5 days', open: 28, reopen: '3%', status: 'good' },
  { id: 'D-03', name: 'BWSSB (Water/Drainage)', sla: 65, avgRes: '6.8 days', open: 85, reopen: '18%', status: 'moderate' },
  { id: 'D-04', name: 'BESCOM (Electricity)', sla: 88, avgRes: '2.1 days', open: 41, reopen: '5%', status: 'good' },
  { id: 'D-05', name: 'BBMP Solid Waste', sla: 81, avgRes: '2.4 days', open: 56, reopen: '8%', status: 'good' },
  { id: 'D-06', name: 'Forestry (Tree Fall)', sla: 95, avgRes: '0.8 days', open: 5, reopen: '1%', status: 'good' },
];

export const Departments = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Department Performance" 
        breadcrumbs={[{ label: 'Governance' }, { label: 'Departments' }]}
        actions={
          <button className="bg-muted text-foreground px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted/80">
            Export Scorecards
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="City-wide SLA Adherence" value="82.5%" trend="+2.1%" trendLabel="vs last month" icon={<CheckCircle2 size={20} />} />
        <KpiCard title="Avg Resolution Time" value="3.4" unit="days" trend="-0.5" trendLabel="days vs baseline" icon={<Clock size={20} />} />
        <KpiCard title="Total Open Tickets" value="357" trend="-12" trendLabel="since yesterday" icon={<Building2 size={20} />} />
        <KpiCard title="Overall Reopen Rate" value="8.4%" trend="+1.2%" trendLabel="needs attention" icon={<AlertTriangle size={20} />} severity="moderate" />
      </div>

      <div className="bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden mt-2">
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <h3 className="font-semibold text-lg">Department Scorecards</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search departments..."
              className="w-full bg-background border rounded-md h-9 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">SLA Compliance</th>
                <th className="px-6 py-4 font-medium text-right">Avg Resolution</th>
                <th className="px-6 py-4 font-medium text-right">Open Tickets</th>
                <th className="px-6 py-4 font-medium text-right">Reopen Rate</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {fakeDepartments.map(dept => (
                <tr key={dept.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {dept.name.charAt(0)}
                    </div>
                    {dept.name}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge 
                      status={dept.status as any} 
                      label={`${dept.sla}%`} 
                      icon={<CheckCircle2 size={14} />} 
                    />
                    <div className="w-24 h-1.5 bg-muted rounded-full mt-2">
                      <div 
                        className={`h-1.5 rounded-full ${
                          dept.sla >= 80 ? 'bg-semantic-good' : dept.sla >= 60 ? 'bg-semantic-moderate' : 'bg-semantic-critical'
                        }`} 
                        style={{ width: `${dept.sla}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">{dept.avgRes}</td>
                  <td className="px-6 py-4 text-right font-mono">{dept.open}</td>
                  <td className="px-6 py-4 text-right font-mono text-semantic-moderate">{dept.reopen}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium flex items-center gap-1 justify-end ml-auto">
                      View <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
