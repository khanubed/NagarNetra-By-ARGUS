import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../app/store';
import { ShieldAlert, ChevronLeft, MapPin, Clock, Camera, FileCheck2, Fingerprint, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { MapShell } from '../components/map/MapShell';
import { CircleMarker } from 'react-leaflet';

export const RoadCrimeDetail = () => {
  const { id } = useParams();
  const role = useSelector((state: RootState) => state.auth.role);
  const isRestricted = role === 'Super Admin' || role === 'Traffic Police';

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
      <Link to="/road-crimes" className="text-primary hover:underline flex items-center gap-1 text-sm mb-[-1rem]">
        <ChevronLeft size={16} /> Back to Command Center
      </Link>
      
      <PageHeader
        title={`Case Evidence: ${id}`}
        breadcrumbs={[
          { label: 'Enforcement', path: '/road-crimes' },
          { label: 'Command Center', path: '/road-crimes' },
          { label: id || 'Detail' },
        ]}
        actions={
          <div className="flex gap-2">
            <button className="bg-muted text-foreground px-4 py-2 rounded-md text-sm font-medium border hover:bg-muted/80 flex gap-2 items-center">
              <FileCheck2 size={16} /> Generate Section 63 Cert
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex gap-2 items-center">
              Update Status
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Media & OCR */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
              <h3 className="font-semibold text-lg flex gap-2 items-center">
                <Camera size={18} className="text-muted-foreground" />
                Incident Keyframes
              </h3>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">3 Frames Available</span>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-black/90 rounded-lg relative overflow-hidden flex items-center justify-center border border-muted">
                {/* Simulated Bounding Box for ANPR */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute border-2 border-green-500 w-32 h-12 top-[52%] left-[77%] transform -translate-x-1/2 translate-y-8 flex items-end justify-center pb-1">
                    <span className="bg-green-500 text-black text-[10px] font-bold px-1 rounded-sm -mb-5 whitespace-nowrap">
                      Plate: 94%
                    </span>
                  </div>
                  <div className="absolute border-2 border-red-500 w-64 h-48 top-1/2 left-[70%] transform -translate-x-1/2 -translate-y-1/4">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1 rounded-sm absolute -top-4 left-[-2px]">
                      Vehicle (Trajectory Anomaly)
                    </span>
                  </div>
                </div>
                <img 
                  src="/images/anpr_evidence.jpg" 
                  alt="Traffic camera" 
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="aspect-video bg-muted rounded border border-primary ring-2 ring-primary/20 overflow-hidden relative">
                  <img src="/images/anpr_evidence.jpg" className="w-full h-full object-cover opacity-70" alt="Frame 1" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded font-mono">T-0.5s</span>
                </div>
                <div className="aspect-video bg-muted rounded border overflow-hidden relative">
                  <img src="/images/anpr_evidence.jpg" className="w-full h-full object-cover opacity-70" alt="Frame 2" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded font-mono">T+0.0s (Impact)</span>
                </div>
                <div className="aspect-video bg-muted rounded border overflow-hidden relative">
                  <img src="/images/anpr_evidence.jpg" className="w-full h-full object-cover opacity-70" alt="Frame 3" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded font-mono">T+1.5s (Departure)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border rounded-xl overflow-hidden shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4 flex gap-2 items-center">
              <Fingerprint size={18} className="text-muted-foreground" />
              ANPR Extraction Analysis
            </h3>
            <div className="flex items-center gap-8">
              <div className="bg-black text-white font-mono text-4xl p-4 border-4 border-gray-600 rounded-md tracking-widest shadow-inner">
                KA 51 AB 1234
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Format Validation</span>
                  <span className="text-semantic-good font-medium flex items-center gap-1"><ShieldCheck size={14}/> Valid (Indian Standard)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall OCR Confidence</span>
                  <span className="font-mono">94.2%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div className="bg-semantic-good h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Evidence Chain & Metadata */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border rounded-xl overflow-hidden shadow-sm p-5 flex flex-col gap-4">
            <h3 className="font-semibold border-b pb-2 flex items-center gap-2">
              <Lock size={16} className="text-semantic-good" /> Cryptographic Integrity
            </h3>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Packet Hash (SHA-256)</label>
              <div className="font-mono text-[10px] break-all bg-muted p-2 rounded border text-foreground/80">
                a7f9b8c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Edge Device Signature</label>
              <div className="font-mono text-[10px] break-all bg-muted p-2 rounded border text-foreground/80 text-semantic-good">
                SIG-VALID: device_pk_1004 (Verified at ingress)
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <label className="text-xs text-muted-foreground">Chain Status</label>
              <div className="flex items-center gap-2 text-sm font-medium text-semantic-good">
                <CheckCircle2 size={16} /> Immutable Hash Chain Verified
              </div>
            </div>
          </div>

          <div className="bg-surface border rounded-xl overflow-hidden shadow-sm p-5 flex flex-col gap-4">
            <h3 className="font-semibold border-b pb-2">Event Metadata</h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start">
                <Clock size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium">UTC Timestamp</div>
                  <div className="text-xs font-mono text-muted-foreground">2026-09-17T08:42:15.344Z</div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium">Location Data</div>
                  <div className="text-xs text-muted-foreground">Koramangala 80ft Road, Sector 3</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1 mb-3">12.9345° N, 77.6201° E</div>
                  <div className="h-32 w-full border rounded-md overflow-hidden relative z-0">
                    <MapShell center={[12.9345, 77.6201]} zoom={16} scrollWheelZoom={false} theme="auto">
                      <CircleMarker 
                        center={[12.9345, 77.6201]}
                        radius={6}
                        pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8, weight: 2 }}
                      />
                    </MapShell>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <AlertCircle size={16} className="text-restricted-accent mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium">Trigger Heuristic</div>
                  <div className="text-xs text-muted-foreground">Abrupt trajectory change followed by rapid acceleration</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">Estimated Speed: 65 km/h</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
