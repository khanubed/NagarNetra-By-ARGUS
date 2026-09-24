import { ArrowRight, Cpu, Network, ShieldCheck, Smartphone, Eye, Server, Zap, Database, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-16 pb-16 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-secondary text-white p-12 md:p-24 shadow-2xl flex flex-col items-center text-center border border-brand-primary/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-8 text-brand-accent shadow-sm">
            <Eye size={16} /> Welcome to the Future of Urban Governance
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            NagarNetra <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-400">City Intelligence Platform</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Transforming existing public transit into a continuous, real-time civic sensing network using advanced Edge AI and spatial intelligence.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dashboard" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold py-4 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105 text-lg">
              Open Authority Dashboard <ArrowRight size={20} />
            </Link>
            <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 px-8 rounded-lg transition-all flex items-center gap-2 text-lg">
              View Public Portal <Globe size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* The Core Problem & Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 md:px-12">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-brand-secondary tracking-tight">The Vision & Architecture</h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
            Traditional civic monitoring relies on expensive, manual ground surveys or static cameras. NagarNetra leverages the existing BMTC bus fleet as dynamic rovers. By installing lightweight Edge AI hardware on buses, we achieve 90% spatial coverage of the city multiple times a day with zero new dedicated vehicles.
          </p>
          <ul className="space-y-4 text-muted-foreground font-medium">
            <li className="flex items-start gap-3">
              <div className="p-1.5 bg-brand-primary/10 rounded-md text-brand-primary mt-0.5"><Zap size={16} /></div>
              <span><strong>99.9% Bandwidth Reduction:</strong> Edge inferencing compresses 12MB of raw video into 18KB of JSON metadata before transmission.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-1.5 bg-brand-primary/10 rounded-md text-brand-primary mt-0.5"><Database size={16} /></div>
              <span><strong>Spatial Deduplication:</strong> Advanced algorithms cluster multiple detections of the same pothole from different buses into a single, high-confidence ticket.</span>
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col items-center text-center hover:border-brand-primary/50 transition-colors">
            <Cpu size={40} className="text-brand-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Edge Hardware</h3>
            <p className="text-sm text-muted-foreground">NVIDIA Jetson Orin Nano + IMX219 Cameras running YOLOv8 optimizations via TensorRT.</p>
          </div>
          <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col items-center text-center hover:border-brand-primary/50 transition-colors">
            <Server size={40} className="text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Central Node</h3>
            <p className="text-sm text-muted-foreground">PostgreSQL/PostGIS, Redis, BullMQ, and MQTT broker for massive ingestion.</p>
          </div>
          <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col items-center text-center hover:border-brand-primary/50 transition-colors">
            <Network size={40} className="text-emerald-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">AI Cloud Pipeline</h3>
            <p className="text-sm text-muted-foreground">Zero-shot VLMs automatically verify ambiguous edge-cases detected by the fleet.</p>
          </div>
          <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col items-center text-center hover:border-brand-primary/50 transition-colors">
            <Smartphone size={40} className="text-amber-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Citizen Grid</h3>
            <p className="text-sm text-muted-foreground">Mobile apps for field engineers and citizens to gamify reporting and validation.</p>
          </div>
        </div>
      </div>

      {/* The 4 Modules */}
      <div className="bg-muted/30 rounded-2xl p-8 md:p-12 border">
        <h2 className="text-3xl font-bold text-center mb-12 text-brand-secondary tracking-tight">One Platform. Four Core Applications.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Authority Dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">Command center for BBMP/Traffic Police. Deep analytics, spatial mapping, heatmaps, and restricted road crime viewing.</p>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">You are here</span>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <Globe size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Public Portal</h3>
            <p className="text-sm text-muted-foreground mb-4">Radically transparent civic site tracking SLAs, road health maps, route planning, and ward intelligence.</p>
            <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-emerald-600 hover:underline">Launch Portal →</a>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
              <Smartphone size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Citizen App</h3>
            <p className="text-sm text-muted-foreground mb-4">React Native mobile app for reporting hazards, earning trust points, and acting as human-in-the-loop verifiers.</p>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded-md">In Development</span>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Zap size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Field Officer App</h3>
            <p className="text-sm text-muted-foreground mb-4">Specialized mobile client for on-ground contractors to view assigned tickets, navigate to spots, and upload resolution proof.</p>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded-md">In Development</span>
          </div>

        </div>
      </div>

    </div>
  );
};
