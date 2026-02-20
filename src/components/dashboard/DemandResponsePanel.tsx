import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { simulateDemandResponse } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, TrendingDown, Leaf, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  societyId: string;
}

export function DemandResponsePanel({ societyId }: Props) {
  const [participation, setParticipation] = useState(35);
  const scenario = useMemo(() => simulateDemandResponse(participation, societyId), [participation, societyId]);

  const chartData = [10, 20, 30, 40, 50, 60, 70, 80].map(p => {
    const s = simulateDemandResponse(p, societyId);
    return { participation: `${p}%`, stress: +(100 - s.stressReductionPercent).toFixed(1), savings: +s.costSavingPercent.toFixed(1) };
  });

  return (
    <div className="bg-card rounded-lg border border-border p-5 space-y-4">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" /> Demand Response Simulator
      </h3>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Household Participation</span>
          <span className="text-sm font-mono font-bold text-primary">{participation}%</span>
        </div>
        <Slider value={[participation]} onValueChange={v => setParticipation(v[0])} min={5} max={90} step={5} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={TrendingDown} label="Stress Reduction" value={`${scenario.stressReductionPercent.toFixed(1)}%`} />
        <Stat icon={IndianRupee} label="Cost Saving" value={`${scenario.costSavingPercent.toFixed(1)}%`} />
        <Stat icon={Leaf} label="CO₂ Reduced" value={`${scenario.co2ReductionKg.toFixed(0)} kg`} />
        <Stat icon={Users} label="kWh Shifted" value={`${scenario.shiftKwh.toFixed(0)}`} />
      </div>

      <p className="text-xs text-muted-foreground italic">
        "If {participation}% of households shift 1kWh to off-peak, transformer stress reduces by {scenario.stressReductionPercent.toFixed(0)}%."
      </p>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="participation" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
          <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: '8px', fontSize: '12px' }} />
          <Bar dataKey="stress" fill="hsl(38, 92%, 50%)" name="Stress %" radius={[3, 3, 0, 0]} />
          <Bar dataKey="savings" fill="hsl(142, 70%, 45%)" name="Savings %" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-secondary/30 rounded-lg">
      <Icon className="w-3.5 h-3.5 text-primary mb-1" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-mono font-bold text-foreground">{value}</p>
    </motion.div>
  );
}
