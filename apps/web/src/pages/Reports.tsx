import { PageHeader } from '../components/layout/PageHeader';
import { FileText, Download, CalendarClock, LayoutTemplate, Plus } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

const fakeTemplates = [
  { id: 'T-01', name: 'Monthly Ward Health Summary', frequency: 'Monthly', format: 'PDF, Excel' },
  { id: 'T-02', name: 'SLA Breach Executive Report', frequency: 'Weekly', format: 'PDF' },
  { id: 'T-03', name: 'Hit-and-Run Incident Packets', frequency: 'On-Demand', format: 'PDF (Secure)' },
  { id: 'T-04', name: 'Traffic Corridor Bottlenecks', frequency: 'Daily', format: 'Excel' },
];

const fakeArchives = [
  { id: 'R-1001', name: 'Monthly Ward Health (Aug 2026)', generated: '2026-09-01T08:00:00Z', format: 'PDF', status: 'Ready' },
  { id: 'R-1002', name: 'SLA Breach (Week 34)', generated: '2026-09-20T08:00:00Z', format: 'PDF', status: 'Ready' },
  { id: 'R-1003', name: 'Traffic Corridor Bottlenecks (Sep 24)', generated: '2026-09-24T00:00:00Z', format: 'Excel', status: 'Ready' },
  { id: 'R-1004', name: 'Custom: Risk Analytics Extrapolate', generated: '2026-09-24T10:15:00Z', format: 'CSV', status: 'Processing' },
];

export const Reports = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Reports & Analytics" 
        breadcrumbs={[{ label: 'Governance' }, { label: 'Reports' }]}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex gap-2 items-center">
            <Plus size={16} /> Generate Custom Report
          </button>
        }
      />

      <div>
        <h3 className="font-semibold text-lg mb-4 flex gap-2 items-center">
          <LayoutTemplate size={20} className="text-muted-foreground" />
          Report Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fakeTemplates.map(t => (
            <div key={t.id} className="bg-card border rounded-xl p-5 shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={20} />
                </div>
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{t.format}</span>
              </div>
              <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">{t.name}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-3">
                <CalendarClock size={14} /> Schedule: {t.frequency}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden mt-4">
        <div className="p-4 border-b bg-muted/20">
          <h3 className="font-semibold text-lg">Recent Archives</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Report Name</th>
                <th className="px-6 py-4 font-medium">Generated Date (UTC)</th>
                <th className="px-6 py-4 font-medium">Format</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {fakeArchives.map(arc => (
                <tr key={arc.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{arc.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{new Date(arc.generated).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{arc.format}</span>
                  </td>
                  <td className="px-6 py-4">
                    {arc.status === 'Ready' ? (
                      <StatusBadge status="good" label="Ready" />
                    ) : (
                      <StatusBadge status="moderate" label="Processing..." />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      disabled={arc.status !== 'Ready'}
                      className="text-primary hover:underline font-medium flex items-center gap-2 justify-end ml-auto disabled:opacity-50 disabled:hover:no-underline"
                    >
                      <Download size={16} /> Download
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
