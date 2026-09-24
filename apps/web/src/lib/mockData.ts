export const MOCK_STATS = {
  activeTickets: 342,
  criticalAlerts: 18,
  blackSpots: 12,
  cityPulseScore: 78,
  ticketsTrend: 5,
  alertsTrend: -12,
  pulseTrend: 2,
};

export const MOCK_EVENTS = [
  { id: 'EV-1001', type: 'Pothole', severity: 'critical', confidence: 92, lat: 12.9716, lng: 77.5946, status: 'detected', time: '10 mins ago' },
  { id: 'EV-1002', type: 'Missing Signboard', severity: 'medium', confidence: 85, lat: 12.9750, lng: 77.5900, status: 'verified', time: '1 hour ago' },
  { id: 'EV-1003', type: 'Waterlogging', severity: 'high', confidence: 88, lat: 12.9600, lng: 77.5800, status: 'detected', time: '5 mins ago' },
];

export const MOCK_TICKETS = [
  { id: 'TKT-5001', type: 'Pothole Repair', department: 'PWD', status: 'pending', priority: 'high', slaRemaining: '4 hours' },
  { id: 'TKT-5002', type: 'Signboard Replacement', department: 'Traffic Police', status: 'in_progress', priority: 'medium', slaRemaining: '12 hours' },
  { id: 'TKT-5003', type: 'Waterlogging Clearance', department: 'BBMP', status: 'resolved', priority: 'critical', slaRemaining: '0 hours' },
];
