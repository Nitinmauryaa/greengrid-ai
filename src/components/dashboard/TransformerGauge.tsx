import { motion } from 'framer-motion';
import { TransformerStatus } from '@/lib/types';

export function TransformerGauge({ transformer }: { transformer: TransformerStatus }) {
  const { name, utilizationPercent, riskLevel, currentLoad, capacity } = transformer;
  
  const color = riskLevel === 'CRITICAL' ? 'var(--critical)' 
    : riskLevel === 'HIGH' ? 'var(--warning)' 
    : 'var(--primary)';
  
  const colorClass = riskLevel === 'CRITICAL' ? 'text-critical' 
    : riskLevel === 'HIGH' ? 'text-warning' 
    : 'text-primary';

  const glowClass = riskLevel === 'CRITICAL' ? 'glow-critical' 
    : riskLevel === 'HIGH' ? 'glow-warning' 
    : 'glow-green';

  const circumference = 2 * Math.PI * 45;
  const filled = (utilizationPercent / 100) * circumference * 0.75;

  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${glowClass} transition-shadow duration-500`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
          riskLevel === 'CRITICAL' ? 'bg-critical/20 text-critical' :
          riskLevel === 'HIGH' ? 'bg-warning/20 text-warning' :
          'bg-primary/20 text-primary'
        }`}>{riskLevel}</span>
      </div>
      <div className="relative flex items-center justify-center">
        <svg width="120" height="100" viewBox="0 0 120 100">
          <path
            d="M 15 85 A 45 45 0 1 1 105 85"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <motion.path
            d="M 15 85 A 45 45 0 1 1 105 85"
            fill="none"
            stroke={`hsl(${color})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75}`}
            initial={{ strokeDashoffset: circumference * 0.75 }}
            animate={{ strokeDashoffset: circumference * 0.75 - filled }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className={`text-2xl font-mono font-bold ${colorClass}`}>
            {utilizationPercent.toFixed(0)}%
          </span>
          <span className="text-xs text-muted-foreground">
            {currentLoad.toFixed(0)} / {capacity} kW
          </span>
        </div>
      </div>
    </div>
  );
}
