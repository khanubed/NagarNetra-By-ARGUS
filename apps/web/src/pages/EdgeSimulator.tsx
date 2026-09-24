import { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { Activity, Cpu, WifiOff, Camera, Database, Lock, MapPin, Gauge } from 'lucide-react';

import crossingImg from '../assets/MOCK-IMAGES/crossing.jpeg';
import dividerImg from '../assets/MOCK-IMAGES/divider.jpeg';
import potholeImg from '../assets/MOCK-IMAGES/pothole.jpeg';
import waterloggingImg from '../assets/MOCK-IMAGES/waterlogging.jpeg';
import incidentImg from '../assets/MOCK-IMAGES/incident.png';

const MOCK_FRAMES = [
  { img: potholeImg, label: 'Pothole Detected', conf: '94.2%', latency: '42ms', lat: '12.9345', lng: '77.6201', speed: 32 },
  { img: waterloggingImg, label: 'Waterlogging', conf: '88.1%', latency: '45ms', lat: '12.9360', lng: '77.6215', speed: 28 },
  { img: dividerImg, label: 'Broken Divider', conf: '91.5%', latency: '44ms', lat: '12.9382', lng: '77.6220', speed: 45 },
  { img: crossingImg, label: 'Faded Crossing', conf: '86.4%', latency: '43ms', lat: '12.9410', lng: '77.6240', speed: 15 },
  { img: incidentImg, label: 'Rash Driving', conf: '97.8%', latency: '48ms', lat: '12.9455', lng: '77.6255', speed: 65 },
];

const BUSES = [
  { id: 'BMTC-KA51-F234', route: '500-D', type: 'Volvo AC' },
  { id: 'BMTC-KA01-F112', route: '335-E', type: 'Non-AC' },
  { id: 'BMTC-KA57-F998', route: 'K-2', type: 'Mini' },
];

export const EdgeSimulator = () => {
  const [activeBus, setActiveBus] = useState(BUSES[0]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);

  // Simulate video feed
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => {
        const next = (prev + 1) % MOCK_FRAMES.length;
        
        // Add to log
        const frame = MOCK_FRAMES[next];
        const newLog = {
          id: Math.random().toString(36).substring(7),
          time: new Date().toISOString().split('T')[1].substring(0, 8),
          ...frame
        };
        setLogs(current => [newLog, ...current].slice(0, 15));
        
        return next;
      });
    }, 3000); // Change frame every 3 seconds for demo purposes
    return () => clearInterval(interval);
  }, []);

  const currentFrame = MOCK_FRAMES[frameIndex];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Edge AI Hardware Simulator" 
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'Hardware Telemetry' }]}
        actions={
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Active Vehicle:</div>
            <select 
              className="bg-background border rounded-md px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary outline-none"
              value={activeBus.id}
              onChange={(e) => setActiveBus(BUSES.find(b => b.id === e.target.value) || BUSES[0])}
            >
              {BUSES.map(bus => (
                <option key={bus.id} value={bus.id}>{bus.id} (Route {bus.route})</option>
              ))}
            </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Bandwidth Savings" value="99.9%" trend="18KB vs 12MB" trendLabel="per event" icon={<WifiOff size={20} />} severity="good" />
        <KpiCard title="Inference Speed" value="~45" unit="ms" trend="YOLO-v11n" trendLabel="TensorRT optimized" icon={<Cpu size={20} />} severity="good" />
        <KpiCard title="Total Fleet Saved" value="8,420" unit="GB" trend="+142 GB" trendLabel="today" icon={<Database size={20} />} />
        <KpiCard title="Camera FPS" value="30" unit="fps" trend="Sony IMX390" trendLabel="HDR Sensor" icon={<Camera size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Camera HUD */}
        <div className="lg:col-span-2 bg-black border rounded-xl overflow-hidden shadow-sm relative flex flex-col aspect-video">
          
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>

          {/* Top HUD */}
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start text-white/90 font-mono text-xs drop-shadow-md bg-gradient-to-b from-black/70 to-transparent">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> REC
              </div>
              <div>{activeBus.id} // {activeBus.type}</div>
            </div>
            <div className="flex gap-6 text-right">
              <div className="flex items-center gap-1"><Gauge size={14}/> {currentFrame.speed} KM/H</div>
              <div>{new Date().toISOString().split('T')[1].substring(0, 8)} UTC</div>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 relative">
            <img 
              src={currentFrame.img} 
              alt="Live feed" 
              className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
            />
            {/* Target Box Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-48 border-2 border-primary/70 bg-primary/10">
              <div className="absolute -top-6 left-0 bg-primary text-white text-[10px] font-bold px-2 py-0.5">
                {currentFrame.label} ({currentFrame.conf})
              </div>
            </div>
          </div>

          {/* Bottom HUD */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex justify-between items-end text-white/90 font-mono text-xs drop-shadow-md bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1"><MapPin size={14}/> GPS: {currentFrame.lat} N, {currentFrame.lng} E</div>
              <div className="text-white/60">Heading: 142° SE // Outer Ring Road</div>
            </div>
            <div className="flex flex-col items-end gap-1 text-semantic-good font-bold">
              <div className="flex items-center gap-1"><Lock size={12}/> BEL TPM: ACTIVE</div>
              <div className="text-white/60 font-normal">Sig: Valid // Packet: 18KB</div>
            </div>
          </div>

        </div>

        {/* Telemetry Log */}
        <div className="relative h-[400px] lg:h-auto">
          <div className="lg:absolute lg:inset-0 bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
            <div className="p-4 border-b bg-muted/20 flex items-center justify-between shrink-0">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              Live Detection Stream
            </h3>
            <div className="w-2 h-2 rounded-full bg-semantic-good animate-pulse"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-[#0a0a0a] text-green-400 font-mono text-[11px]">
            {logs.length === 0 ? (
              <div className="text-muted-foreground text-center mt-10">Awaiting telemetry...</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="mb-3 border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 p-1 rounded transition-colors">
                  <div className="flex justify-between text-white/50 mb-1">
                    <span>[{log.time}]</span>
                    <span>{log.latency}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-green-300">DETECT: {log.label}</span>
                    <span className="text-yellow-400">{log.conf}</span>
                  </div>
                  <div className="text-white/40 mt-1 flex justify-between">
                    <span>{log.lat},{log.lng}</span>
                    <span>{log.speed}km/h</span>
                  </div>
                  <div className="text-blue-400/70 mt-1">→ PKT_SIZE: 18.2KB | SIGNED: YES</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    </div>  
  );
};
