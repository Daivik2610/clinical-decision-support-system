/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  colorClass: string;
}

export function StatCard({ title, value, icon, trend, colorClass }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
      className="medical-card p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-slate-500 font-medium text-sm">{title}</span>
        <div className={`p-2 rounded-xl scale-90 ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2 text-medical-dark">
        <span className="text-3xl font-bold font-heading">{value}</span>
        {trend && (
          <span className="text-xs text-slate-400 mb-1">{trend}</span>
        )}
      </div>
    </motion.div>
  );
}
