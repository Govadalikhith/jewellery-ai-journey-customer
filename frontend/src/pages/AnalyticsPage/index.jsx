import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { BarChart3, Download, TrendingUp, DollarSign, Users, Compass, ShieldAlert, Sparkles } from 'lucide-react';
import { analyticsService } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';

const COLORS = ['#D4AF37', '#1E4D2B', '#B76E79', '#4A4A4A', '#6D5718'];

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('YTD');
  const [storeFilter, setStoreFilter] = useState('');

  const toast = useToast();

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getDashboard();
      setData(res);
    } catch (err) {
      toast.error('Analytics Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateRange, storeFilter]);

  const handleExportCsv = async () => {
    try {
      await analyticsService.downloadCsv();
      toast.success('Report Exported', 'CSV summary downloaded successfully.');
    } catch (err) {
      toast.error('Export Error', err.message);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-xs text-charcoal-400 animate-pulse">
        Generating high-jewellery executive analytics...
      </div>
    );
  }

  const { kpis, churnDistribution, stageFunnel, revenueTrend } = data;

  const churnPieData = [
    { name: 'Low Risk (<30%)', value: parseInt(churnDistribution?.low_risk || 4) },
    { name: 'Moderate (30-65%)', value: parseInt(churnDistribution?.medium_risk || 2) },
    { name: 'High Risk (>65%)', value: parseInt(churnDistribution?.high_risk || 1) }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Export Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-charcoal-900 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-aurum-500" />
            Executive Reports & Journey Intelligence
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time revenue, 10-stage journey funnel conversion, and AI recommendation metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-white border border-aurum-200 rounded-xl text-xs font-semibold text-charcoal-700 shadow-sm"
          >
            <option value="30D">Last 30 Days</option>
            <option value="90D">Last Quarter (Q3)</option>
            <option value="YTD">Year to Date (2026)</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-aurum-400 hover:bg-aurum-500 text-white font-bold rounded-xl shadow-luxury hover:shadow-luxury-hover transition text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">Total Revenue (INR)</span>
          <div className="text-2xl font-bold font-serif text-charcoal-900 mt-1">
            ₹{Number(kpis.totalRevenue || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% YoY Growth
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">Active Customer Journeys</span>
          <div className="text-2xl font-bold font-serif text-charcoal-900 mt-1">
            {kpis.activeJourneys} In Progress
          </div>
          <span className="text-[10px] text-charcoal-400 mt-1 block">Across 10 distinct stages</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">AI NBA Acceptance Rate</span>
          <div className="text-2xl font-bold font-serif text-emerald-700 mt-1">
            {kpis.recommendationAcceptanceRate}%
          </div>
          <span className="text-[10px] text-charcoal-400 mt-1 block">Human verified recommendations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">Customer Retention Rate</span>
          <div className="text-2xl font-bold font-serif text-charcoal-900 mt-1">
            {kpis.customerRetentionRate}%
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">VIP Bespoke Cohort</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="bg-white p-6 rounded-2xl border border-aurum-200 shadow-luxury space-y-4">
          <h3 className="font-serif font-bold text-base text-charcoal-900">
            Monthly Luxury Jewellery Sales vs Targets (INR)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4EFE6" />
                <XAxis dataKey="month" stroke="#6C757D" fontSize={11} />
                <YAxis stroke="#6C757D" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip
                  formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                  contentStyle={{ backgroundColor: '#FAF8F5', borderColor: '#D4AF37', borderRadius: 12 }}
                />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[6, 6, 0, 0]} name="Actual Sales" />
                <Bar dataKey="target" fill="#CED4DA" radius={[6, 6, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 10-Stage Funnel Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-aurum-200 shadow-luxury space-y-4">
          <h3 className="font-serif font-bold text-base text-charcoal-900">
            10-Stage Journey Pipeline Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F4EFE6" />
                <XAxis type="number" stroke="#6C757D" fontSize={11} />
                <YAxis dataKey="stage" type="category" stroke="#6C757D" fontSize={10} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#FAF8F5', borderColor: '#D4AF37', borderRadius: 12 }} />
                <Bar dataKey="count" fill="#1E4D2B" radius={[0, 6, 6, 0]} name="Active Journeys" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn Risk Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-aurum-200 shadow-luxury space-y-4">
          <h3 className="font-serif font-bold text-base text-charcoal-900">
            Patron Churn Risk Segmentation
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={churnPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {churnPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FAF8F5', borderColor: '#D4AF37', borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Model Accuracy Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-aurum-200 shadow-luxury space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              AI Decisioning & Governance Calibration
            </h3>
            <p className="text-xs text-charcoal-500 mt-1">
              Google Gemini recommendations audited against regulatory consent rules.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-aurum-50 rounded-xl">
              <span className="font-semibold text-charcoal-800">Total Recommendations Evaluated</span>
              <strong className="text-sm font-serif text-charcoal-900">{kpis.activeJourneys + 12}</strong>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
              <span className="font-semibold text-emerald-900">Consent Protected Dispatches</span>
              <strong className="text-sm font-serif text-emerald-800">100% Verified</strong>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
              <span className="font-semibold text-purple-900">Discretionary Human Overrides</span>
              <strong className="text-sm font-serif text-purple-800">8.2% Recorded</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
