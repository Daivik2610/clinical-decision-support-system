/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum RiskCategory {
  Low = 'Low Risk',
  Medium = 'Medium Risk',
  High = 'High Risk'
}

export interface PatientData {
  id: string;
  fullName: string;
  age: number;
  gender: Gender;
  bloodPressure: number;
  sugarLevel: number;
  bmi: number;
  smokingHabit: boolean;
  heartDiseaseHistory: boolean;
  cholesterolLevel: number;
  riskScore?: number;
  riskCategory?: RiskCategory;
  registeredAt: Date;
}

export interface DashboardStats {
  total: number;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
}
