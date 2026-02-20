import { useMemo } from 'react';
import { CITIES, SOCIETIES, getTransformerStatuses, getGridStabilityIndex } from '@/lib/mock-data';
import { GridStabilityGauge } from './GridStabilityGauge';
import { TransformerStatus } from '@/lib/types';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface Props {
  allStatuses: Record<string, TransformerStatus[]>;
}

export function CityHeatmap({ allStatuses }: Props) {
  const cityData = useMemo(() => {
    return CITIES.map(city => {
      const allZoneStatuses: TransformerStatus[] = [];
      const zones = city.zones.map(zone => {
        const zoneStatuses = zone.societyIds.flatMap(sid => allStatuses[sid] || []);
        allZoneStatuses.push(...zoneStatuses);
        const gsi = getGridStabilityIndex(zoneStatuses);
        return { ...zone, gsi, statuses: zoneStatuses };
      });
      const cityGsi = getGridStabilityIndex(allZoneStatuses);
      return { ...city, zones, gsi: cityGsi };
    });
  }, [allStatuses]);

  return (
    <div className="bg-card rounded-lg border border-border p-5 space-y-4">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" /> Smart City Grid — Hierarchy View
      </h3>
      
      {cityData.map(city => (
        <div key={city.id} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{city.name}</span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
              city.gsi.status === 'Stable' ? 'bg-primary/20 text-primary' :
              city.gsi.status === 'Moderate' ? 'bg-warning/20 text-warning' :
              'bg-critical/20 text-critical'
            }`}>GSI: {city.gsi.gsi}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {city.zones.map(zone => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-secondary/20 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">{zone.name}</span>
                  <span className={`text-xs font-mono ${
                    zone.gsi.status === 'Stable' ? 'text-primary' :
                    zone.gsi.status === 'Moderate' ? 'text-warning' : 'text-critical'
                  }`}>{zone.gsi.gsi}/100</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      zone.gsi.status === 'Stable' ? 'bg-primary' :
                      zone.gsi.status === 'Moderate' ? 'bg-warning' : 'bg-critical'
                    }`}
                    style={{ width: `${zone.gsi.gsi}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {zone.societyIds.length} societies • {zone.statuses.length} transformers
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
