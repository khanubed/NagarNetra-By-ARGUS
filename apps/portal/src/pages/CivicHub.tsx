import { Smartphone, Award, Star, Download, QrCode, Trophy, CheckSquare, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const MOCK_CAMPAIGNS = [
  {
    id: 'C-101',
    title: 'Prioritize Next Quarter Road Repairs',
    type: 'Voting',
    ward: 'HSR Layout (174)',
    deadline: '2 Days Left',
    participants: 1245,
    icon: CheckSquare,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'C-102',
    title: 'Feedback: New Smart Traffic Lights',
    type: 'Feedback',
    ward: 'Indiranagar (89)',
    deadline: '5 Days Left',
    participants: 832,
    icon: MessageSquare,
    color: 'text-green-600',
    bg: 'bg-green-50',
    borderColor: 'border-green-200'
  }
];

export const CivicHub = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-brand-primary mb-4">Civic Participation Hub</h1>
        <p className="text-lg text-muted-foreground font-medium">
          NagarNetra is powered by AI, but guided by citizens. Join thousands of Bengalureans reporting hazards, verifying AI detections, and voting on neighborhood priorities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-gradient-to-br from-brand-primary/5 to-brand-primary/10 rounded-lg p-8 lg:p-12 border border-brand-primary/20">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-primary text-white px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-6">
            <Smartphone size={14} /> Official Citizen App
          </div>
          <h2 className="text-3xl font-bold text-brand-secondary mb-4 leading-tight">
            Report hazards in 3 taps. <br/>Track resolution in real-time.
          </h2>
          <p className="text-muted-foreground mb-8 font-medium leading-relaxed">
            Download the NagarNetra mobile app to instantly snap photos of road defects. Your reports bypass bureaucracy and go directly into the AI prioritization queue for immediate departmental assignment.
          </p>
          
          <div className="flex gap-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors shadow-sm">
              <Download size={24} />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider font-semibold">Download on the</div>
                <div className="text-lg font-bold leading-none">App Store</div>
              </div>
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors shadow-sm">
              <Download size={24} />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider font-semibold">Get it on</div>
                <div className="text-lg font-bold leading-none">Google Play</div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center max-w-sm">
            <div className="w-48 h-48 bg-gray-50 rounded-lg border mb-6 flex items-center justify-center">
              <QrCode size={120} className="text-gray-300" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Scan to Download</h3>
            <p className="text-sm text-muted-foreground">Scan this QR code with your phone camera to download the NagarNetra Citizen app instantly.</p>
          </div>
        </div>
      </div>

      {/* Active Civic Campaigns (Voting & Feedback) */}
      <div className="mt-16">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-brand-secondary">Active Civic Campaigns</h2>
            <p className="text-muted-foreground mt-1">Vote on budget priorities and provide feedback for your ward.</p>
          </div>
          <button className="text-sm font-semibold text-brand-primary hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_CAMPAIGNS.map(campaign => {
            const Icon = campaign.icon;
            return (
              <div key={campaign.id} className="bg-card border rounded-lg p-6 shadow-sm flex flex-col group hover:border-brand-primary/40 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-lg border", campaign.bg, campaign.color, campaign.borderColor)}>
                    <Icon size={24} />
                  </div>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider border", campaign.bg, campaign.color, campaign.borderColor)}>
                    {campaign.type}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors">
                  {campaign.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 font-medium">
                  <span>{campaign.ward}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-amber-600">{campaign.deadline}</span>
                </div>
                <div className="mt-auto flex justify-between items-center border-t pt-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    <span className="font-semibold text-foreground">{campaign.participants.toLocaleString()}</span> participants
                  </div>
                  <button className="bg-brand-primary text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-brand-primary/90 transition-colors shadow-sm">
                    Participate
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-16 border-t pt-12">
        <h2 className="text-2xl font-semibold text-center mb-8 text-brand-secondary">Earn Civic Trust Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 border border-blue-100">
              <Star size={32} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Report Accurately</h3>
            <p className="text-sm text-muted-foreground">Gain points when your reported hazards are verified by other citizens or the AI.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="mx-auto w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center mb-4 border border-brand-primary/20">
              <Award size={32} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Verify Edge-Cases</h3>
            <p className="text-sm text-muted-foreground mb-4">Earn trust by reviewing AI detections.</p>
            <Link to="/verification" className="text-sm font-semibold text-brand-primary hover:underline">
              Go to Verification Center →
            </Link>
          </div>

          <div className="bg-card border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4 border border-amber-100">
              <Trophy size={32} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Unlock Achievements</h3>
            <p className="text-sm text-muted-foreground">Become a "Top Contributor" in your ward and receive official certificates from the BBMP.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
