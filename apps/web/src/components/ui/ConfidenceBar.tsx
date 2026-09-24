import { cn } from '@ui/lib/utils';

interface ConfidenceBarProps {
  score: number; // 0 to 100
  label?: string;
}

export const ConfidenceBar = ({ score, label = "AI Confidence" }: ConfidenceBarProps) => {
  // Determine color based on threshold
  let color = "bg-semantic-low";
  if (score < 60) color = "bg-semantic-critical";
  else if (score < 80) color = "bg-semantic-medium";

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold">{score}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500 rounded-full", color)} 
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
