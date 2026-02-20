export type Role = 'owner' | 'admin' | 'resident';

export type RiskLevel = 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  societyId?: string;
  flatNumber?: string;
}

export interface Society {
  id: string;
  name: string;
  location: string;
  transformerCapacity: number;
  householdCount: number;
  transformerCount: number;
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

export interface AnomalyResult {
  timestamp: number;
  anomalyScore: number;
  riskLevel: RiskLevel;
  riskReason: string;
  overloadProbability: number;
  societyId: string;
  transformerId: string;
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
