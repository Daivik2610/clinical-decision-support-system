/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gender, RiskCategory, PatientData } from '../types';

export class Patient implements PatientData {
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
  riskScore: number = 0;
  riskCategory: RiskCategory = RiskCategory.Low;
  registeredAt: Date;

  constructor(data: Omit<PatientData, 'riskScore' | 'riskCategory' | 'registeredAt'>) {
    this.id = data.id || Math.random().toString(36).substr(2, 9);
    this.fullName = data.fullName;
    this.age = data.age;
    this.gender = data.gender;
    this.bloodPressure = data.bloodPressure;
    this.sugarLevel = data.sugarLevel;
    this.bmi = data.bmi;
    this.smokingHabit = data.smokingHabit;
    this.heartDiseaseHistory = data.heartDiseaseHistory;
    this.cholesterolLevel = data.cholesterolLevel;
    this.registeredAt = new Date();
    this.evaluateRisk();
  }

  evaluateRisk() {
    let score = 0;

    // Rule 1: Age > 60 -> +1
    if (this.age > 60) score += 1;

    // Rule 2: BS > 140 -> +2 (PRD says Blood Pressure > 140)
    if (this.bloodPressure > 140) score += 2;

    // Rule 3: Sugar Level > 180 -> +2
    if (this.sugarLevel > 180) score += 2;

    // Rule 4: BMI > 30 -> +1
    if (this.bmi > 30) score += 1;

    // Rule 5: Smoking Habit = Yes -> +1
    if (this.smokingHabit) score += 1;

    // Rule 6: Heart Disease History = Yes -> +2
    if (this.heartDiseaseHistory) score += 2;

    this.riskScore = score;

    // Classification
    if (score >= 6) {
      this.riskCategory = RiskCategory.High;
    } else if (score >= 3) {
      this.riskCategory = RiskCategory.Medium;
    } else {
      this.riskCategory = RiskCategory.Low;
    }
  }

  update(data: Partial<Omit<PatientData, 'id' | 'riskScore' | 'riskCategory' | 'registeredAt'>>) {
    Object.assign(this, data);
    this.evaluateRisk();
  }
}
