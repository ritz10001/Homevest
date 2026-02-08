import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function InvestorDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center border border-primary-100">
        <div className="w-20 h-20 bg-linear-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
          Investor Dashboard
        </h1>
        <p className="text-xl text-primary-600 mb-6 font-semibold">
          Coming Soon
        </p>
        <p className="text-neutral-600 mb-8 leading-relaxed">
          The investor dashboard is not available in this release. This feature will be enabled in a future update with tools for property analysis, portfolio management, and investment insights.
        </p>
        <Button asChild size="lg">
          <a href="/">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </a>
        </Button>
      </div>
    </div>
  );
}
