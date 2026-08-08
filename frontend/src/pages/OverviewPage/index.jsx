import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Users, Compass, Ticket, TrendingUp, AlertTriangle,
  ArrowRight, ShieldCheck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { analyticsService, recommendationService, customerService } from '../../services/aiService';
import { AIRecommendationCard } from '../../components/AIRecommendationCard';
import { StatusBadge } from '../../components/StatusBadge';
import { TIER_COLORS } from '../../constants';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const OverviewPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const loadOverview = async () => {
    try {
      setLoading(true);
      const [dash, recs, custList] = await Promise.all([
        analyticsService.getDashboard(),
        recommendationService.list({ status: 'pending_review', limit: 4 }),
        customerService.list({ limit: 5 })
      ]);
      setDashboard(dash);
      setRecommendations(recs || []);
      setCustomers(custList.data || []);
    } catch (err) {
      toast.error('Dashboard Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleApprove = async (id) => {
    await recommendationService.approve(id);
    loadOverview();
  };

  const handleReject = async (id) => {
    await recommendationService.reject(id);
    loadOverview();
  };

  const handleOverride = async (id, data) => {
    await recommendationService.override(id, data);
    loadOverview();
  };

  if (loading || !dashboard) {
    return (
      <div className="p-12 text-center text-xs text-charcoal-400 animate-pulse">
        Initializing Aurum & Co. High Jewellery Orchestrator...
      </div>
    );
  }

  const { kpis } = dashboard;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-aurum-900 text-white rounded-3xl p-8 shadow-2xl border border-aurum-400/20 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-aurum-400 text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" />
            Executive Intelligence Console
          </div>
          <h2 className="text-3xl font-bold font-serif leading-tight">
            Welcome, {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-xs text-charcoal-300 mt-2 leading-relaxed">
            Orchestrating 360° jewellery client journeys from bespoke CAD drafting to lifetime care. You have <strong className="text-aurum-300">{recommendations.length} AI Next Best Actions</strong> awaiting human review.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold">
            <span>VIP Client Registry</span>
            <Users className="w-4 h-4 text-aurum-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900 mt-1">
            {kpis.totalCustomers}
          </div>
          <span className="text-[10px] text-charcoal-400">High-net-worth patrons</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold">
            <span>Active Journeys</span>
            <Compass className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900 mt-1">
            {kpis.activeJourneys}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Across 10 lifecycle stages</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold">
            <span>Total Sales Value</span>
            <TrendingUp className="w-4 h-4 text-aurum-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900 mt-1">
            ₹{Number(kpis.totalRevenue || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-charcoal-400">{kpis.salesCount} Completed Invoices</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold">
            <span>Active Tickets</span>
            <Ticket className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-rose-700 mt-1">
            {kpis.activeTickets}
          </div>
          <span className="text-[10px] text-rose-700 font-semibold">{kpis.urgentTickets} Urgent Overdue</span>
        </div>
      </div>

      {/* AI Recommendations Queue (HITL) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-aurum-500" />
              Pending Human Review Queue (Next Best Actions)
            </h3>
            <p className="text-xs text-charcoal-500">
              AI suggestions strictly held until verified by authorized personnel.
            </p>
          </div>
          <button
            onClick={() => navigate('/consent-governance')}
            className="text-xs font-semibold text-aurum-700 hover:text-aurum-900 flex items-center gap-1 transition"
          >
            Inspect Governance Rules →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.length === 0 ? (
            <div className="col-span-2 p-8 text-center text-xs text-charcoal-400 bg-white rounded-2xl border border-aurum-200">
              All AI recommendations have been reviewed and dispatched.
            </div>
          ) : (
            recommendations.map(rec => (
              <AIRecommendationCard
                key={rec.id}
                recommendation={rec}
                onApprove={handleApprove}
                onReject={handleReject}
                onOverride={handleOverride}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom Grid: Recent High-Value Customers */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury overflow-hidden">
        <div className="p-6 border-b border-aurum-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-charcoal-900">
            Recent VIP Customer Activity & Churn Risk
          </h3>
          <button
            onClick={() => navigate('/customers')}
            className="text-xs font-semibold text-aurum-700 hover:text-aurum-900 flex items-center gap-1 transition"
          >
            View Complete Directory ({dashboard.kpis.totalCustomers}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aurum-50/80 text-charcoal-600 font-bold uppercase border-b border-aurum-200">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">VIP Tier</th>
                <th className="px-6 py-4">Total Spend</th>
                <th className="px-6 py-4">Churn Risk</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">360 View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map(c => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/customers/${c.id}`)}
                  className="hover:bg-aurum-50/40 cursor-pointer transition"
                >
                  <td className="px-6 py-4 font-bold text-charcoal-900">
                    {c.first_name} {c.last_name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TIER_COLORS[c.tier]}`}>
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-charcoal-900">
                    ₹{Number(c.total_spend || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      c.churn_risk_score > 0.6 ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}>
                      {Math.round((c.churn_risk_score || 0.15) * 100)}%
                    </span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/customers/${c.id}`); }}
                      className="px-3 py-1 bg-aurum-50 hover:bg-aurum-100 text-aurum-800 font-semibold rounded-lg border border-aurum-300 transition text-[11px]"
                    >
                      Open 360 →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
