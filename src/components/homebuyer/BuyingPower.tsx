'use client';

import { DollarSign, CreditCard } from 'lucide-react';

interface BuyingPowerProps {
  income: number;
  debt: number;
}

export function BuyingPower({ income, debt }: BuyingPowerProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-6 shadow-lg border border-neutral-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-xs text-neutral-600">Annual Income</p>
          <p className="text-lg font-semibold text-neutral-900">
            ${income.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="w-px h-10 bg-neutral-200" />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <p className="text-xs text-neutral-600">Monthly Debt</p>
          <p className="text-lg font-semibold text-neutral-900">
            ${debt.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
