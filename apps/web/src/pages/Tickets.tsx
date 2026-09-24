import { useState, useMemo } from 'react';
import { useGetActiveTicketsQuery } from '../features/apiSlice';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Filter, Download } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';

export const Tickets = () => {
  const { data: tickets, isLoading } = useGetActiveTicketsQuery({});
  const [activeTab, setActiveTab] = useState('All');

  const departments = useMemo(() => {
    if (!tickets) return ['All'];
    const depts = new Set(tickets.map((t: any) => t.department));
    return ['All', ...Array.from(depts)] as string[];
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    if (activeTab === 'All') return tickets;
    return tickets.filter((t: any) => t.department === activeTab);
  }, [tickets, activeTab]);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      <PageHeader 
        title="Work Orders & Tickets" 
        breadcrumbs={[{ label: 'Operations' }, { label: 'Tickets' }]}
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm bg-card border px-3 py-1.5 rounded-md hover:bg-accent transition-colors">
              <Filter size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
              <Download size={16} /> Export CSV
            </button>
          </div>
        }
      />

      <div className="flex border-b overflow-x-auto scrollbar-hide">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveTab(dept)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === dept 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto relative">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 font-medium border-b">Ticket ID</th>
                <th className="px-6 py-3 font-medium border-b">Title</th>
                <th className="px-6 py-3 font-medium border-b">Department</th>
                <th className="px-6 py-3 font-medium border-b">Priority</th>
                <th className="px-6 py-3 font-medium border-b">Status</th>
                <th className="px-6 py-3 font-medium border-b">SLA Remaining</th>
                <th className="px-6 py-3 font-medium border-b">Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading tickets...</td></tr>
              ) : filteredTickets.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No tickets found for {activeTab}.</td></tr>
              ) : (
                filteredTickets.map((ticket: any) => (
                  <tr key={ticket.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-primary">{ticket.id}</td>
                    <td className="px-6 py-4 font-medium">{ticket.title}</td>
                    <td className="px-6 py-4">{ticket.department}</td>
                    <td className="px-6 py-4"><StatusBadge status={ticket.priority} /></td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                        ticket.status === 'resolved' ? 'bg-semantic-low/10 text-semantic-low border-semantic-low/20' :
                        ticket.status === 'in_progress' ? 'bg-semantic-moderate/10 text-semantic-moderate border-semantic-moderate/20' :
                        'bg-muted text-muted-foreground border-border'
                      }`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        ticket.slaRemaining === '0 hours' ? 'text-semantic-low' :
                        parseInt(ticket.slaRemaining) < 12 ? 'text-semantic-critical' : 'text-foreground'
                      }`}>
                        {ticket.slaRemaining}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{ticket.assignee}</td>
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
