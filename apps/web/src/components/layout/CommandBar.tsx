import { Bell, Search, UserCircle, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../../app/store';
import { setRole, type Role } from '../../features/authSlice';

export const CommandBar = () => {
  const [isDark, setIsDark] = useState(false);
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 shrink-0 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets, black spots, or locations (Press '/') "
            className="w-full bg-accent/50 border-none rounded-md h-9 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="relative p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-semantic-critical rounded-full border border-background"></span>
        </button>
        <div className="flex items-center gap-4 pl-4 border-l">
          <select 
            value={role} 
            onChange={(e) => dispatch(setRole(e.target.value as Role))}
            className="bg-transparent text-sm font-medium border rounded p-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Traffic Police">Traffic Police</option>
            <option value="Municipal Officer">Municipal Officer</option>
            <option value="Citizen">Citizen</option>
            <option value="Public">Public</option>
          </select>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">Simulated User</p>
            <p className="text-xs text-muted-foreground mt-1">{role}</p>
          </div>
          <UserCircle size={32} className="text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};
