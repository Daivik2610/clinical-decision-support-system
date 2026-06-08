/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient } from './Patient';
import { RiskCategory } from '../types';

export class ReportGenerator {
  static generateSummary(patients: Patient[]) {
    const total = patients.length;
    const high = patients.filter(p => p.riskCategory === RiskCategory.High).length;
    const medium = patients.filter(p => p.riskCategory === RiskCategory.Medium).length;
    const low = patients.filter(p => p.riskCategory === RiskCategory.Low).length;

    const avgRiskScore = total > 0 
      ? (patients.reduce((sum, p) => sum + p.riskScore, 0) / total).toFixed(1)
      : 0;

    let report = `CLINICAL DECISION SUPPORT SYSTEM - SUMMARY REPORT\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `--------------------------------------------------\n\n`;
    report += `TOTAL PATIENTS ENROLLED: ${total}\n`;
    report += `HIGH RISK CASES: ${high}\n`;
    report += `MEDIUM RISK CASES: ${medium}\n`;
    report += `LOW RISK CASES: ${low}\n\n`;
    report += `AVERAGE RISK SCORE: ${avgRiskScore}\n\n`;
    report += `PRIORITY PATIENT LIST (Top 5 High Risk):\n`;
    report += `--------------------------------------------------\n`;

    const priorityPatients = patients
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);

    priorityPatients.forEach((p, i) => {
      report += `${i + 1}. ${p.fullName} (Score: ${p.riskScore}, ${p.riskCategory})\n`;
    });

    if (patients.length === 0) {
      report += `No patient data available.\n`;
    }

    report += `\n--------------------------------------------------\n`;
    report += `END OF REPORT\n`;

    return report;
  }
}
