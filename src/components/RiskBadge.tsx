/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RiskCategory } from '../types';

interface RiskBadgeProps {
  category: RiskCategory;
}

export function RiskBadge({ category }: RiskBadgeProps) {
  const styles = {
    [RiskCategory.High]: 'bg-red-100 text-red-700 border-red-200',
    [RiskCategory.Medium]: 'bg-amber-100 text-amber-700 border-amber-200',
    [RiskCategory.Low]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[category]}`}>
      {category}
    </span>
  );
}
