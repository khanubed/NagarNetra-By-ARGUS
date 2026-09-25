import { Link, useLocation } from 'react-router-dom';
import { Home, Map as MapIcon, Activity, AlertTriangle, ShieldCheck, FileSearch, Search, BarChart3, BellRing, Users, Eye } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/route-planner', label: 'Route Planner', icon: MapIcon },
  { path: '/road-health', label: 'Road Health', icon: Activity },
  { path: '/black-spots', label: 'Black Spots', icon: AlertTriangle },
  { path: '/transparency', label: 'Transparency', icon: BarChart3 },
  { path: '/verification', label: 'AI Verification', icon: ShieldCheck },
  { path: '/track', label: 'Track Issue', icon: Search },
  { path: '/ward-intelligence', label: 'Ward Intel', icon: FileSearch },
  { path: '/alerts', label: 'Alerts', icon: BellRing },
  { path: '/civic-hub', label: 'Civic Hub', icon: Users },
];

export const NavRail = () => {
  const location = useLocation();

  return (
    <nav className="w-20 lg:w-64 flex flex-col border-r bg-card h-screen overflow-y-auto shrink-0 transition-all duration-300">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b font-bold text-brand-primary dark:text-brand-accent tracking-wider">
        <Link to="/" className="flex items-center gap-2 text-brand-primary">
          <Eye size={24} className="text-brand-accent shrink-0" />
          <span className="hidden lg:inline text-lg font-bold tracking-tight">NAGARNETRA</span>
        </Link>
      </div>
      <div className="px-4 py-3 hidden lg:block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Public Portal
      </div>
      <div className="flex-1 py-2 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive 
                  ? "bg-brand-primary text-white shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={item.label}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden lg:inline text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
