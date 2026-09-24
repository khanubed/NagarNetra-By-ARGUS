import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../app/store';
import { ShieldAlert, AlertCircle, FileText, CheckCircle2, ChevronRight, Hash } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';

export const RoadCrimes = () => {
  const role = useSelector((state: RootState) => state.auth.role);
  const isRestricted = role === 'Super Admin' || role === 'Traffic Police';

  // Mock cases
  const [cases] = useState([
    {
      id: 'RC-2026-0917-0042',
      type: 'Hit and Run',
      timestamp: new Date().toISOString(),
      location: 'Koramangala 80ft Road, Sector 3',
      vehicleType: 'Car',
      plate: 'KA 51 AB 1234',
      confidence: 94,
      status: 'NEW',
      officer: null,
      hash: 'a7f9b8c2',
    },
    {
      id: 'RC-2026-0917-0038',
      type: 'Rash Driving',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      location: 'Indiranagar 100ft Road',
      vehicleType: 'Two Wheeler',
      plate: 'KA 03 XY 9876',
      confidence: 88,
      status: 'UNDER_REVIEW',
      officer: 'Insp. Ramesh',
      hash: 'b3e21d5c',
    },
    {
      id: 'RC-2026-0916-0105',
      type: 'Hit and Run',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      location: 'Silk Board Junction',
      vehicleType: 'Truck',
      plate: 'MH 12 CD 5678',
      confidence: 98,
      status: 'SUSPECT_TRACED',
      officer: 'Insp. Suresh',
      hash: 'f9a8b7c6',
    }
  ]);

  if (!isRestricted) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <ShieldAlert size={64} className="text-semantic-critical/50" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground text-center max-w-md">
          This area contains restricted law-enforcement evidence. You do not have the required permissions to view this content.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Road Crime Command Center"
        breadcrumbs={[
          { label: 'Enforcement', path: '/road-crimes' },
          { label: 'Command Center' },
        ]}
        actions={
          <div className="flex gap-2">
            <button className="bg-muted text-foreground px-4 py-2 rounded-md text-sm font-medium border hover:bg-muted/80">
              Export Evidence Log
            </button>
            <button className="bg-restricted-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-restricted-accent/90 flex gap-2 items-center">
              <ShieldAlert size={16} /> Live Surveillance Mode
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border rounded-xl p-4 flex flex-col gap-2">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle size={16} className="text-restricted-accent" /> Active Cases
          </span>
          <span className="text-3xl font-bold">14</span>
        </div>
        <div className="bg-surface border rounded-xl p-4 flex flex-col gap-2">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle2 size={16} className="text-semantic-good" /> Suspects Traced
          </span>
          <span className="text-3xl font-bold">8</span>
        </div>
        <div className="bg-surface border rounded-xl p-4 flex flex-col gap-2">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Hash size={16} className="text-muted-foreground" /> Verified Packets
          </span>
          <span className="text-3xl font-bold">42</span>
        </div>
        <div className="bg-surface border rounded-xl p-4 flex flex-col gap-2">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <FileText size={16} className="text-muted-foreground" /> FIRs Filed
          </span>
          <span className="text-3xl font-bold">5</span>
        </div>
      </div>

      <div className="bg-surface border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg">Recent Hit-and-Run / ANPR Events</h3>
          <input 
            type="text" 
            placeholder="Search Plate or ID..." 
            className="border rounded-md px-3 py-1 text-sm bg-transparent focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Case ID</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Plate OCR</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-restricted-accent/10 text-restricted-accent rounded font-medium text-xs">
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(c.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3">{c.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono bg-muted px-2 py-0.5 rounded border border-muted-foreground/30 inline-block font-bold">
                        {c.plate}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Conf: {c.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-muted rounded font-medium text-xs">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/road-crimes/${c.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
                      View Evidence <ChevronRight size={14} />
                    </Link>
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
