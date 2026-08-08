import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, Heart, Shield, Award, Sparkles, Gem,
  Wrench, Repeat, FileCheck, ArrowLeft, RefreshCw, Send, CheckCircle2,
  AlertTriangle, MessageSquare, ShieldAlert
} from 'lucide-react';
import { customerService } from '../../services/customerService';
import { recommendationService, aiService } from '../../services/aiService';
import { JourneyTimeline } from '../../components/JourneyTimeline';
import { AIRecommendationCard } from '../../components/AIRecommendationCard';
import { StatusBadge } from '../../components/StatusBadge';
import { TIER_COLORS, CHURN_COLORS } from '../../constants';
import { useToast } from '../../context/ToastContext';

export const CustomerDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [generatingNba, setGeneratingNba] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await customerService.getById(id);
      setData(res);
    } catch (err) {
      toast.error('Failed to load profile', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleGenerateNBA = async () => {
    try {
      setGeneratingNba(true);
      await recommendationService.evaluate(id);
      toast.success('AI Recommendation Generated', 'Next Best Action synthesized with deterministic consent rules.');
      fetchProfile();
    } catch (err) {
      toast.error('Evaluation Error', err.message);
    } finally {
      setGeneratingNba(false);
    }
  };

  const handleApprove = async (recId) => {
    await recommendationService.approve(recId);
    fetchProfile();
  };

  const handleReject = async (recId) => {
    await recommendationService.reject(recId);
    fetchProfile();
  };

  const handleOverride = async (recId, overrideData) => {
    await recommendationService.override(recId, overrideData);
    fetchProfile();
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-charcoal-400 animate-pulse">
        Loading luxury 360° customer intelligence...
      </div>
    );
  }

  const { customer, preferences, consents, activeJourney, interactions, sales, certificates, repairs, exchanges, serviceTickets, aiInsights } = data;

  const churnPct = Math.round((aiInsights?.churnRisk || 0.15) * 100);
  const propPct = Math.round((aiInsights?.propensityScore || 0.85) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customers')}
            className="p-2 rounded-xl bg-white hover:bg-aurum-50 border border-aurum-200 text-charcoal-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-serif text-charcoal-900">
                {customer.first_name} {customer.last_name}
              </h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${TIER_COLORS[customer.tier]}`}>
                {customer.tier}
              </span>
              <StatusBadge status={customer.status} />
            </div>
            <div className="text-xs text-charcoal-500 mt-1 flex items-center gap-4">
              <span>{customer.email}</span>
              <span>•</span>
              <span>{customer.phone}</span>
              <span>•</span>
              <span>Salon: {customer.store_name || 'Mumbai Flagship'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateNBA}
          disabled={generatingNba}
          className="px-4 py-2.5 bg-gradient-to-r from-aurum-400 to-aurum-600 hover:from-aurum-500 hover:to-aurum-700 text-white font-bold rounded-xl shadow-luxury hover:shadow-luxury-hover transition flex items-center gap-2 text-xs"
        >
          <Sparkles className="w-4 h-4" />
          {generatingNba ? 'Evaluating Gemini AI...' : 'Generate Next Best Action'}
        </button>
      </div>

      {/* 10-Stage Journey Timeline Stepper */}
      {activeJourney && (
        <JourneyTimeline
          stages={activeJourney.stages}
          currentStage={activeJourney.current_stage}
          onStageClick={(stage) => navigate(`/journeys/${activeJourney.id}`)}
        />
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">Total Lifetime Spend</span>
          <div className="text-xl font-bold text-charcoal-900 font-serif mt-1">
            ₹{Number(customer.total_spend || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">AI Churn Risk Probability</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xl font-bold font-serif ${churnPct > 60 ? 'text-rose-700' : churnPct > 30 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {churnPct}%
            </span>
            <span className="text-[10px] text-charcoal-500">({aiInsights?.churnLabel})</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">Conversion Propensity</span>
          <div className="text-xl font-bold text-emerald-700 font-serif mt-1">
            {propPct}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">Open Service Tickets</span>
          <div className="text-xl font-bold text-charcoal-900 font-serif mt-1">
            {serviceTickets.length} Active
          </div>
        </div>
      </div>

      {/* AI Next Best Action Recommendation Banner */}
      {aiInsights?.recentRecommendations?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold font-serif text-charcoal-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-aurum-500" />
            Active AI Governance Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.recentRecommendations.map(rec => (
              <AIRecommendationCard
                key={rec.id}
                recommendation={rec}
                onApprove={handleApprove}
                onReject={handleReject}
                onOverride={handleOverride}
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-aurum-200 flex items-center gap-6 text-xs font-semibold overflow-x-auto">
        {[
          { key: 'overview', label: 'Preferences & Consents' },
          { key: 'interactions', label: `Interactions (${interactions.length})` },
          { key: 'sales', label: `Purchases & Sales (${sales.length})` },
          { key: 'certificates', label: `GIA Certificates (${certificates.length})` },
          { key: 'repairs', label: `Atelier Repairs (${repairs.length})` },
          { key: 'exchanges', label: `Lifetime Exchanges (${exchanges.length})` },
          { key: 'tickets', label: `Service Tickets (${serviceTickets.length})` }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`pb-3 transition-colors relative whitespace-nowrap ${
              activeTab === t.key ? 'text-aurum-700 font-bold' : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            {t.label}
            {activeTab === t.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-aurum-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Preferences Box */}
          <div className="bg-white p-6 rounded-2xl border border-aurum-200 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-sm text-charcoal-900">
              Jewellery Taste & Sizing Profile
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-charcoal-400">Preferred Metal:</span>
                <div className="font-bold text-charcoal-800 mt-0.5">{preferences.preferred_metal || '18K Yellow Gold'}</div>
              </div>
              <div>
                <span className="text-charcoal-400">Ring Size:</span>
                <div className="font-bold text-charcoal-800 mt-0.5">{preferences.ring_size || '14 (Indian)'}</div>
              </div>
              <div>
                <span className="text-charcoal-400">Favorite Gemstone:</span>
                <div className="font-bold text-charcoal-800 mt-0.5">{preferences.favorite_gemstone || 'Natural Solitaire'}</div>
              </div>
              <div>
                <span className="text-charcoal-400">Preferred Cut:</span>
                <div className="font-bold text-charcoal-800 mt-0.5">{preferences.diamond_cut_preference || 'Round Brilliant'}</div>
              </div>
              <div>
                <span className="text-charcoal-400">Spouse Name:</span>
                <div className="font-bold text-charcoal-800 mt-0.5">{preferences.spouse_name || 'Not Provided'}</div>
              </div>
              <div>
                <span className="text-charcoal-400">Anniversary:</span>
                <div className="font-bold text-charcoal-800 mt-0.5">{preferences.anniversary_date || 'Not Provided'}</div>
              </div>
            </div>
          </div>

          {/* Regulatory Consents Box */}
          <div className="bg-white p-6 rounded-2xl border border-aurum-200 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-sm text-charcoal-900">
              Omnichannel Consents & Frequency Caps
            </h4>
            <div className="divide-y divide-gray-100">
              {consents.map(c => (
                <div key={c.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-charcoal-800 uppercase">{c.channel}</span>
                    <div className="text-[10px] text-charcoal-400">
                      Cap: {c.messages_sent_this_week}/{c.weekly_frequency_cap || 3} msgs this week
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    c.is_consented ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}>
                    {c.is_consented ? 'Consented' : 'Opted-Out'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactions Tab */}
      {activeTab === 'interactions' && (
        <div className="bg-white rounded-2xl border border-aurum-200 shadow-sm p-6 divide-y divide-gray-100">
          {interactions.map(int => (
            <div key={int.id} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-charcoal-900 text-sm">{int.subject}</span>
                  <span className="uppercase font-semibold text-[10px] bg-aurum-100 text-aurum-800 px-2 py-0.5 rounded-md">
                    {int.channel}
                  </span>
                  <StatusBadge status={int.sentiment} />
                </div>
                <span className="text-[11px] text-charcoal-400">
                  {new Date(int.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">{int.raw_content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && (
        <div className="bg-white rounded-2xl border border-aurum-200 shadow-sm p-6 divide-y divide-gray-100">
          {sales.map(s => (
            <div key={s.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-charcoal-900 text-sm">{s.invoice_number}</div>
                <div className="text-charcoal-500 mt-0.5">{s.payment_method} • {new Date(s.sale_date).toLocaleDateString()}</div>
              </div>
              <div className="font-bold text-charcoal-900 text-base">
                ₹{Number(s.total_amount).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map(cert => (
            <div key={cert.id} className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-charcoal-900 font-serif">{cert.certificate_authority} Report</span>
                <span className="font-mono text-aurum-700 font-bold">{cert.certificate_number}</span>
              </div>
              <p className="text-charcoal-700 font-semibold">{cert.item_title}</p>
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100 text-[11px]">
                <div><span className="text-charcoal-400">Carat:</span> <div className="font-bold">{cert.carat_weight} ct</div></div>
                <div><span className="text-charcoal-400">Color:</span> <div className="font-bold">{cert.color_grade}</div></div>
                <div><span className="text-charcoal-400">Clarity:</span> <div className="font-bold">{cert.clarity_grade}</div></div>
                <div><span className="text-charcoal-400">Cut:</span> <div className="font-bold">{cert.cut_grade}</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Repairs Tab */}
      {activeTab === 'repairs' && (
        <div className="bg-white rounded-2xl border border-aurum-200 shadow-sm p-6 divide-y divide-gray-100">
          {repairs.map(rep => (
            <div key={rep.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-charcoal-900 text-sm">{rep.item_description}</div>
                <div className="text-charcoal-500 mt-0.5">{rep.issue_type} • Promised: {rep.promised_date}</div>
              </div>
              <StatusBadge status={rep.status} />
            </div>
          ))}
        </div>
      )}

      {/* Exchanges Tab */}
      {activeTab === 'exchanges' && (
        <div className="bg-white rounded-2xl border border-aurum-200 shadow-sm p-6 divide-y divide-gray-100">
          {exchanges.map(ex => (
            <div key={ex.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-charcoal-900 text-sm">{ex.original_item_description}</div>
                <div className="text-charcoal-500 mt-0.5">Trade-in: ₹{Number(ex.trade_in_allowance).toLocaleString('en-IN')}</div>
              </div>
              <StatusBadge status={ex.status} />
            </div>
          ))}
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-2xl border border-aurum-200 shadow-sm p-6 divide-y divide-gray-100">
          {serviceTickets.map(tkt => (
            <div
              key={tkt.id}
              onClick={() => navigate(`/tickets/${tkt.id}`)}
              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-xs hover:bg-aurum-50/50 cursor-pointer transition p-2 rounded-xl"
            >
              <div>
                <div className="font-bold text-charcoal-900 text-sm">{tkt.ticket_number}: {tkt.subject}</div>
                <div className="text-charcoal-500 mt-0.5">{tkt.category} • Due: {new Date(tkt.due_date).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={tkt.priority} />
                <StatusBadge status={tkt.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
