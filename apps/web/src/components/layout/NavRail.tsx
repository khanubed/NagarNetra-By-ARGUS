import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BellRing,
  Ticket,
  Map,
  AlertTriangle,
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  HeartPulse,
  FileText,
  ShieldCheck,
  Settings,
  List,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { useSelector } from "react-redux";
import { type RootState } from "../../app/store";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/alerts", label: "Alerts", icon: BellRing },
  { path: "/road-crimes", label: "Road Crimes", icon: ShieldAlert },
  { path: "/edge-simulator", label: "Edge Simulator", icon: Cpu },
  { path: "/tickets", label: "Tickets", icon: Ticket },
  { path: "/heatmaps", label: "Heatmaps", icon: Map },
  { path: "/blackspots", label: "Black Spots", icon: AlertTriangle },
  { path: "/road-health", label: "Road Health", icon: Activity },
  { path: "/traffic", label: "Traffic Analytics", icon: BarChart3 },
  { path: "/risk", label: "Risk Analytics", icon: TrendingUp },
  { path: "/departments", label: "Departments", icon: Users },
  { path: "/city-pulse", label: "City Pulse", icon: HeartPulse },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/users", label: "Users", icon: ShieldCheck },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/audit", label: "Audit Logs", icon: List },
];

export const NavRail = () => {
  const location = useLocation();
  const role = useSelector((state: RootState) => state.auth.role);

  const isRestricted = role === "Super Admin" || role === "Traffic Police";
  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (item.path.startsWith("/road-crimes") && !isRestricted) return false;
    return true;
  });

  return (
    <nav className="w-20 lg:w-64 flex flex-col border-r bg-card h-screen overflow-y-auto shrink-0 transition-all duration-300">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b font-bold text-brand-primary dark:text-brand-accent tracking-wider">
        <span className="hidden lg:inline text-lg">NAGARNETRA</span>
        <span className="lg:hidden text-lg">NN</span>
      </div>
      <div className="flex-1 py-4 flex flex-col gap-1 px-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive
                  ? "bg-brand-primary text-white dark:bg-brand-accent dark:text-brand-secondary shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              title={item.label}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden lg:inline text-sm font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
