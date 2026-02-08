'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, DollarSign, Calendar, MapPin } from 'lucide-react';

interface AirbnbPotential {
  estimatedNightlyRate: number;
  estimatedOccupancyRate: number;
  monthlyRevenue: number;
  annualRevenue: number;
  additionalExpenses: {
    cleaning: number;
    supplies: number;
    utilities: number;
    management: number;
    total: number;
  };
  netMonthlyIncome: number;
  vsLongTermRental: number;
  tourismScore: number;
  marketDemand: 'High' | 'Moderate' | 'Low';
  notes: string;
}

interface AirbnbPotentialPanelProps {
  airbnbData: AirbnbPotential;
  longTermRentalIncome?: number;
}

export function AirbnbPotentialPanel({ airbnbData, longTermRentalIncome }: AirbnbPotentialPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const getTourismScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const isMoreProfitable = airbnbData.vsLongTermRental > 0;

  return (
    <div className="bg-gradient-to-br from-[#FF5A5F]/5 to-[#FF5A5F]/10 rounded-xl border-2 border-[#FF5A5F]/30 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-[#FF5A5F]/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF5A5F] rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl">🏠</span>
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-neutral-900" style={{ fontFamily: 'Circular, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Airbnb Potential Analysis
            </h3>
            <p className="text-sm text-neutral-600">Short-term rental opportunity assessment</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-[#FF5A5F]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#FF5A5F]" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* Tourism Score & Market Demand */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-[#FF5A5F]" />
                <span className="text-sm text-neutral-600">Tourism Score</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${getTourismScoreColor(airbnbData.tourismScore)}`}>
                  {airbnbData.tourismScore}
                </span>
                <span className="text-neutral-500">/100</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[#FF5A5F]" />
                <span className="text-sm text-neutral-600">Market Demand</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getDemandColor(airbnbData.marketDemand)}`}>
                {airbnbData.marketDemand}
              </span>
            </div>
          </div>

          {/* Revenue Projections */}
          <div className="bg-white rounded-lg p-5 border border-neutral-200">
            <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#FF5A5F]" />
              Revenue Projections
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Estimated Nightly Rate</span>
                <span className="text-lg font-bold text-[#FF5A5F]">
                  ${airbnbData.estimatedNightlyRate.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Estimated Occupancy Rate</span>
                <span className="font-semibold text-neutral-900">
                  {airbnbData.estimatedOccupancyRate}%
                </span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
                <span className="text-neutral-700">Monthly Revenue</span>
                <span className="text-xl font-bold text-green-600">
                  ${airbnbData.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Annual Revenue</span>
                <span className="text-lg font-semibold text-green-600">
                  ${airbnbData.annualRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Expenses */}
          <div className="bg-white rounded-lg p-5 border border-neutral-200">
            <h4 className="font-bold text-neutral-900 mb-4">Additional Airbnb Expenses</h4>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-600">🧹 Cleaning</span>
                <span className="font-semibold">${airbnbData.additionalExpenses.cleaning.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-600">🧴 Supplies</span>
                <span className="font-semibold">${airbnbData.additionalExpenses.supplies.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-600">💡 Utilities</span>
                <span className="font-semibold">${airbnbData.additionalExpenses.utilities.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-600">🏢 Management (20%)</span>
                <span className="font-semibold">${airbnbData.additionalExpenses.management.toLocaleString()}/mo</span>
              </div>
            </div>
            <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
              <span className="font-bold text-neutral-900">Total Monthly Expenses</span>
              <span className="text-lg font-bold text-red-600">
                ${airbnbData.additionalExpenses.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Net Income Comparison */}
          <div className={`rounded-lg p-5 border-2 ${isMoreProfitable ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
            <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Net Income Comparison
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Airbnb Net Monthly Income</span>
                <span className="text-xl font-bold text-green-600">
                  ${airbnbData.netMonthlyIncome.toLocaleString()}
                </span>
              </div>
              {longTermRentalIncome && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Long-term Rental Income</span>
                  <span className="text-lg font-semibold text-neutral-900">
                    ${longTermRentalIncome.toLocaleString()}
                  </span>
                </div>
              )}
              <div className={`pt-3 border-t ${isMoreProfitable ? 'border-green-300' : 'border-orange-300'} flex justify-between items-center`}>
                <span className="font-bold text-neutral-900">Difference</span>
                <span className={`text-2xl font-bold ${isMoreProfitable ? 'text-green-600' : 'text-orange-600'}`}>
                  {isMoreProfitable ? '+' : ''}${airbnbData.vsLongTermRental.toLocaleString()}/mo
                </span>
              </div>
              {isMoreProfitable ? (
                <p className="text-sm text-green-700 bg-green-100 p-3 rounded-lg">
                  ✅ Airbnb could generate <strong>${Math.abs(airbnbData.vsLongTermRental).toLocaleString()}</strong> more per month than long-term rental
                </p>
              ) : (
                <p className="text-sm text-orange-700 bg-orange-100 p-3 rounded-lg">
                  ⚠️ Long-term rental may be more profitable by <strong>${Math.abs(airbnbData.vsLongTermRental).toLocaleString()}</strong> per month
                </p>
              )}
            </div>
          </div>

          {/* Analysis Notes */}
          <div className="bg-white rounded-lg p-5 border border-neutral-200">
            <h4 className="font-bold text-neutral-900 mb-3">📝 Analysis Notes</h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {airbnbData.notes}
            </p>
          </div>

          {/* Airbnb Branding Footer */}
          <div className="text-center pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500">
              Analysis powered by William's investment expertise
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Airbnb® is a registered trademark of Airbnb, Inc.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
