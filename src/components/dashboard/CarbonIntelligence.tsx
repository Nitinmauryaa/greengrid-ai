import { useMemo } from 'react';
import { getCarbonMetrics } from '@/lib/mock-data';
import { Leaf, TreePine, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  societyId: string;
}

export function CarbonIntelligence({ societyId }: Props) {
  const metrics = useMemo(() => getCarbonMetrics(societyId), [societyId]);

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
        <Leaf className="w-4 h-4 text-primary" /> Dynamic Carbon Intelligence
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard icon={TrendingDown} label="Monthly Saved" value={`${metrics.monthlySavedKg.toFixed(0)} kg`} sub="CO₂" />
        <MetricCard icon={TrendingDown} label="Annual Projection" value={`${(metrics.annualProjectionKg / 1000).toFixed(1)} T`} sub="CO₂" />
        <MetricCard icon={TreePine} label="Equiv. Trees" value={`${metrics.equivalentTrees}`} sub="planted" />
        <div className="p-3 bg-secondary/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Emission Factors</p>
          <div className="flex items-center gap-2">
            <span className="text-xs px-1.5 py-0.5 rounded bg-critical/20 text-critical">Peak: {metrics.peakEmissionFactor}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">Off: {metrics.offPeakEmissionFactor}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">kg CO₂/kWh</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-secondary/30 rounded-lg">
      <Icon className="w-3.5 h-3.5 text-primary mb-1" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-mono font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </motion.div>
  );
}
