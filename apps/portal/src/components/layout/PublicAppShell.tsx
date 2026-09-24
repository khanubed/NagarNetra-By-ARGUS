import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, Eye, Shield, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/route-planner', label: 'Route Planner' },
  { path: '/road-health', label: 'Road Health Map' },
  { path: '/black-spots', label: 'Black Spots' },
  { path: '/transparency', label: 'Transparency' },
  { path: '/verification', label: 'AI Verification' },
  { path: '/track', label: 'Track Issue' },
  { path: '/ward-intelligence', label: 'Ward Intel' },
  { path: '/alerts', label: 'Alerts' },
  { path: '/civic-hub', label: 'Civic Hub' },
];

export const PublicAppShell = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-brand-primary font-bold text-xl tracking-tight">
              <Eye size={24} className="text-brand-accent" />
              NAGARNETRA <span className="font-light opacity-70 hidden sm:inline">| Public Portal</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-brand-primary ${
                  location.pathname === link.path ? 'text-brand-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-border mx-2"></div>
            <button className="text-sm font-medium bg-brand-primary text-white px-4 py-2 rounded-full hover:bg-brand-primary/90 transition-colors shadow-sm">
              Report Issue
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg py-4 px-4 flex flex-col gap-4 z-40">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 border-b border-border/50 ${
                  location.pathname === link.path ? 'text-brand-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button className="mt-2 text-base font-medium bg-brand-primary text-white px-4 py-3 rounded-md w-full text-center">
              Report Issue
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t py-8 bg-muted/20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield size={16} /> NagarNetra City Intelligence Platform
          </div>
          <div>
            Built for civic transparency. Data updated in real-time.
          </div>
        </div>
      </footer>
    </div>
  );
};
