'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  PiggyBank,
  Home,
  BarChart3,
  Lightbulb,
  Shield
} from 'lucide-react';
import { AIAnalysisResult } from '@/lib/propertyAnalysis';

interface AIInsightsPanelProps {
  analysis: AIAnalysisResult;
  isLoading?: boolean;
}

export function AIInsightsPanel({ analysis, isLoading }: AIInsightsPanelProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-600">Generating AI insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      {analysis.keyInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-neutral-900">Key Insights</h3>
          </div>
          <div className="space-y-2">
            {analysis.keyInsights.map((insight, index) => (
              <p key={index} className="text-neutral-700 text-sm leading-relaxed">
                {insight}
              </p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-orange-50 rounded-xl border-2 border-orange-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-neutral-900">Important Considerations</h3>
          </div>
          <div className="space-y-2">
            {analysis.warnings.map((warning, index) => (
              <p key={index} className="text-neutral-700 text-sm leading-relaxed">
                {warning}
              </p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Financial Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-white rounded-xl border border-neutral-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-neutral-900">Monthly Payment Breakdown</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Principal & Interest</span>
            <span className="font-semibold">
              ${(analysis.financial.monthlyPayment.principal + analysis.financial.monthlyPayment.interest).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Property Tax</span>
            <span className="font-semibold">${analysis.financial.monthlyPayment.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Insurance</span>
            <span className="font-semibold">${analysis.financial.monthlyPayment.insurance.toLocaleString()}</span>
          </div>
          {analysis.financial.monthlyPayment.hoa > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">HOA</span>
              <span className="font-semibold">${analysis.financial.monthlyPayment.hoa.toLocaleString()}</span>
            </div>
          )}
          <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
            <span className="font-bold text-neutral-900">Total Monthly</span>
            <span className="text-2xl font-bold text-green-600">
              ${analysis.financial.monthlyPayment.total.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Down Payment Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-white rounded-xl border border-neutral-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <PiggyBank className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-neutral-900">Down Payment Options</h3>
        </div>
        <div className="grid gap-4">
          {analysis.financial.downPaymentOptions.map((option, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                option.percentage === 20
                  ? 'border-green-300 bg-green-50'
                  : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-lg">{option.percentage}% Down</p>
                  <p className="text-sm text-neutral-600">${option.amount.toLocaleString()}</p>
                </div>
                {option.percentage === 20 && (
                  <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-semibold">
                    Recommended
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-neutral-700">
                  Monthly: <span className="font-semibold">${option.monthlyPayment.toLocaleString()}</span>
                </p>
                {option.pmi > 0 && (
                  <p className="text-orange-600">
                    PMI: ${option.pmi.toLocaleString()}/mo
                  </p>
                )}
                <p className="text-neutral-600 italic">{option.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Closing Costs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-white rounded-xl border border-neutral-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-neutral-900">Closing Costs Estimate</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Loan Origination</span>
            <span className="font-semibold">${analysis.financial.closingCosts.breakdown.loanOrigination.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Appraisal</span>
            <span className="font-semibold">${analysis.financial.closingCosts.breakdown.appraisal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Inspection</span>
            <span className="font-semibold">${analysis.financial.closingCosts.breakdown.inspection.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Title Insurance</span>
            <span className="font-semibold">${analysis.financial.closingCosts.breakdown.titleInsurance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Other Fees</span>
            <span className="font-semibold">${analysis.financial.closingCosts.breakdown.other.toLocaleString()}</span>
          </div>
          <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
            <span className="font-bold text-neutral-900">Total Closing Costs</span>
            <span className="text-xl font-bold text-blue-600">
              ${analysis.financial.closingCosts.estimated.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-neutral-900 mb-1">Total Cash Needed</p>
          <p className="text-3xl font-bold text-blue-600">
            ${analysis.financial.totalCashNeeded.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-600 mt-2">
            Approximately {analysis.financial.monthsOfSavingsRequired} months of savings required
          </p>
        </div>
      </motion.div>

      {/* Investment Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 bg-white rounded-xl border border-neutral-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-neutral-900">Investment Potential</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-neutral-600 mb-1">ROI Potential</p>
            <p className="text-2xl font-bold text-green-600">{analysis.investment.roiPotential}%</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-neutral-600 mb-1">Cap Rate</p>
            <p className="text-2xl font-bold text-blue-600">{analysis.investment.capRate}%</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
          <p className="text-sm font-semibold text-neutral-900 mb-2">Appreciation Forecast</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">1 Year</span>
              <span className="font-semibold">${analysis.investment.appreciationForecast.year1.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">5 Years</span>
              <span className="font-semibold">${analysis.investment.appreciationForecast.year5.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">10 Years</span>
              <span className="font-semibold">${analysis.investment.appreciationForecast.year10.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Market Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-white rounded-xl border border-neutral-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-neutral-900">Market Intelligence</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
            <span className="text-neutral-600">Price per sqft</span>
            <span className="font-bold">${analysis.market.pricePerSqft}/sqft</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
            <span className="text-neutral-600">Market Average</span>
            <span className="font-bold">${analysis.market.marketAvgPricePerSqft}/sqft</span>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm font-semibold text-neutral-900 mb-1">Market Status</p>
            <p className="text-lg font-bold text-indigo-600">{analysis.market.daysOnMarketInsight.status}</p>
            <p className="text-sm text-neutral-600 mt-2">{analysis.market.daysOnMarketInsight.message}</p>
          </div>
        </div>
      </motion.div>

      {/* Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 bg-white rounded-xl border border-neutral-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold text-neutral-900">Risk Assessment</h3>
        </div>
        <div className={`p-4 rounded-lg mb-4 ${
          analysis.risk.overallRisk === 'Low' ? 'bg-green-50' :
          analysis.risk.overallRisk === 'Medium' ? 'bg-yellow-50' : 'bg-red-50'
        }`}>
          <p className="text-sm text-neutral-600 mb-1">Overall Risk Level</p>
          <p className={`text-2xl font-bold ${
            analysis.risk.overallRisk === 'Low' ? 'text-green-600' :
            analysis.risk.overallRisk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {analysis.risk.overallRisk}
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Financial Risk</span>
            <span className="font-semibold">{analysis.risk.financialRisk.score}/100</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Market Risk</span>
            <span className="font-semibold">{analysis.risk.marketRisk.score}/100</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Est. Time to Sell</span>
            <span className="font-semibold">{analysis.risk.liquidityRisk.estimatedTimeToSell} days</span>
          </div>
        </div>
        {analysis.risk.recommendations.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-neutral-900 mb-2">Recommendations</p>
            <ul className="space-y-1">
              {analysis.risk.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-neutral-700 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Negotiation Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-neutral-900">Negotiation Strategy</h3>
        </div>
        <div className="mb-4">
          <p className="text-sm text-neutral-600 mb-1">Suggested Offer Price</p>
          <p className="text-3xl font-bold text-purple-600">
            ${analysis.recommendations.negotiationStrategy.suggestedOffer.toLocaleString()}
          </p>
          <p className="text-sm text-neutral-600 mt-2">{analysis.recommendations.negotiationStrategy.reasoning}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-neutral-900">Negotiation Tactics:</p>
          {analysis.recommendations.negotiationStrategy.tactics.map((tactic, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-neutral-700">
              <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              {tactic}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
