/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient } from './Patient';

export type SortCriteria = 'risk' | 'age' | 'emergency' | 'name';

export class SortManager {
  /**
   * Implements Merge Sort for Patients
   */
  static sortBy(patients: Patient[], criteria: SortCriteria): Patient[] {
    if (patients.length <= 1) return patients;

    const mid = Math.floor(patients.length / 2);
    const left = this.sortBy(patients.slice(0, mid), criteria);
    const right = this.sortBy(patients.slice(mid), criteria);

    return this.merge(left, right, criteria);
  }

  private static merge(left: Patient[], right: Patient[], criteria: SortCriteria): Patient[] {
    let result: Patient[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (this.compare(left[leftIndex], right[rightIndex], criteria)) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }

  private static compare(a: Patient, b: Patient, criteria: SortCriteria): boolean {
    switch (criteria) {
      case 'risk':
        // Highest risk score first
        return a.riskScore >= b.riskScore;
      case 'age':
        // Oldest patient first
        return a.age >= b.age;
      case 'emergency':
        // High Risk > Medium Risk > Low Risk
        const riskOrder = { 'High Risk': 3, 'Medium Risk': 2, 'Low Risk': 1 };
        return riskOrder[a.riskCategory] >= riskOrder[b.riskCategory];
      case 'name':
        return a.fullName.toLowerCase() <= b.fullName.toLowerCase();
      default:
        return true;
    }
  }
}
