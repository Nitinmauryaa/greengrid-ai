import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SOCIETIES, getTransformerStatuses, detectRisk, generateLiveReading, getGridStabilityIndex } from '@/lib/mock-data';
import { TransformerGauge } from '@/components/dashboard/TransformerGauge';
import { LiveChart } from '@/components/dashboard/LiveChart';
import { AnomalyTable } from '@/components/dashboard/AnomalyTable';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { LoadHistoryChart } from '@/components/dashboard/LoadHistoryChart';
import { GridStabilityGauge } from '@/components/dashboard/GridStabilityGauge';
import { DemandResponsePanel } from '@/components/dashboard/DemandResponsePanel';
import { DigitalTwinPanel } from '@/components/dashboard/DigitalTwinPanel';
import { CarbonIntelligence } from '@/components/dashboard/CarbonIntelligence';
import { IncidentLog } from '@/components/dashboard/IncidentLog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AnomalyResult, TransformerStatus } from '@/lib/types';
import { Zap, AlertTriangle, Activity, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const societyId = user?.societyId || 's1';
  const society = SOCIETIES.find(s => s.id === societyId) || SOCIETIES[0];

  const [isSimulating, setIsSimulating] = useState(true);
  const [transformers, setTransformers] = useState<TransformerStatus[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyResult[]>([]);

  useEffect(() => {
    const update = () => {
      const statuses = getTransformerStatuses(societyId, society.transformerCapacity);
      setTransformers(statuses);
      statuses.forEach(t => {
        if (t.riskLevel !== 'NORMAL') {
          const reading = generateLiveReading(societyId, t.id);
          const anomaly = detectRisk(reading, society.transformerCapacity);
          if (anomaly.riskLevel !== 'NORMAL') {
            setAnomalies(prev => [anomaly, ...prev].slice(0, 20));
          }
        }
      });
    };
    update();
    if (isSimulating) {
      const i = setInterval(update, 5000);
      return () => clearInterval(i);
    }
  }, [isSimulating, societyId, society.transformerCapacity]);

  const criticalCount = transformers.filter(t => t.riskLevel === 'CRITICAL').length;
  const avgUtil = transformers.length > 0 ? transformers.reduce((s, t) => s + t.utilizationPercent, 0) / transformers.length : 0;
  const gsi = getGridStabilityIndex(transformers);

  const handleSimulateAnomaly = () => {
    const reading = generateLiveReading(societyId, `${societyId}-t1`);
    reading.loadKw = society.transformerCapacity * (0.85 + Math.random() * 0.2);
    const anomaly = detectRisk(reading, society.transformerCapacity);
    anomaly.riskLevel = 'CRITICAL';
    anomaly.riskReason = 'Manually triggered anomaly simulation';
    setAnomalies(prev => [anomaly, ...prev].slice(0, 20));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{society.name}</h1>
          <p className="text-sm text-muted-foreground">{society.location} • Admin Panel</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Live Simulation</span>
            <Switch checked={isSimulating} onCheckedChange={setIsSimulating} />
          </div>
          <Button size="sm" variant="outline" onClick={handleSimulateAnomaly} className="border-warning text-warning hover:bg-warning/10">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Inject Anomaly
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Households" value={society.householdCount} icon={Users} />
        <StatCard title="Transformers" value={society.transformerCount} icon={Zap} subtitle={`${criticalCount} critical`} />
        <StatCard title="Avg Utilization" value={`${avgUtil.toFixed(0)}%`} icon={Activity} />
        <StatCard title="Anomalies" value={anomalies.length} icon={AlertTriangle} subtitle="detected" />
      </div>

      {/* GSI + Risk */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GridStabilityGauge data={gsi} />
        <RiskCard title="Overload Risk" value={avgUtil > 80 ? 78.3 : 15.4} unit="%" riskLevel={avgUtil > 80 ? 'CRITICAL' : avgUtil > 60 ? 'HIGH' : 'NORMAL'} />
        <RiskCard title="Hybrid Score" value={(anomalies[0]?.totalRiskScore ?? 0) * 100} unit="%" riskLevel={anomalies[0]?.riskLevel ?? 'NORMAL'} subtitle="AI consensus" />
        <RiskCard title="Blackout Risk" value={criticalCount > 0 ? 34.2 : 2.1} unit="%" riskLevel={criticalCount > 0 ? 'CRITICAL' : 'NORMAL'} subtitle="Bayesian model" />
      </div>

      {/* Transformer gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {transformers.map(t => <TransformerGauge key={t.id} transformer={t} />)}
      </div>

      <LiveChart societyId={societyId} capacity={society.transformerCapacity} isSimulating={isSimulating} />

      {/* Demand Response + Digital Twin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DemandResponsePanel societyId={societyId} />
        <DigitalTwinPanel capacity={society.transformerCapacity} />
      </div>

      <CarbonIntelligence societyId={societyId} />
      <AnomalyTable anomalies={anomalies} />
      <IncidentLog societyId={societyId} />
      <LoadHistoryChart societyId={societyId} />
    </div>
  );
};

export default AdminDashboard;
