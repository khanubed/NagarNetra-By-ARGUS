import { useState } from 'react';
import { ShieldCheck, XCircle, CheckCircle2, UserCheck, Bot } from 'lucide-react';

import potholeImg from '../assets/MOCK-IMAGES/pothole.jpeg';
import waterloggingImg from '../assets/MOCK-IMAGES/waterlogging.jpeg';
import dividerImg from '../assets/MOCK-IMAGES/divider.jpeg';

const MOCK_VERIFICATIONS = [
  { id: 'V-1001', type: 'Pothole', location: '100ft Road, Indiranagar', image: potholeImg, aiConfidence: 85, status: 'pending' },
  { id: 'V-1002', type: 'Waterlogging', location: 'Silk Board Junction', image: waterloggingImg, aiConfidence: 72, status: 'pending' },
  { id: 'V-1003', type: 'Broken Divider', location: 'Outer Ring Road', image: dividerImg, aiConfidence: 60, status: 'pending' },
];

export const VerificationCenter = () => {
  const [tasks, setTasks] = useState(MOCK_VERIFICATIONS);
  const [completed, setCompleted] = useState(0);

  const handleVerify = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setCompleted(prev => prev + 1);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-primary">AI Verification Center</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Help train NagarNetra AI and improve your city. Review edge-case detections to boost the system's confidence score before a work order is generated.
          </p>
        </div>
        <div className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-lg border border-brand-primary/20 text-center shadow-sm">
          <div className="text-2xl font-black">{completed}</div>
          <div className="text-xs font-semibold uppercase tracking-wider">Verified Today</div>
        </div>
      </div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task.id} className="bg-card border rounded-lg overflow-hidden shadow-sm flex flex-col group">
              <div className="relative h-48 bg-muted overflow-hidden">
                <img 
                  src={task.image} 
                  alt={task.type} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-semibold uppercase flex items-center gap-1 shadow-sm">
                  <Bot size={14} className="text-blue-400" />
                  AI Detection
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-brand-secondary">{task.type}</h3>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground font-medium">{task.id}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 flex items-center gap-1 font-medium">
                  {task.location}
                </p>

                {/* Confidence Composition Visual */}
                <div className="mb-6 bg-accent/50 p-3 rounded-lg border border-border shadow-sm">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Confidence Composition</div>
                  
                  {/* Segmented Bar */}
                  <div className="flex h-2 w-full gap-0.5 rounded-sm overflow-hidden mb-2">
                    <div className="bg-blue-500 transition-all" style={{ width: `${task.aiConfidence}%` }} title="AI Confidence"></div>
                    <div className="bg-brand-primary/20 flex-1 animate-pulse" title="Citizen Verification (Pending)"></div>
                    <div className="bg-gray-200 w-1/5" title="Engineer Verification"></div>
                  </div>
                  
                  {/* Status Markers */}
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground mt-1">
                    <span className="text-blue-600 flex items-center gap-1"><Bot size={10} /> AI ({task.aiConfidence}%)</span>
                    <span className="text-brand-primary flex items-center gap-1"><UserCheck size={10} /> Citizen (?)</span>
                    <span className="text-gray-400 flex items-center gap-1"><ShieldCheck size={10} /> Engineer</span>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleVerify(task.id)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm transition-colors shadow-sm"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                  <button 
                    onClick={() => handleVerify(task.id)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 font-semibold text-sm transition-colors shadow-sm"
                  >
                    <CheckCircle2 size={18} /> Verify
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-12 text-center flex flex-col items-center shadow-sm">
          <ShieldCheck size={64} className="text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">All Caught Up!</h2>
          <p className="text-green-800/80 font-medium max-w-md">
            Thank you for keeping Bengaluru safe! There are no pending AI detections near your location that require human verification at this time.
          </p>
        </div>
      )}
    </div>
  );
};
