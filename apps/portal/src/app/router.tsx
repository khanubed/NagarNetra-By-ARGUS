import { createBrowserRouter } from 'react-router-dom';
import { PublicAppShell } from '../components/layout/PublicAppShell';

// Pages to be created
// Pages to be created
import { RoadHealth } from '../pages/RoadHealth';
import { RoutePlanner } from '../pages/RoutePlanner';
import { BlackSpots } from '../pages/BlackSpots';
import { VerificationCenter } from '../pages/VerificationCenter';
import { IssueTracker } from '../pages/IssueTracker';
import { Transparency } from '../pages/Transparency';
import { WardIntelligence } from '../pages/WardIntelligence';
import { Alerts } from '../pages/Alerts';
import { CivicHub } from '../pages/CivicHub';
import { Home } from '../pages/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicAppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'route-planner', element: <RoutePlanner /> },
      { path: 'road-health', element: <RoadHealth /> },
      { path: 'black-spots', element: <BlackSpots /> },
      { path: 'verification', element: <VerificationCenter /> },
      { path: 'track', element: <IssueTracker /> },
      { path: 'track/:id', element: <IssueTracker /> },
      { path: 'transparency', element: <Transparency /> },
      { path: 'ward-intelligence', element: <WardIntelligence /> },
      { path: 'alerts', element: <Alerts /> },
      { path: 'civic-hub', element: <CivicHub /> },
    ]
  },
]);
