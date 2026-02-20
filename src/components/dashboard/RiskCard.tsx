import { motion } from 'framer-motion';
import { RiskLevel } from '@/lib/types';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface RiskCardProps {
  title: string;
  value: number;
  unit: string;
  riskLevel: RiskLevel;
  subtitle?: string;
}

const icons = {
  NORMAL: CheckCircle,
  HIGH: AlertTriangle,
  CRITICAL: XCircle,
};

export function RiskCard({ title, value, unit, riskLevel, subtitle }: RiskCardProps) {
  const Icon = icons[riskLevel];
  const colorClass = riskLevel === 'CRITICAL' ? 'text-critical' 
    : riskLevel === 'HIGH' ? 'text-warning' : 'text-primary';
  const bgClass = riskLevel === 'CRITICAL' ? 'bg-critical/10' 
    : riskLevel === 'HIGH' ? 'bg-warning/10' : 'bg-primary/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card rounded-lg border border-border p-5`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${bgClass}`}>
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-mono font-bold ${colorClass}`}>
          {value.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
    </motion.div>
  );
}
