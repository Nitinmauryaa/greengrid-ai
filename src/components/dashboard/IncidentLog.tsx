import { generateIncidents } from '@/lib/mock-data';
import { useMemo } from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  societyId: string;
}

export function IncidentLog({ societyId }: Props) {
  const incidents = useMemo(() => generateIncidents(societyId), [societyId]);

  const severityColor: Record<string, string> = {
    LOW: 'text-muted-foreground',
    MEDIUM: 'text-foreground',
    HIGH: 'text-warning',
    CRITICAL: 'text-critical',
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-warning" /> Incident Log
      </h3>
      <div className="space-y-2">
        {incidents.map((inc, i) => (
          <motion.div
            key={inc.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-2.5 bg-secondary/20 rounded-lg"
          >
            {inc.resolved ? (
              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
            ) : (
              <Clock className={`w-3.5 h-3.5 ${severityColor[inc.severity]} shrink-0`} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{inc.title}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(inc.timestamp).toLocaleTimeString()}</p>
            </div>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              inc.severity === 'CRITICAL' ? 'bg-critical/20 text-critical' :
              inc.severity === 'HIGH' ? 'bg-warning/20 text-warning' :
              'bg-secondary text-muted-foreground'
            }`}>{inc.severity}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
