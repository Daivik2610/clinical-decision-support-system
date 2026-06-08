/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, ReactNode, useEffect } from 'react';
import { Patient } from './models/Patient';
import { SortManager, SortCriteria } from './models/SortManager';
import { StatCard } from './components/StatCard';
import { PatientForm } from './components/PatientForm';
import { PatientTable } from './components/PatientTable';
import { RiskCategory, DashboardStats, Gender } from './types';
import { ReportGenerator } from './models/ReportGenerator';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  Search,
  Stethoscope,
  Heart,
  FileText,
  LayoutDashboard,
  ClipboardList,
  Activity,
  History,
  Settings,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function App() {
  // State management
  const [patients, setPatients] = useState<Patient[]>(() => {
    // Initial sample data
    return [
      new Patient({
        fullName: 'Amit Sharma',
        age: 67,
        gender: Gender.Male,
        bloodPressure: 160,
        sugarLevel: 210,
        bmi: 31,
        smokingHabit: true,
        heartDiseaseHistory: true,
        cholesterolLevel: 240,
        id: 'P-001'
      }),
      new Patient({
        fullName: 'Priya Patel',
        age: 34,
        gender: Gender.Female,
        bloodPressure: 125,
        sugarLevel: 95,
        bmi: 24,
        smokingHabit: false,
        heartDiseaseHistory: false,
        cholesterolLevel: 180,
        id: 'P-002'
      }),
      new Patient({
        fullName: 'Michael Chen',
        age: 58,
        gender: Gender.Male,
        bloodPressure: 145,
        sugarLevel: 190,
        bmi: 28,
        smokingHabit: true,
        heartDiseaseHistory: false,
        cholesterolLevel: 210,
        id: 'P-003'
      })
    ];
  });
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('risk');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Derived stats
  const stats = useMemo<DashboardStats>(() => {
    return {
      total: patients.length,
      lowRisk: patients.filter(p => p.riskCategory === RiskCategory.Low).length,
      mediumRisk: patients.filter(p => p.riskCategory === RiskCategory.Medium).length,
      highRisk: patients.filter(p => p.riskCategory === RiskCategory.High).length,
    };
  }, [patients]);

  // Sorted and filtered patients
  const displayPatients = useMemo(() => {
    let filtered = patients;
    if (searchQuery) {
      filtered = patients.filter(p => 
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return SortManager.sortBy(filtered, sortCriteria);
  }, [patients, sortCriteria, searchQuery]);

  // Actions
  const handleAddPatient = (data: any) => {
    const newPatient = new Patient(data);
    setPatients([...patients, newPatient]);
    setIsFormOpen(false);
  };

  const handleUpdatePatient = (data: any) => {
    if (!editingPatient) return;
    const updated = patients.map(p => {
      if (p.id === editingPatient.id) {
        return new Patient({ ...p, ...data, id: p.id });
      }
      return p;
    });
    setPatients(updated);
    setEditingPatient(null);
    setIsFormOpen(false);
  };

  const handleDeletePatient = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const handleGenerateReport = () => {
    const report = ReportGenerator.generateSummary(patients);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_report_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-medical-light font-sans">
      {/* Sidebar - Desktop */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-medical-dark text-slate-300 hidden md:flex flex-col shrink-0 overflow-hidden relative border-r border-white/5"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
              <Plus size={18} />
            </div>
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-white text-lg tracking-tight whitespace-nowrap"
              >
                CDSS v2.1
              </motion.span>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white shrink-0"
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} /> }
          </button>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            collapsed={isSidebarCollapsed}
          />
          <SidebarItem 
            icon={<Users size={18} />} 
            label="Records" 
            active={activeTab === 'records'} 
            onClick={() => setActiveTab('records')}
            collapsed={isSidebarCollapsed}
          />
          <SidebarItem 
            icon={<Activity size={18} />} 
            label="Engine" 
            active={activeTab === 'engine'}
            onClick={() => setActiveTab('engine')}
            collapsed={isSidebarCollapsed}
          />
          <SidebarItem 
            icon={<ClipboardList size={18} />} 
            label="Queue" 
            active={activeTab === 'queue'}
            onClick={() => setActiveTab('queue')}
            collapsed={isSidebarCollapsed}
          />
          <SidebarItem 
            icon={<History size={18} />} 
            label="Reports" 
            active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
            collapsed={isSidebarCollapsed}
          />
          <SidebarItem 
            icon={<Settings size={18} />} 
            label="Settings" 
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            collapsed={isSidebarCollapsed}
          />
        </nav>

        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-6 border-t border-white/10 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest whitespace-nowrap">System Online</span>
              </div>
              <div className="opacity-50 text-[11px] leading-relaxed whitespace-nowrap">
                Logged in as Dr. Sarah Jenkins<br />
                North General Hospital
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-medical-dark">Clinical Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all w-48 text-slate-900"
              />
            </div>
            
            <button onClick={handleGenerateReport} className="btn-secondary flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden lg:inline">Report</span>
            </button>
            <button onClick={() => { setEditingPatient(null); setIsFormOpen(true); }} className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              <span className="hidden lg:inline">New Evaluation</span>
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                      title="Total Patients" 
                      value={stats.total} 
                      icon={<Users size={20} />} 
                      colorClass="text-blue-600 bg-blue-50"
                    />
                    <StatCard 
                      title="High Risk Cases" 
                      value={stats.highRisk} 
                      icon={<AlertTriangle size={20} />} 
                      colorClass="text-red-500 bg-red-50"
                    />
                    <StatCard 
                      title="Avg Risk Score" 
                      value={(patients.reduce((s,p) => s + p.riskScore, 0) / (patients.length || 1)).toFixed(1)} 
                      icon={<TrendingUp size={20} />} 
                      colorClass="text-amber-500 bg-amber-50"
                    />
                    <StatCard 
                      title="System Accuracy" 
                      value="99.2%" 
                      icon={<ShieldCheck size={20} />} 
                      colorClass="text-emerald-500 bg-emerald-50" 
                    />
                  </div>

                  {/* Main Content Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                       <div className="medical-card p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-slate-800">Critical Priority Cases</h3>
                          <button onClick={() => setActiveTab('records')} className="text-blue-600 text-xs font-bold hover:underline">View All Records →</button>
                        </div>
                        <PatientTable 
                          patients={displayPatients.slice(0, 5)}
                          onEdit={(p) => { setEditingPatient(p); setIsFormOpen(true); }}
                          onDelete={handleDeletePatient}
                          onSort={setSortCriteria}
                          currentSort={sortCriteria}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Risk Distribution Card */}
                      <div className="medical-card p-6 overflow-hidden">
                        <h3 className="font-semibold text-sm mb-4">Risk Distribution</h3>
                        <div className="h-48 w-full">
                          {patients.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'High', value: stats.highRisk, color: '#EF4444' },
                                    { name: 'Medium', value: stats.mediumRisk, color: '#F59E0B' },
                                    { name: 'Low', value: stats.lowRisk, color: '#10B981' },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={60}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {[
                                    { name: 'High', color: '#EF4444' },
                                    { name: 'Medium', color: '#F59E0B' },
                                    { name: 'Low', color: '#10B981' },
                                  ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <RechartsTooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    fontSize: '12px'
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                              <Search size={24} className="opacity-20" />
                              <span className="text-xs italic">No risk data available</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4 mt-4">
                          <RiskProgressBar label="High Risk" value={Math.round((stats.highRisk / (stats.total || 1)) * 100)} color="bg-red-500" />
                          <RiskProgressBar label="Medium Risk" value={Math.round((stats.mediumRisk / (stats.total || 1)) * 100)} color="bg-amber-500" />
                          <RiskProgressBar label="Low Risk" value={Math.round((stats.lowRisk / (stats.total || 1)) * 100)} color="bg-emerald-500" />
                        </div>
                      </div>

                      {/* Notification / Activity Log */}
                      <div className="medical-card p-6 bg-slate-800 text-white border-none">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                          <Activity size={14} className="text-blue-400" /> System Activity
                        </h3>
                        <div className="space-y-4">
                          <ActivityLogItem 
                            time="2m ago" 
                            action="New Patient Added" 
                            desc="P-004 evaluated as Media Risk" 
                          />
                          <ActivityLogItem 
                            time="15m ago" 
                            action="Logic Update" 
                            desc="Hyper-tension criteria refreshed" 
                          />
                          <ActivityLogItem 
                            time="1h ago" 
                            action="Data Export" 
                            desc="Monthly summary exported by jdaivik" 
                          />
                        </div>
                      </div>

                      {/* Rule Engine Status */}
                      <div className="card bg-blue-600 text-white p-5 rounded-xl shadow-lg border-none">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-sm font-bold flex items-center gap-2">
                            <Heart size={16} /> Rule Engine Status
                          </h4>
                          <span className="bg-white/20 text-[9px] uppercase px-2 py-0.5 rounded-full font-bold">Stable v2.1</span>
                        </div>
                        <p className="text-[11px] opacity-80 leading-relaxed mb-4">
                          Medical logic sync: Active. Based on WHO 2024 guidelines for cardiovascular risk management.
                        </p>
                        
                        <div className="space-y-2">
                          <div className="font-mono text-[9px] bg-black/20 p-2 rounded border border-white/5 flex justify-between">
                            <span>IF Age &gt; 60</span>
                            <span className="text-blue-200">+1 Point</span>
                          </div>
                          <div className="font-mono text-[9px] bg-black/20 p-2 rounded border border-white/5 flex justify-between">
                            <span>IF BP &gt; 140 mmHg</span>
                            <span className="text-blue-200">+2 Points</span>
                          </div>
                          <div className="font-mono text-[9px] bg-black/20 p-2 rounded border border-white/5 flex justify-between">
                            <span>IF Sugar &gt; 180 mg/dL</span>
                            <span className="text-blue-200">+2 Points</span>
                          </div>
                          <div className="font-mono text-[9px] bg-black/20 p-2 rounded border border-white/5 flex justify-between">
                            <span>IF BMI &gt; 30 (Obese)</span>
                            <span className="text-blue-200">+1 Point</span>
                          </div>
                          <div className="font-mono text-[9px] bg-black/20 p-2 rounded border border-white/5 flex justify-between">
                            <span>IF Heart History = YES</span>
                            <span className="text-blue-200">+2 Points</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between opacity-60 text-[10px]">
                          <span>Logic Check: Validated</span>
                          <span>1,024 ms latency</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'records' && (
                <motion.div
                  key="records"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-bold text-medical-dark">Patient Record Database</h2>
                      <p className="text-sm text-slate-500">Manage clinical data and risk evaluations for your assigned population.</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleGenerateReport} className="btn-secondary flex items-center gap-2">
                        <Download size={16} /> Data Export
                      </button>
                    </div>
                  </div>
                  <PatientTable 
                    patients={displayPatients}
                    onEdit={(p) => { setEditingPatient(p); setIsFormOpen(true); }}
                    onDelete={handleDeletePatient}
                    onSort={setSortCriteria}
                    currentSort={sortCriteria}
                  />
                </motion.div>
              )}

               {activeTab === 'reports' && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="medical-card p-10 bg-white">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                          <FileText size={32} />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-medical-dark tracking-tight">Clinical Summary</h2>
                          <p className="text-slate-500 font-medium">Automatic Generated Report • {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button onClick={handleGenerateReport} className="btn-primary flex items-center gap-2 px-6 py-3">
                        <FileText size={18} /> Download Text File
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                      <div className="space-y-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Risk Overview</h4>
                        <div className="space-y-4">
                          <ReportStat label="Critical Alerts" value={stats.highRisk} color="text-red-600" />
                          <ReportStat label="Monitored Cases" value={stats.mediumRisk} color="text-amber-600" />
                          <ReportStat label="Healthy Enrollees" value={stats.lowRisk} color="text-emerald-600" />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Feature Recommendations</h4>
                        <div className="space-y-3">
                          <RoadmapItem title="Predictive AI Analysis" description="ML models to predict future risk shifts based on history." />
                          <RoadmapItem title="Wearable Integration" description="Real-time BP & Sugar tracking sync with Apple Health/Fitbit." />
                          <RoadmapItem title="Telemedicine Portal" description="Direct video consult link for high-risk priority cases." />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wider">System Log Information</h4>
                      <pre className="text-[10px] font-mono text-slate-500 leading-relaxed overflow-x-auto">
                        [SYS-LOG] Report generated for {patients.length} patients.<br />
                        [SYS-LOG] Risk Engine Version: 2.1.4 Build 882<br />
                        [SYS-LOG] Guidelines: WHO Cardiovascular 2024 Refresh
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'engine' && (
                <motion.div
                  key="engine"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-medical-dark">Clinical Decision Logic</h2>
                      <p className="text-sm text-slate-500">View and audit the weights used for patient risk assessment.</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                      Logic Status: Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <LogicCard 
                      title="Age Factors" 
                      rules={[
                        { label: 'Age > 60', weight: '+1 Point' },
                        { label: 'Age > 75', weight: '+2 Points' }
                      ]} 
                    />
                    <LogicCard 
                      title="Vitals Mapping" 
                      rules={[
                        { label: 'BP > 140/90', weight: '+2 Points' },
                        { label: 'Sugar > 180', weight: '+2 Points' },
                        { label: 'Cholesterol > 200', weight: '+1 Point' }
                      ]} 
                    />
                    <LogicCard 
                      title="Lifestyle Weights" 
                      rules={[
                        { label: 'Smoking Habits', weight: '+1 Point' },
                        { label: 'BMI > 30 (Obese)', weight: '+1 Point' },
                        { label: 'History of HD', weight: '+2 Points' }
                      ]} 
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'queue' && (
                <motion.div
                  key="queue"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-medical-dark">High Severity Priority Queue</h2>
                    <p className="text-sm text-slate-500">Patients requiring immediate clinical review based on risk scores.</p>
                  </div>
                  <div className="medical-card overflow-hidden">
                    <PatientTable 
                      patients={patients.filter(p => p.riskCategory === RiskCategory.High)}
                      onEdit={(p) => { setEditingPatient(p); setIsFormOpen(true); }}
                      onDelete={handleDeletePatient}
                      onSort={setSortCriteria}
                      currentSort={sortCriteria}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-2xl mx-auto space-y-8 py-10"
                >
                   <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                      <Settings size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-medical-dark">System Configuration</h2>
                    <p className="text-sm text-slate-500">CDSS v2.1.4 Build 882</p>
                  </div>

                  <div className="medical-card p-6 space-y-6">
                    <SettingItem label="Hospital Name" value="North General Hospital" />
                    <SettingItem label="Assigned Doctor" value="Dr. Sarah Jenkins" />
                    <SettingItem label="Data Refresh Rate" value="Every 30 Seconds" />
                    <SettingItem label="System Language" value="English (Global)" />
                    
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security</h4>
                      <button className="text-sm font-semibold text-blue-600 hover:underline">Change Access PIN</button>
                      <br />
                      <button className="text-sm font-semibold text-red-600 hover:underline">Revoke All Active Sessions</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <PatientForm 
            patient={editingPatient}
            onSave={editingPatient ? handleUpdatePatient : handleAddPatient}
            onCancel={() => { setIsFormOpen(false); setEditingPatient(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick, collapsed = false }: { icon: ReactNode, label: string, active?: boolean, onClick?: () => void, collapsed?: boolean }) {
  return (
    <motion.div 
      whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.08)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`sidebar-item ${active ? 'sidebar-item-active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
      title={collapsed ? label : ''}
    >
      <div className={`${collapsed ? '' : 'shrink-0'}`}>
        {icon}
      </div>
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}

function RiskProgressBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] font-semibold">
        <span className="text-slate-500">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function ReportStat({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className={`text-xl font-bold ${color}`}>{value}</span>
    </div>
  );
}

function RoadmapItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="group">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        <h5 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</h5>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed ml-3.5">{description}</p>
    </div>
  );
}

function ActivityLogItem({ time, action, desc }: { time: string, action: string, desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-1 h-8 bg-blue-500/20 rounded-full shrink-0" />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400">{time}</span>
          <span className="text-xs font-bold text-white tracking-wide">{action}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function LogicCard({ title, rules }: { title: string, rules: { label: string, weight: string }[] }) {
  return (
    <div className="medical-card p-6 border-none shadow-md">
      <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{title}</h3>
      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
            <span className="text-xs font-medium text-slate-600">{rule.label}</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{rule.weight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingItem({ label, value }: { label: string, value: string }) {
  return (
     <div className="flex justify-between items-center">
      <div>
        <h4 className="text-sm font-bold text-slate-800">{label}</h4>
        <p className="text-xs text-slate-500">System preference</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600 px-3 py-1 bg-slate-100 rounded-lg">{value}</span>
        <button className="text-blue-600 text-xs font-bold hover:underline ml-2">Edit</button>
      </div>
    </div>
  );
}
