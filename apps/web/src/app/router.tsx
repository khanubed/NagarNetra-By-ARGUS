import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Dashboard } from '../pages/Dashboard';
import { Alerts } from '../pages/Alerts';
import { Tickets } from '../pages/Tickets';
import { Heatmaps } from '../pages/Heatmaps';
import { BlackSpots } from '../pages/BlackSpots';
import { CityPulse } from '../pages/CityPulse';
import { RoadCrimes } from '../pages/RoadCrimes';
import { RoadCrimeDetail } from '../pages/RoadCrimeDetail';
import { RoadHealth } from '../pages/RoadHealth';
import { Traffic } from '../pages/Traffic';
import { Risk } from '../pages/Risk';
import { Departments } from '../pages/Departments';
import { Reports } from '../pages/Reports';
import { Users } from '../pages/Users';
import { EdgeSimulator } from '../pages/EdgeSimulator';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'alerts', element: <Alerts /> },
      { path: 'tickets', element: <Tickets /> },
      { path: 'heatmaps', element: <Heatmaps /> },
      { path: 'blackspots', element: <BlackSpots /> },
      { path: 'road-health', element: <RoadHealth /> },
      { path: 'traffic', element: <Traffic /> },
      { path: 'risk', element: <Risk /> },
      { path: 'departments', element: <Departments /> },
      { path: 'city-pulse', element: <CityPulse /> },
      { path: 'reports', element: <Reports /> },
      { path: 'users', element: <Users /> },
      { path: 'settings', element: <div className="p-4">Settings</div> },
      { path: 'audit', element: <div className="p-4">Audit Logs</div> },
      { path: 'edge-simulator', element: <EdgeSimulator /> },
      { path: 'road-crimes', element: <RoadCrimes /> },
      { path: 'road-crimes/:id', element: <RoadCrimeDetail /> },
    ]
  },
]);
