/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient } from '../models/Patient';
import { SortCriteria } from '../models/SortManager';
import { RiskBadge } from './RiskBadge';
import { Edit2, Trash2, ArrowUpDown, Clock, MoreVertical, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  onSort: (criteria: SortCriteria) => void;
  currentSort: SortCriteria;
}

export function PatientTable({ patients, onEdit, onDelete, onSort, currentSort }: PatientTableProps) {
  return (
    <div className="medical-card overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold font-heading text-slate-800">All Patient Records</h3>
        <div className="flex gap-2">
          <span className="text-xs text-slate-400 self-center mr-2">Sort by:</span>
          {(['risk', 'age', 'emergency', 'name'] as SortCriteria[]).map(criteria => (
            <button
              key={criteria}
              onClick={() => onSort(criteria)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                currentSort === criteria
                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-700/20'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 shadow-sm'
              } shadow-sm`}
            >
              <ArrowUpDown size={12} />
              {criteria.charAt(0) + criteria.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Age/Sex</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Health Metrics</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                  No patient records found. Start by adding a new patient.
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {patients.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.002, backgroundColor: 'rgba(0,0,0,0.02)', transition: { duration: 0.1 } }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 400, 
                      damping: 30,
                      opacity: { duration: 0.2 },
                      layout: { duration: 0.3 }
                    }}
                    className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50"
                  >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {patient.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 leading-none mb-1">{patient.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">
                    <div className="font-medium text-slate-900">{patient.age} years</div>
                    <div className="text-xs text-slate-400">{patient.gender}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <MetricBadge label="BP" value={patient.bloodPressure} unit="mmHg" />
                      <MetricBadge label="Sugar" value={patient.sugarLevel} unit="mg/dL" />
                      <MetricBadge label="BMI" value={patient.bmi} />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1 items-start">
                      <RiskBadge category={patient.riskCategory} />
                      <span className="text-[10px] font-bold text-slate-400 px-1">Score: {patient.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(patient)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(patient.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricBadge({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase">{label}:</span>
      <span className="text-xs font-semibold text-slate-700">{value}{unit && <span className="text-[8px] ml-0.5 text-slate-400">{unit}</span>}</span>
    </div>
  );
}
