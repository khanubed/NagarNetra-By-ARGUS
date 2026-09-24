import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number; // percentage change
  trendLabel?: string;
  className?: string;
}

export const KpiCard = ({ title, value, icon, trend, trendLabel, className }: KpiCardProps) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className={cn("bg-card border rounded-xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow", className)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground tracking-tight">{title}</h3>
        <div className="p-2 bg-primary/5 text-primary rounded-md">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
      </div>
      
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={cn(
            "flex items-center font-medium",
            isPositive ? "text-semantic-critical" : isNegative ? "text-semantic-low" : "text-muted-foreground"
          )}>
            {isPositive ? <TrendingUp size={14} className="mr-1" /> : isNegative ? <TrendingDown size={14} className="mr-1" /> : null}
            {Math.abs(trend)}%
          </span>
          <span className="text-muted-foreground">{trendLabel || "vs last month"}</span>
        </div>
      )}
    </div>
  );
};
