import { PageHeader } from '../components/layout/PageHeader';
import { UserPlus, Search, MoreVertical, Shield } from 'lucide-react';

const fakeUsers = [
  { id: 'U-001', name: 'Praveen Kumar', email: 'praveen.k@nagarnetra.gov', role: 'Super Admin', jurisdiction: 'Citywide', status: 'Active', lastActive: '2 mins ago' },
  { id: 'U-002', name: 'Dr. Ramesh R', email: 'ramesh.r@bbmp.gov', role: 'Commissioner', jurisdiction: 'Citywide', status: 'Active', lastActive: '1 hr ago' },
  { id: 'U-003', name: 'Sujatha N', email: 'sujatha.n@pwd.gov', role: 'PWD Officer', jurisdiction: 'South Zone', status: 'Active', lastActive: '3 hrs ago' },
  { id: 'U-004', name: 'Insp. Vikram Singh', email: 'vikram.s@traffic.gov', role: 'Traffic Police', jurisdiction: 'Koramangala (W150)', status: 'Active', lastActive: '10 mins ago' },
  { id: 'U-005', name: 'Anil Desai', email: 'anil.d@bwssb.gov', role: 'Drainage Officer', jurisdiction: 'East Zone', status: 'Active', lastActive: '1 day ago' },
  { id: 'U-006', name: 'Mahesh B', email: 'mahesh.b@contractor.in', role: 'Field Engineer', jurisdiction: 'HSR Layout (W174)', status: 'Suspended', lastActive: '2 weeks ago' },
];

const getRoleBadgeClass = (role: string) => {
  if (role === 'Super Admin') return 'bg-red-500/10 text-red-500 border-red-500/20';
  if (role === 'Traffic Police') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  if (role === 'Commissioner') return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
  return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
};

export const Users = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="User Administration" 
        breadcrumbs={[{ label: 'Administration' }, { label: 'Users' }]}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex gap-2 items-center">
            <UserPlus size={16} /> Add User
          </button>
        }
      />

      <div className="bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-lg">Platform Users</h3>
            <span className="text-xs font-mono bg-background px-2 py-1 rounded border">{fakeUsers.length} total</span>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              className="w-full bg-background border rounded-md h-9 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">User Details</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Jurisdiction Scope</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Active</th>
                <th className="px-6 py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {fakeUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground border">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border flex items-center gap-1.5 w-max ${getRoleBadgeClass(user.role)}`}>
                      {(user.role === 'Super Admin' || user.role === 'Traffic Police') && <Shield size={10} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.jurisdiction}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-semantic-good' : 'bg-semantic-critical'}`}></div>
                      <span className={user.status === 'Active' ? 'text-foreground' : 'text-muted-foreground'}>{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{user.lastActive}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted">
                      <MoreVertical size={16} />
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
