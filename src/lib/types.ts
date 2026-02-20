export type Role = 'owner' | 'admin' | 'resident';

export type RiskLevel = 'NORMAL' | 'HIGH' | 'CRITICAL';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  societyId?: string;
  flatNumber?: string;
}

export interface City {
  id: string;
  name: string;
  zones: Zone[];
}

export interface Zone {
  id: string;
  name: string;
  cityId: string;
  societyIds: string[];
}

export interface Society {
  id: string;
  name: string;
  location: string;
  transformerCapacity: number;
  householdCount: number;
  transformerCount: number;
  zoneId?: string;
}

export interface EnergyReading {
  timestamp: number;
  hour: number;
  loadKw: number;
  temperature: number;
  evCharging: boolean;
  societyId: string;
  transformerId: string;
}

export interface HybridRiskResult {
  anomalyScore: number;
  forecastRisk: number;
  blackoutProbability: number;
  totalRiskScore: number;
  riskLevel: RiskLevel;
  riskReason: string;
}

export interface AnomalyResult {
  timestamp: number;
  anomalyScore: number;
  riskLevel: RiskLevel;
  riskReason: string;
  overloadProbability: number;
  societyId: string;
  transformerId: string;
  forecastRisk?: number;
  blackoutProbability?: number;
  totalRiskScore?: number;
}

export interface TransformerStatus {
  id: string;
  societyId: string;
  name: string;
  currentLoad: number;
  capacity: number;
  utilizationPercent: number;
  riskLevel: RiskLevel;
  temperature: number;
}

export interface DemandResponseScenario {
  participationPercent: number;
  shiftKwh: number;
  stressReductionPercent: number;
  costSavingPercent: number;
  co2ReductionKg: number;
}

export interface DigitalTwinScenario {
  evAdoptionIncrease: number;
  temperatureRise: number;
  solarPenetration: number;
  overloadProbability: number;
  lifeReductionYears: number;
  investmentNeeded: number;
}

export interface CarbonMetrics {
  monthlySavedKg: number;
  annualProjectionKg: number;
  equivalentTrees: number;
  peakEmissionFactor: number;
  offPeakEmissionFactor: number;
}

export interface GridStabilityIndex {
  gsi: number;
  status: 'Stable' | 'Moderate' | 'Critical';
  trend: number[];
}

export interface Incident {
  id: string;
  timestamp: number;
  severity: AlertSeverity;
  title: string;
  description: string;
  societyId: string;
  resolved: boolean;
}
