const BANGALORE_CENTER = { lat: 12.9716, lng: 77.5946 };

export const generateEvents = (count: number) => {
  const types = ['Pothole', 'Crack', 'Missing Signboard', 'Waterlogging', 'Broken Divider', 'Faded Zebra Crossing', 'Traffic Congestion', 'Accident'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const events = [];
  
  for (let i = 0; i < count; i++) {
    // Generate within a ~5km radius of center
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    const type = types[Math.floor(Math.random() * types.length)];
    let severity = severities[Math.floor(Math.random() * severities.length)];
    
    if (type === 'Pothole' && Math.random() > 0.5) severity = 'high';
    if (type === 'Accident') severity = 'critical';

    // Randomize time within last 24 hours
    const timeOffset = Math.random() * 86400000;
    const date = new Date(Date.now() - timeOffset);
    let timeStr = '';
    if (timeOffset < 3600000) timeStr = `${Math.floor(timeOffset / 60000)} mins ago`;
    else timeStr = `${Math.floor(timeOffset / 3600000)} hours ago`;

    events.push({
      id: `EV-${10000 + i}`,
      type,
      severity,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100
      lat: BANGALORE_CENTER.lat + latOffset,
      lng: BANGALORE_CENTER.lng + lngOffset,
      status: 'detected',
      time: timeStr,
      timestamp: date.getTime(),
    });
  }
  
  return events.sort((a, b) => b.timestamp - a.timestamp);
};

export const generateTickets = (count: number) => {
  const depts = ['PWD', 'Traffic Police', 'BBMP', 'BWSSB', 'BESCOM'];
  const statuses = ['pending', 'in_progress', 'resolved'];
  const priorities = ['low', 'medium', 'high', 'critical'];
  const tickets = [];
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const timeOffset = Math.random() * 86400000 * 7; // Last 7 days
    tickets.push({
      id: `TKT-${50000 + i}`,
      title: `Fix ${['Pothole', 'Signboard', 'Waterlogging', 'Streetlight'][Math.floor(Math.random() * 4)]} at Ward ${Math.floor(Math.random() * 198) + 1}`,
      department: depts[Math.floor(Math.random() * depts.length)],
      status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdAt: new Date(Date.now() - timeOffset).toISOString(),
      slaRemaining: status === 'resolved' ? '0 hours' : `${Math.floor(Math.random() * 48)} hours`,
      assignee: `Engineer ${Math.floor(Math.random() * 50) + 1}`,
      timestamp: Date.now() - timeOffset,
    });
  }
  return tickets.sort((a, b) => b.timestamp - a.timestamp);
};

export const generateBlackSpots = (count: number) => {
  const spots = [];
  for(let i=0; i<count; i++) {
    spots.push({
      id: `BS-${20000 + i}`,
      name: `Segment ${Math.floor(Math.random() * 50) + 1}, Ward ${Math.floor(Math.random() * 198) + 1}`,
      lat: BANGALORE_CENTER.lat + (Math.random() - 0.5) * 0.08,
      lng: BANGALORE_CENTER.lng + (Math.random() - 0.5) * 0.08,
      score: Math.floor(Math.random() * 30) + 70, // 70-100 Priority Score
      status: ['emerging', 'active', 'under_remediation'][Math.floor(Math.random() * 3)],
      factors: {
        defects: Math.floor(Math.random() * 20) + 5,
        incidents: Math.floor(Math.random() * 5),
        waterlogging: Math.random() > 0.5,
        schoolProximity: Math.random() > 0.7
      }
    });
  }
  return spots.sort((a,b) => b.score - a.score);
};

export const generateTimeSeries = (days: number) => {
  const data = [];
  let pulse = 80;
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    pulse = Math.min(100, Math.max(0, pulse + (Math.random() - 0.4) * 5));
    data.push({
      date,
      pulseScore: Math.round(pulse),
      incidents: Math.floor(Math.random() * 20),
      resolved: Math.floor(Math.random() * 15) + 5,
    });
  }
  return data;
};

export const MOCK_EVENTS = generateEvents(300);
export const MOCK_TICKETS = generateTickets(150);
export const MOCK_BLACK_SPOTS = generateBlackSpots(24);
export const MOCK_TIMESERIES = generateTimeSeries(30);

export const MOCK_STATS = {
  activeTickets: MOCK_TICKETS.filter(t => t.status !== 'resolved').length,
  criticalAlerts: MOCK_EVENTS.filter(e => e.severity === 'critical').length,
  blackSpots: MOCK_BLACK_SPOTS.length,
  cityPulseScore: 78,
  ticketsTrend: 5,
  alertsTrend: -12,
  pulseTrend: 2,
};
