import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { simulateDigitalTwin } from '@/lib/mock-data';
import { Cpu, Thermometer, BatteryCharging, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  capacity: number;
}

export function DigitalTwinPanel({ capacity }: Props) {
  const [ev, setEv] = useState(20);
  const [temp, setTemp] = useState(3);
  const [solar, setSolar] = useState(15);

  const result = useMemo(() => simulateDigitalTwin(ev, temp, solar, capacity), [ev, temp, solar, capacity]);

  const overloadColor = result.overloadProbability > 70 ? 'text-critical' : result.overloadProbability > 40 ? 'text-warning' : 'text-primary';

  return (
    <div className="bg-card rounded-lg border border-border p-5 space-y-4">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <Cpu className="w-4 h-4 text-accent-foreground" /> Digital Twin — What-If Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SliderControl icon={BatteryCharging} label="EV Adoption +" value={ev} unit="%" min={0} max={100} onChange={setEv} />
        <SliderControl icon={Thermometer} label="Temp Rise +" value={temp} unit="°C" min={0} max={10} onChange={setTemp} />
        <SliderControl icon={Sun} label="Solar Rooftop" value={solar} unit="%" min={0} max={80} onChange={setSolar} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ResultCard label="Overload Probability" value={`${result.overloadProbability.toFixed(1)}%`} className={overloadColor} />
        <ResultCard label="Life Reduction" value={`${result.lifeReductionYears.toFixed(1)} yrs`} className="text-warning" />
        <ResultCard label="Investment Need" value={result.investmentNeeded > 0 ? `₹${result.investmentNeeded}L` : 'None'} className={result.investmentNeeded > 0 ? 'text-critical' : 'text-primary'} />
      </div>
    </div>
  );
}

function SliderControl({ icon: Icon, label, value, unit, min, max, onChange }: { icon: React.ElementType; label: string; value: number; unit: string; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="ml-auto text-xs font-mono font-bold text-foreground">{value}{unit}</span>
      </div>
      <Slider value={[value]} onValueChange={v => onChange(v[0])} min={min} max={max} step={1} />
    </div>
  );
}

function ResultCard({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-secondary/30 rounded-lg text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-mono font-bold ${className}`}>{value}</p>
    </motion.div>
  );
}
