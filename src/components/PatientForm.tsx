/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { Gender, PatientData } from '../types';
import { Patient } from '../models/Patient';
import { X, Heart, Activity, User, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PatientFormProps {
  patient?: Patient | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function PatientForm({ patient, onSave, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    age: 40,
    gender: Gender.Male,
    bloodPressure: 120,
    sugarLevel: 100,
    bmi: 22,
    smokingHabit: false,
    heartDiseaseHistory: false,
    cholesterolLevel: 200,
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        fullName: patient.fullName,
        age: patient.age,
        gender: patient.gender,
        bloodPressure: patient.bloodPressure,
        sugarLevel: patient.sugarLevel,
        bmi: patient.bmi,
        smokingHabit: patient.smokingHabit,
        heartDiseaseHistory: patient.heartDiseaseHistory,
        cholesterolLevel: patient.cholesterolLevel,
      });
    }
  }, [patient]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-heading">
              {patient ? 'Edit Patient Record' : 'Register New Patient'}
            </h2>
            <p className="text-blue-100 text-sm opacity-80">
              Please enter accurate medical indicators for risk analysis.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
          {/* Basic Info */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User size={14} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value={Gender.Male}>Male</option>
                  <option value={Gender.Female}>Female</option>
                  <option value={Gender.Other}>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Indicators */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity size={14} /> Medical Indicators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Pressure (mmHg)</label>
                <input
                  type="number"
                  required
                  value={formData.bloodPressure}
                  onChange={e => setFormData({ ...formData, bloodPressure: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sugar Level (mg/dL)</label>
                <input
                  type="number"
                  required
                  value={formData.sugarLevel}
                  onChange={e => setFormData({ ...formData, sugarLevel: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">BMI</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  value={formData.bmi}
                  onChange={e => setFormData({ ...formData, bmi: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  required
                  value={formData.cholesterolLevel}
                  onChange={e => setFormData({ ...formData, cholesterolLevel: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Lifestyle & History */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Heart size={14} /> Lifestyle & History
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border border-slate-100 rounded-2xl bg-slate-50 cursor-pointer group hover:border-blue-200 transition-all">
                <input
                  type="checkbox"
                  checked={formData.smokingHabit}
                  onChange={e => setFormData({ ...formData, smokingHabit: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">Smoking Habit</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-slate-100 rounded-2xl bg-slate-50 cursor-pointer group hover:border-blue-200 transition-all">
                <input
                  type="checkbox"
                  checked={formData.heartDiseaseHistory}
                  onChange={e => setFormData({ ...formData, heartDiseaseHistory: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">Heart Disease History</span>
              </label>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {patient ? 'Update Record' : 'Save Patient Record'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
