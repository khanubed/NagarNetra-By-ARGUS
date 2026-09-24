import { Outlet } from 'react-router-dom';
import { NavRail } from './NavRail';
import { CommandBar } from './CommandBar';

export const AppShell = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <NavRail />
      <div className="flex flex-col flex-1 overflow-hidden">
        <CommandBar />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
