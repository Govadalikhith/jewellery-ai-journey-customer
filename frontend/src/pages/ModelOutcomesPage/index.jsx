import React, { useState, useEffect } from 'react';
import { CheckSquare, ThumbsUp, ThumbsDown, Sparkles, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { recommendationService, analyticsService } from '../../services/aiService';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const ModelOutcomesPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [selectedRecId, setSelectedRecId] = useState('');
  const [selectedScore, setSelectedScore] = useState('helpful');
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await recommendationService.list({ limit: 50 });
      setRecommendations(res || []);
      if (res?.length > 0 && !selectedRecId) {
        setSelectedRecId(res[0].id);
      }
    } catch (err) {
      toast.error('Failed to load outcomes', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRecId) return;
    try {
      await recommendationService.submitFeedback({
        recommendation_id: selectedRecId,
        feedback_score: selectedScore,
        feedback_notes: feedbackNotes
      });
      toast.success('Feedback Recorded', 'Human evaluation stored for AI fine-tuning & calibration.');
      setFeedbackNotes('');
      loadData();
    } catch (err) {
      toast.error('Submission Failed', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-serif text-charcoal-900 flex items-center gap-2.5">
          <CheckSquare className="w-6 h-6 text-aurum-500" />
          Journey Outcomes & Model Feedback Loop
        </h2>
        <p className="text-xs text-charcoal-500 mt-1">
          Tracking human-in-the-loop decisions, recommendation acceptance rates, and model feedback calibration.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">Recommendation Acceptance</span>
          <div className="text-2xl font-bold font-serif text-emerald-700 mt-1">
            87.5%
          </div>
          <span className="text-[10px] text-charcoal-400">High advisor alignment</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">Human Override Rate</span>
          <div className="text-2xl font-bold font-serif text-purple-700 mt-1">
            8.2%
          </div>
          <span className="text-[10px] text-charcoal-400">With mandatory audit reasons</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">Customer Conversion</span>
          <div className="text-2xl font-bold font-serif text-charcoal-900 mt-1">
            74.0%
          </div>
          <span className="text-[10px] text-charcoal-400">Across VIP outreach</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm">
          <span className="text-xs text-charcoal-500 font-semibold">False Positive Rejection</span>
          <div className="text-2xl font-bold font-serif text-rose-700 mt-1">
            4.3%
          </div>
          <span className="text-[10px] text-charcoal-400">Caught by human gate</span>
        </div>
      </div>

      {/* Model Feedback Submission Box */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-aurum-500" />
          Submit Human Expert Evaluation
        </h3>

        <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-charcoal-700 mb-1 block">
                Select Recommendation
              </label>
              <select
                value={selectedRecId}
                onChange={(e) => setSelectedRecId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold focus:ring-2 focus:ring-aurum-400"
              >
                {recommendations.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.first_name} {r.last_name} — {r.recommended_action?.substring(0, 55)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-charcoal-700 mb-1 block">
                Human Quality Rating
              </label>
              <select
                value={selectedScore}
                onChange={(e) => setSelectedScore(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 font-bold focus:ring-2 focus:ring-aurum-400"
              >
                <option value="helpful">Helpful & Accurate</option>
                <option value="correct">Correct & Actionable</option>
                <option value="override_better">Override Was Better Suited</option>
                <option value="not_helpful">Not Helpful / Generic</option>
                <option value="incorrect">Incorrect Context</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-charcoal-700 mb-1 block">
              Feedback Notes & Domain Insights
            </label>
            <textarea
              rows={2}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder="E.g., Recommendation correctly identified overdue repair urgency and selected WhatsApp..."
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-aurum-400 hover:bg-aurum-500 rounded-xl shadow-luxury transition"
            >
              Record Model Feedback
            </button>
          </div>
        </form>
      </div>

      {/* Outcome History Table */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury overflow-hidden">
        <div className="p-6 border-b border-aurum-100 flex items-center justify-between">
          <h4 className="font-serif font-bold text-base text-charcoal-900">
            Decision Outcomes & Review History
          </h4>
          <span className="text-xs text-charcoal-500">Live PostgreSQL Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aurum-50/80 text-charcoal-600 font-bold uppercase border-b border-aurum-200">
              <tr>
                <th className="px-6 py-4">Patron</th>
                <th className="px-6 py-4">Recommended Action</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Human Decision</th>
                <th className="px-6 py-4">Reviewer</th>
                <th className="px-6 py-4">Override Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recommendations.map(r => (
                <tr key={r.id} className="hover:bg-aurum-50/40 transition">
                  <td className="px-6 py-4 font-bold text-charcoal-900">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-6 py-4 text-charcoal-700 max-w-sm">
                    {r.recommended_action}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-800">
                    {Math.round((r.confidence_score || 0.88) * 100)}%
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                  <td className="px-6 py-4 text-charcoal-600">
                    {r.reviewer_first_name ? `${r.reviewer_first_name} ${r.reviewer_last_name}` : 'Pending Review'}
                  </td>
                  <td className="px-6 py-4 text-purple-800 font-medium">
                    {r.override_reason || '—'}
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
