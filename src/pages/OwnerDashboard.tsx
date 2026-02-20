import { useState, useEffect } from 'react';
import { SOCIETIES, getTransformerStatuses, getGridStabilityIndex } from '@/lib/mock-data';
import { StatCard } from '@/components/dashboard/StatCard';
import { TransformerGauge } from '@/components/dashboard/TransformerGauge';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { SocietySelector } from '@/components/dashboard/SocietySelector';
import { LoadHistoryChart } from '@/components/dashboard/LoadHistoryChart';
import { GridStabilityGauge } from '@/components/dashboard/GridStabilityGauge';
import { CityHeatmap } from '@/components/dashboard/CityHeatmap';
import { CarbonIntelligence } from '@/components/dashboard/CarbonIntelligence';
import { DemandResponsePanel } from '@/components/dashboard/DemandResponsePanel';
import { DigitalTwinPanel } from '@/components/dashboard/DigitalTwinPanel';
import { IncidentLog } from '@/components/dashboard/IncidentLog';
import { Building2, Zap, AlertTriangle, Leaf, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { TransformerStatus } from '@/lib/types';

const OwnerDashboard = () => {
  const [selectedSociety, setSelectedSociety] = useState('s1');
  const [allStatuses, setAllStatuses] = useState<Record<string, TransformerStatus[]>>({});

  useEffect(() => {
    const update = () => {
      const statuses: Record<string, TransformerStatus[]> = {};
      SOCIETIES.forEach(s => { statuses[s.id] = getTransformerStatuses(s.id, s.transformerCapacity); });
      setAllStatuses(statuses);
    };
    update();
    const i = setInterval(update, 5000);
    return () => clearInterval(i);
  }, []);

  const totalSocieties = SOCIETIES.length;
  const totalTransformers = SOCIETIES.reduce((sum, s) => sum + s.transformerCount, 0);
  const allFlat = Object.values(allStatuses).flat();
  const criticalCount = allFlat.filter(t => t.riskLevel === 'CRITICAL').length;
  const highCount = allFlat.filter(t => t.riskLevel === 'HIGH').length;
  const avgUtilization = allFlat.length > 0 ? allFlat.reduce((sum, t) => sum + t.utilizationPercent, 0) / allFlat.length : 0;
  const globalGsi = getGridStabilityIndex(allFlat);
  const overallRisk = criticalCount > 0 ? 'CRITICAL' as const : highCount > 2 ? 'HIGH' as const : 'NORMAL' as const;
  const selectedStatuses = allStatuses[selectedSociety] || [];
  const selectedSocietyData = SOCIETIES.find(s => s.id === selectedSociety) || SOCIETIES[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Owner Dashboard</h1>
          <p className="text-sm text-muted-foreground">Autonomous AI Grid Intelligence Platform</p>
        </div>
        <SocietySelector value={selectedSociety} onChange={setSelectedSociety} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Societies" value={totalSocieties} icon={Building2} subtitle="Active" />
        <StatCard title="Transformers" value={totalTransformers} icon={Zap} subtitle={`${criticalCount} critical`} />
        <StatCard title="Avg Load" value={`${avgUtilization.toFixed(0)}%`} icon={Shield} trend={{ value: 3.2, positive: false }} />
        <StatCard title="Carbon Saved" value="12.4T" icon={Leaf} subtitle="This month" trend={{ value: 8, positive: true }} />
      </div>

      {/* GSI + Risk */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GridStabilityGauge data={globalGsi} label="Global Grid Stability" />
        <RiskCard title="Blackout Probability" value={criticalCount > 0 ? 23.5 : 4.2} unit="%" riskLevel={overallRisk} subtitle="Bayesian model" />
        <RiskCard title="Anomaly Rate" value={highCount + criticalCount} unit="alerts" riskLevel={highCount > 1 ? 'HIGH' : 'NORMAL'} subtitle="Hybrid AI engine" />
        <RiskCard title="Grid Headroom" value={100 - avgUtilization} unit="%" riskLevel={avgUtilization > 80 ? 'CRITICAL' : avgUtilization > 65 ? 'HIGH' : 'NORMAL'} />
      </div>

      {/* City hierarchy */}
      <CityHeatmap allStatuses={allStatuses} />

      {/* Society heatmap */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">Society Risk Heatmap</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {SOCIETIES.map(s => {
            const statuses = allStatuses[s.id] || [];
            const worstRisk = statuses.find(t => t.riskLevel === 'CRITICAL') ? 'CRITICAL' : statuses.find(t => t.riskLevel === 'HIGH') ? 'HIGH' : 'NORMAL';
            const avgLoad = statuses.length > 0 ? statuses.reduce((sum, t) => sum + t.utilizationPercent, 0) / statuses.length : 0;
            return (
              <motion.div key={s.id} whileHover={{ scale: 1.02 }} onClick={() => setSelectedSociety(s.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedSociety === s.id ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30'} ${worstRisk === 'CRITICAL' ? 'glow-critical' : worstRisk === 'HIGH' ? 'glow-warning' : ''}`}>
                <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.location}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-mono font-bold text-foreground">{avgLoad.toFixed(0)}%</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${worstRisk === 'CRITICAL' ? 'bg-critical/20 text-critical' : worstRisk === 'HIGH' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>{worstRisk}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected society transformers */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">{selectedSocietyData.name} — Transformers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedStatuses.map(t => <TransformerGauge key={t.id} transformer={t} />)}
        </div>
      </div>

      {/* Demand Response + Digital Twin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DemandResponsePanel societyId={selectedSociety} />
        <DigitalTwinPanel capacity={selectedSocietyData.transformerCapacity} />
      </div>

      <CarbonIntelligence societyId={selectedSociety} />
      <IncidentLog societyId={selectedSociety} />
      <LoadHistoryChart societyId={selectedSociety} />
    </div>
  );
};

export default OwnerDashboard;
