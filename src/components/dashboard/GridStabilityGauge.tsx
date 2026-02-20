import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { GridStabilityIndex } from '@/lib/types';

interface Props {
  data: GridStabilityIndex;
  label?: string;
}

export function GridStabilityGauge({ data, label }: Props) {
  const color = data.status === 'Stable' ? 'text-primary' : data.status === 'Moderate' ? 'text-warning' : 'text-critical';
  const bgColor = data.status === 'Stable' ? 'bg-primary' : data.status === 'Moderate' ? 'bg-warning' : 'bg-critical';
  const glowClass = data.status === 'Stable' ? 'glow-green' : data.status === 'Moderate' ? 'glow-warning' : 'glow-critical';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-card rounded-lg border border-border p-5 ${glowClass}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Shield className={`w-4 h-4 ${color}`} />
        <span className="text-sm text-muted-foreground">{label || 'Grid Stability Index'}</span>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span className={`text-4xl font-mono font-bold ${color}`}>{data.gsi}</span>
        <span className="text-sm text-muted-foreground mb-1">/ 100</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${data.gsi}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${bgColor} rounded-full`}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${color}`}>{data.status}</span>
        <div className="flex gap-px">
          {data.trend.slice(-8).map((v, i) => (
            <div key={i} className={`w-1.5 rounded-full ${bgColor}`} style={{ height: `${v / 5}px`, opacity: 0.4 + (i / 10) }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
