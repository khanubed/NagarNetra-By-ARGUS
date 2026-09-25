import { Outlet } from "react-router-dom";
import { Menu, Shield, X, Bell, ExternalLink } from "lucide-react";
import { useState } from "react";
import { NavRail } from "./NavRail";

export const PublicAppShell = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <NavRail />
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        
        {/* Top Header / Mobile Menu Toggle */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b bg-background/95 backdrop-blur z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg font-semibold tracking-tight hidden sm:block">Public Transparency Portal</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://nagar-netra-authority.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 hidden sm:flex"
            >
              Authority Dashboard <ExternalLink size={14} />
            </a>
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full ring-2 ring-background"></span>
            </button>
            <button className="text-sm font-medium bg-brand-primary text-white px-4 py-2 rounded-full hover:bg-brand-primary/90 transition-colors shadow-sm hidden sm:block">
              Report Issue
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/20 relative">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-full flex flex-col">
            <Outlet />
            
            {/* Footer */}
            <footer className="mt-auto pt-12 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield size={14} /> NagarNetra City Intelligence Platform
                </div>
                <div>Built for civic transparency. Data updated in real-time.</div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};
