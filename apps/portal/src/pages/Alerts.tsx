import { useState } from 'react';
import { AlertTriangle, MapPin, Clock, Droplets, Construction, CloudRain, Smartphone, Mail, Bell, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_ALERTS = [
  { 
    id: 1, 
    type: 'Waterlogging', 
    severity: 'High', 
    location: 'Silk Board Junction', 
    time: 'Updated 10 mins ago',
    desc: 'Severe water accumulation detected by Bus #KA-57-F-1234. Avoid underpass.',
    icon: Droplets,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  { 
    id: 2, 
    type: 'Road Collapse', 
    severity: 'Critical', 
    location: 'Indiranagar 100ft Road', 
    time: 'Updated 25 mins ago',
    desc: 'Major sinkhole detected. Traffic diverted through 80ft road.',
    icon: AlertTriangle,
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  { 
    id: 3, 
    type: 'Active Repair', 
    severity: 'Moderate', 
    location: 'Koramangala 4th Block', 
    time: 'Updated 2 hours ago',
    desc: 'BBMP currently filling pothole cluster. Expect slight delays.',
    icon: Construction,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  }
];

export const Alerts = () => {
  const [subPhone, setSubPhone] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subPhone || subEmail) {
      setSubSuccess(true);
      setTimeout(() => setSubSuccess(false), 3000);
      setSubPhone('');
      setSubEmail('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Public Alert Center</h1>
          <p className="text-muted-foreground mt-2 max-w-xl font-medium">
            Real-time hazard warnings and active detours generated automatically by NagarNetra AI. Subscribe to receive instant alerts for your ward.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm border border-blue-200 shadow-sm">
          <CloudRain size={18} /> Monsoon Advisory Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Alerts Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-brand-secondary mb-4">Live Hazard Feed</h2>
          {MOCK_ALERTS.map(alert => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className={cn("flex gap-4 p-6 rounded-lg border shadow-sm transition-colors", alert.bg, alert.border)}>
                <div className={cn("p-4 bg-white rounded-md h-fit shadow-sm border", alert.border, alert.color)}>
                  <Icon size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={cn("text-lg font-semibold", alert.color)}>{alert.type}</h3>
                    <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-white shadow-sm border", alert.border, alert.color)}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-700 mb-3">
                    <span className="flex items-center gap-1.5"><MapPin size={16} /> {alert.location}</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} /> {alert.time}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 leading-relaxed mb-4">{alert.desc}</p>
                  
                  <div className="flex gap-3">
                    <button className="text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md shadow-sm hover:bg-gray-50 transition-colors">
                      View on Map
                    </button>
                    <button className="text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md shadow-sm hover:bg-gray-50 transition-colors">
                      Share Alert
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Subscription Panel */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold text-brand-secondary mb-2">Subscribe to Alerts</h2>
            <p className="text-sm text-muted-foreground mb-6 font-medium">
              Get notified immediately when severe hazards are detected in your area.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-4">
              
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Select Channels
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <label className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <span className="text-sm font-semibold flex items-center gap-1.5"><MessageCircle size={14} className="text-green-600"/> WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <span className="text-sm font-semibold flex items-center gap-1.5"><Smartphone size={14} className="text-blue-600"/> SMS</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <span className="text-sm font-semibold flex items-center gap-1.5"><Mail size={14} className="text-brand-primary"/> Email</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <span className="text-sm font-semibold flex items-center gap-1.5"><Bell size={14} className="text-amber-500"/> Push</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Mobile Number
                </label>
                <input 
                  type="tel" 
                  value={subPhone}
                  onChange={(e) => setSubPhone(e.target.value)}
                  placeholder="+91 98765 43210" 
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="citizen@bengaluru.in" 
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                />
              </div>

              <div className="pt-2">
                {subSuccess ? (
                  <div className="bg-green-50 text-green-700 p-3 rounded-md border border-green-200 text-sm font-semibold text-center">
                    Subscribed successfully!
                  </div>
                ) : (
                  <button type="submit" className="w-full bg-brand-primary text-white font-semibold py-2.5 rounded-md hover:bg-brand-primary/90 transition-colors shadow-sm">
                    Activate Alerts
                  </button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground text-center font-medium mt-3">
                You will only receive critical alerts for your detected location. You can opt out anytime.
              </p>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};
