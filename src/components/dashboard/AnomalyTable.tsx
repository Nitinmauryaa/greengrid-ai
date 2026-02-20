import { AnomalyResult } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export function AnomalyTable({ anomalies }: { anomalies: AnomalyResult[] }) {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Recent Anomalies</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Time</th>
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Score</th>
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Risk</th>
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Reason</th>
              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">Overload %</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {anomalies.slice(0, 8).map((a, i) => (
                <motion.tr
                  key={a.timestamp + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-b border-border/50"
                >
                  <td className="py-2 px-3 font-mono text-xs text-muted-foreground">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-3 font-mono text-xs">{a.anomalyScore.toFixed(3)}</td>
                  <td className="py-2 px-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      a.riskLevel === 'CRITICAL' ? 'bg-critical/20 text-critical' :
                      a.riskLevel === 'HIGH' ? 'bg-warning/20 text-warning' :
                      'bg-primary/20 text-primary'
                    }`}>{a.riskLevel}</span>
                  </td>
                  <td className="py-2 px-3 text-xs text-muted-foreground max-w-[200px] truncate">{a.riskReason}</td>
                  <td className="py-2 px-3 text-right font-mono text-xs">{a.overloadProbability.toFixed(1)}%</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
