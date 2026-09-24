import { cn } from '@ui/lib/utils';
import { AlertCircle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'critical' | 'high' | 'medium' | 'low' | 'resolved' | 'pending' | 'good' | 'moderate' | 'poor';
  label?: string;
  className?: string;
}

const statusConfig = {
  critical: { color: 'bg-semantic-critical/10 text-semantic-critical border-semantic-critical/20', icon: AlertCircle },
  high: { color: 'bg-semantic-high/10 text-semantic-high border-semantic-high/20', icon: AlertTriangle },
  medium: { color: 'bg-semantic-medium/10 text-semantic-medium border-semantic-medium/20', icon: Clock },
  low: { color: 'bg-semantic-low/10 text-semantic-low border-semantic-low/20', icon: CheckCircle2 },
  good: { color: 'bg-semantic-low/10 text-semantic-low border-semantic-low/20', icon: CheckCircle2 },
  moderate: { color: 'bg-semantic-medium/10 text-semantic-medium border-semantic-medium/20', icon: Clock },
  poor: { color: 'bg-semantic-high/10 text-semantic-high border-semantic-high/20', icon: AlertTriangle },
  resolved: { color: 'bg-semantic-low/10 text-semantic-low border-semantic-low/20', icon: CheckCircle2 },
  pending: { color: 'bg-muted text-muted-foreground border-border', icon: Clock },
};

export const StatusBadge = ({ status, label, className }: StatusBadgeProps & { icon?: any }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border", config.color, className)}>
      <Icon size={14} />
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
