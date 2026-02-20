import { Society, EnergyReading, AnomalyResult, TransformerStatus, RiskLevel } from './types';

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

export const SOCIETIES: Society[] = [
  { id: 's1', name: 'Green Valley Estate', location: 'Sector 42, Gurugram', transformerCapacity: 300, householdCount: 100, transformerCount: 3 },
  { id: 's2', name: 'Sunrise Towers', location: 'Whitefield, Bangalore', transformerCapacity: 280, householdCount: 85, transformerCount: 3 },
  { id: 's3', name: 'Palm Heights', location: 'Powai, Mumbai', transformerCapacity: 320, householdCount: 120, transformerCount: 3 },
  { id: 's4', name: 'Maple Gardens', location: 'Hinjewadi, Pune', transformerCapacity: 260, householdCount: 90, transformerCount: 3 },
  { id: 's5', name: 'Cedar Residency', location: 'Noida Sector 62', transformerCapacity: 290, householdCount: 95, transformerCount: 3 },
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

export function detectRisk(reading: EnergyReading, capacity: number): AnomalyResult {
  const utilization = reading.loadKw / capacity;
  const isAnomaly = Math.random() < 0.1; // 10% anomaly injection
  
  let riskLevel: RiskLevel = 'NORMAL';
  let riskReason = 'Load within normal parameters';
  let anomalyScore = Math.random() * 0.3;
  
  if (utilization > 0.9) {
    riskLevel = 'CRITICAL';
    riskReason = `Transformer at ${(utilization * 100).toFixed(0)}% capacity - immediate attention required`;
    anomalyScore = 0.85 + Math.random() * 0.15;
  } else if (isAnomaly || utilization > 0.75) {
    riskLevel = 'HIGH';
    riskReason = isAnomaly 
      ? 'Anomalous load pattern detected by Isolation Forest' 
      : `Load approaching threshold at ${(utilization * 100).toFixed(0)}%`;
    anomalyScore = 0.5 + Math.random() * 0.35;
  }

  return {
    timestamp: reading.timestamp,
    anomalyScore,
    riskLevel,
    riskReason,
    overloadProbability: Math.min(utilization * 100 + (isAnomaly ? 15 : 0), 100),
    societyId: reading.societyId,
    transformerId: reading.transformerId,
  };
}

export function getTransformerStatuses(societyId: string, capacity: number): TransformerStatus[] {
  return ['T1', 'T2', 'T3'].map((name, i) => {
    const reading = generateLiveReading(societyId, `${societyId}-t${i+1}`);
    const risk = detectRisk(reading, capacity);
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
