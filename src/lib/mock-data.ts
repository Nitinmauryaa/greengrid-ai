import { Society, EnergyReading, AnomalyResult, TransformerStatus, RiskLevel, HybridRiskResult, DemandResponseScenario, DigitalTwinScenario, CarbonMetrics, GridStabilityIndex, City, Zone, Incident, AlertSeverity } from './types';

// Raw CSV data embedded
const RAW_DATA = [
  {hour:0,load:84.34,temp:24.2,ev:0},{hour:1,load:85.46,temp:25.0,ev:0},{hour:2,load:135.31,temp:27.2,ev:1},
  {hour:3,load:150.52,temp:30.2,ev:1},{hour:4,load:128.23,temp:30.9,ev:1},{hour:5,load:93.29,temp:31.5,ev:0},
  {hour:6,load:126.71,temp:31.0,ev:0},{hour:7,load:114.71,temp:28.0,ev:0},{hour:8,load:120.03,temp:32.4,ev:0},
  {hour:9,load:150.82,temp:31.4,ev:1},{hour:10,load:117.38,temp:26.8,ev:0},{hour:11,load:117.94,temp:26.0,ev:0},
  {hour:12,load:148.25,temp:31.0,ev:0},{hour:13,load:143.94,temp:20.9,ev:1},{hour:14,load:163.68,temp:32.2,ev:0},
  {hour:15,load:123.37,temp:27.7,ev:0},{hour:16,load:125.79,temp:27.5,ev:0},{hour:17,load:158.39,temp:32.2,ev:1},
  {hour:18,load:212.51,temp:22.0,ev:0},{hour:19,load:241.48,temp:33.0,ev:0},{hour:20,load:270.0,temp:22.1,ev:1},
  {hour:21,load:193.08,temp:25.0,ev:0},{hour:22,load:64.87,temp:25.1,ev:0},{hour:23,load:134.09,temp:31.9,ev:1},
];

export const CITIES: City[] = [
  { id: 'c1', name: 'Delhi NCR Metro', zones: [
    { id: 'z1', name: 'Gurugram Zone', cityId: 'c1', societyIds: ['s1', 's4'] },
    { id: 'z2', name: 'Noida Zone', cityId: 'c1', societyIds: ['s5'] },
  ]},
  { id: 'c2', name: 'South India Grid', zones: [
    { id: 'z3', name: 'Bangalore Zone', cityId: 'c2', societyIds: ['s2'] },
    { id: 'z4', name: 'Mumbai Zone', cityId: 'c2', societyIds: ['s3'] },
  ]},
];

export const SOCIETIES: Society[] = [
  { id: 's1', name: 'Green Valley Estate', location: 'Sector 42, Gurugram', transformerCapacity: 300, householdCount: 100, transformerCount: 3, zoneId: 'z1' },
  { id: 's2', name: 'Sunrise Towers', location: 'Whitefield, Bangalore', transformerCapacity: 280, householdCount: 85, transformerCount: 3, zoneId: 'z3' },
  { id: 's3', name: 'Palm Heights', location: 'Powai, Mumbai', transformerCapacity: 320, householdCount: 120, transformerCount: 3, zoneId: 'z4' },
  { id: 's4', name: 'Maple Gardens', location: 'Hinjewadi, Pune', transformerCapacity: 260, householdCount: 90, transformerCount: 3, zoneId: 'z1' },
  { id: 's5', name: 'Cedar Residency', location: 'Noida Sector 62', transformerCapacity: 290, householdCount: 95, transformerCount: 3, zoneId: 'z2' },
];

export const DEMO_USERS = [
  { id: 'u1', name: 'Nitin Sharma', email: 'owner@greengrid.io', role: 'owner' as const, password: 'owner123' },
  { id: 'u2', name: 'Priya Patel', email: 'admin@greengrid.io', role: 'admin' as const, societyId: 's1', password: 'admin123' },
  { id: 'u3', name: 'Rahul Kumar', email: 'resident@greengrid.io', role: 'resident' as const, societyId: 's1', flatNumber: 'A-204', password: 'resident123' },
];

function jitter(val: number, percent: number = 0.15): number {
  return val * (1 + (Math.random() - 0.5) * 2 * percent);
}

export function generateLiveReading(societyId: string, transformerId: string, hour?: number): EnergyReading {
  const h = hour ?? new Date().getHours();
  const base = RAW_DATA[h % 24];
  return {
    timestamp: Date.now(),
    hour: h,
    loadKw: jitter(base.load, 0.2),
    temperature: jitter(base.temp, 0.1),
    evCharging: Math.random() > 0.6,
    societyId,
    transformerId,
  };
}

// ── Hybrid AI Risk Engine ──
// Total_Risk = 0.4 × anomaly_prob + 0.4 × predicted_peak_prob + 0.2 × stress_ratio
export function hybridRiskDetection(reading: EnergyReading, capacity: number): HybridRiskResult {
  const utilization = reading.loadKw / capacity;
  const isAnomaly = Math.random() < 0.1;
  
  // Isolation Forest score (simulated)
  const anomalyScore = isAnomaly ? 0.6 + Math.random() * 0.4 : Math.random() * 0.3;
  
  // LSTM forecast risk (simulated — looks at hour pattern)
  const peakHours = [17, 18, 19, 20, 21];
  const forecastRisk = peakHours.includes(reading.hour) ? 0.5 + Math.random() * 0.4 : Math.random() * 0.3;
  
  // Bayesian blackout probability
  const blackoutProbability = Math.min(
    (utilization > 0.85 ? 0.4 : 0.05) + (isAnomaly ? 0.2 : 0) + (forecastRisk * 0.3),
    1.0
  );
  
  // Hybrid formula
  const totalRiskScore = 0.4 * anomalyScore + 0.4 * forecastRisk + 0.2 * utilization;
  
  let riskLevel: RiskLevel = 'NORMAL';
  let riskReason = 'All systems nominal';
  
  if (totalRiskScore > 0.7 || utilization > 0.9) {
    riskLevel = 'CRITICAL';
    riskReason = `Hybrid score ${(totalRiskScore * 100).toFixed(0)}% — multi-model consensus: immediate risk`;
  } else if (totalRiskScore > 0.4 || isAnomaly) {
    riskLevel = 'HIGH';
    riskReason = isAnomaly
      ? 'Isolation Forest anomaly detected; LSTM confirms elevated risk'
      : `Forecast risk elevated at ${(forecastRisk * 100).toFixed(0)}%`;
  }

  return { anomalyScore, forecastRisk, blackoutProbability, totalRiskScore, riskLevel, riskReason };
}

export function detectRisk(reading: EnergyReading, capacity: number): AnomalyResult {
  const hybrid = hybridRiskDetection(reading, capacity);
  const utilization = reading.loadKw / capacity;
  return {
    timestamp: reading.timestamp,
    anomalyScore: hybrid.anomalyScore,
    riskLevel: hybrid.riskLevel,
    riskReason: hybrid.riskReason,
    overloadProbability: Math.min(utilization * 100 + (hybrid.anomalyScore > 0.5 ? 15 : 0), 100),
    societyId: reading.societyId,
    transformerId: reading.transformerId,
    forecastRisk: hybrid.forecastRisk,
    blackoutProbability: hybrid.blackoutProbability,
    totalRiskScore: hybrid.totalRiskScore,
  };
}

export function getTransformerStatuses(societyId: string, capacity: number): TransformerStatus[] {
  return ['T1', 'T2', 'T3'].map((name, i) => {
    const reading = generateLiveReading(societyId, `${societyId}-t${i+1}`);
    const risk = hybridRiskDetection(reading, capacity);
    const util = (reading.loadKw / capacity) * 100;
    return {
      id: `${societyId}-t${i+1}`,
      societyId,
      name,
      currentLoad: reading.loadKw,
      capacity,
      utilizationPercent: Math.min(util, 100),
      riskLevel: risk.riskLevel,
      temperature: reading.temperature,
    };
  });
}

export function get24HourData(societyId: string): EnergyReading[] {
  return RAW_DATA.map((d, i) => ({
    timestamp: Date.now() - (23 - i) * 3600000,
    hour: d.hour,
    loadKw: jitter(d.load, 0.1),
    temperature: d.temp,
    evCharging: d.ev === 1,
    societyId,
    transformerId: `${societyId}-t1`,
  }));
}

// ── Demand Response Simulation ──
export function simulateDemandResponse(participationPercent: number, societyId: string): DemandResponseScenario {
  const society = SOCIETIES.find(s => s.id === societyId) || SOCIETIES[0];
  const avgLoad = 150; // kW avg
  const shiftKwh = (participationPercent / 100) * society.householdCount * 1.2;
  const stressReductionPercent = participationPercent * 0.6;
  const costSavingPercent = participationPercent * 0.35;
  const co2ReductionKg = shiftKwh * 0.82; // kg CO2 per kWh shifted
  return { participationPercent, shiftKwh, stressReductionPercent, costSavingPercent, co2ReductionKg };
}

// ── Digital Twin Simulation ──
export function simulateDigitalTwin(evIncrease: number, tempRise: number, solarPercent: number, capacity: number): DigitalTwinScenario {
  const baseLoad = 180;
  const evLoad = baseLoad * (evIncrease / 100) * 0.3;
  const tempLoad = tempRise * 5.2;
  const solarOffset = capacity * (solarPercent / 100) * 0.25;
  const projectedLoad = baseLoad + evLoad + tempLoad - solarOffset;
  const overloadProbability = Math.min(Math.max((projectedLoad / capacity - 0.7) * 200, 0), 100);
  const lifeReductionYears = Math.max((overloadProbability / 100) * 8, 0);
  const investmentNeeded = overloadProbability > 50 ? Math.round(overloadProbability * 1.5) : 0; // lakhs
  return { evAdoptionIncrease: evIncrease, temperatureRise: tempRise, solarPenetration: solarPercent, overloadProbability, lifeReductionYears, investmentNeeded };
}

// ── Carbon Intelligence ──
export function getCarbonMetrics(societyId: string): CarbonMetrics {
  const peakFactor = 0.92; // kg CO2/kWh during peak (coal)
  const offPeakFactor = 0.45; // kg CO2/kWh off-peak
  const shiftedKwh = 420 + Math.random() * 100;
  const monthlySaved = shiftedKwh * (peakFactor - offPeakFactor);
  return {
    monthlySavedKg: monthlySaved,
    annualProjectionKg: monthlySaved * 12,
    equivalentTrees: Math.round((monthlySaved * 12) / 21),
    peakEmissionFactor: peakFactor,
    offPeakEmissionFactor: offPeakFactor,
  };
}

// ── Grid Stability Index ──
export function getGridStabilityIndex(statuses: TransformerStatus[]): GridStabilityIndex {
  if (statuses.length === 0) return { gsi: 85, status: 'Stable', trend: [82, 85, 80, 88, 85] };
  const avgUtil = statuses.reduce((s, t) => s + t.utilizationPercent, 0) / statuses.length;
  const critCount = statuses.filter(t => t.riskLevel === 'CRITICAL').length;
  const blackoutProb = (critCount / statuses.length) * 0.5 + (avgUtil / 100) * 0.5;
  const gsi = Math.round((1 - blackoutProb) * 100);
  const status = gsi >= 80 ? 'Stable' as const : gsi >= 50 ? 'Moderate' as const : 'Critical' as const;
  const trend = Array.from({ length: 12 }, () => Math.max(30, Math.min(100, gsi + (Math.random() - 0.5) * 20)));
  return { gsi, status, trend };
}

// ── Incidents ──
export function generateIncidents(societyId: string): Incident[] {
  const severities: AlertSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const titles = [
    'Transformer overload detected', 'Anomalous load pattern', 'EV surge spike',
    'Temperature threshold exceeded', 'Grid frequency deviation', 'Voltage fluctuation alert'
  ];
  return Array.from({ length: 5 }, (_, i) => ({
    id: `inc-${i}`,
    timestamp: Date.now() - i * 3600000,
    severity: severities[Math.floor(Math.random() * severities.length)],
    title: titles[i % titles.length],
    description: `Auto-detected by hybrid AI engine for ${societyId}`,
    societyId,
    resolved: Math.random() > 0.4,
  }));
}
