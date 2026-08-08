import React, { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, ShieldAlert, Clock, ArrowRight, BrainCircuit } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { OverrideReasonModal } from '../OverrideReasonModal';
import { useToast } from '../../context/ToastContext';

export const AIRecommendationCard = ({ recommendation, onApprove, onReject, onOverride }) => {
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  if (!recommendation) return null;

  const isPending = recommendation.status === 'pending_review';
  const confidencePercent = Math.round((recommendation.confidence_score || 0.85) * 100);

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      await onApprove(recommendation.id);
      toast.success('Recommendation Approved', 'Action dispatched and recorded in audit log.');
    } catch (err) {
      toast.error('Approval Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setSubmitting(true);
      await onReject(recommendation.id);
      toast.info('Recommendation Rejected', 'Action cancelled and feedback recorded.');
    } catch (err) {
      toast.error('Rejection Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverrideSubmit = async (data) => {
    await onOverride(recommendation.id, data);
    toast.success('Recommendation Overridden', 'Custom action recorded with mandatory audit reason.');
  };

  return (
    <div className="bg-white rounded-2xl border border-aurum-300/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 p-6 relative overflow-hidden">
      {/* Decorative Gold Header Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-aurum-400 via-aurum-300 to-aurum-500" />

      {/* Top Meta Line */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-aurum-50 text-aurum-600 border border-aurum-200">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
              {recommendation.recommendation_type?.replace(/_/g, ' ') || 'Next Best Action'}
            </div>
            <div className="text-xs text-charcoal-400 flex items-center gap-1 mt-0.5">
              <span>Channel:</span>
              <span className="font-semibold text-charcoal-700 uppercase">{recommendation.channel}</span>
              <span>•</span>
              <span className="text-charcoal-500">{recommendation.model_version || 'Google Gemini 1.5 Flash'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={recommendation.status} />
        </div>
      </div>

      {/* Recommendation Action */}
      <div className="my-3">
        <h4 className="text-base font-semibold text-charcoal-900 leading-snug">
          {recommendation.recommended_action}
        </h4>
        {recommendation.explanation && (
          <p className="text-sm text-charcoal-600 mt-1.5 leading-relaxed">
            {recommendation.explanation}
          </p>
        )}
      </div>

      {/* Confidence Meter */}
      <div className="bg-aurum-50/60 p-3.5 rounded-xl border border-aurum-200/70 mb-4">
        <div className="flex items-center justify-between text-xs font-medium mb-1.5">
          <span className="text-charcoal-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-aurum-500" />
            Model Confidence Score
          </span>
          <span className={`font-bold ${confidencePercent >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {confidencePercent}%
          </span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              confidencePercent >= 80 ? 'bg-emerald-600' : 'bg-amber-500'
            }`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Evidence Bullets (Section 37 Safe Traceability) */}
      {recommendation.evidence && Array.isArray(recommendation.evidence) && recommendation.evidence.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-charcoal-600 uppercase tracking-wider mb-2">
            Governance & Decision Evidence:
          </div>
          <ul className="space-y-1.5">
            {recommendation.evidence.map((ev, idx) => (
              <li key={idx} className="text-xs text-charcoal-600 flex items-start gap-2 bg-gray-50/80 p-2 rounded-lg border border-gray-100">
                <span className="w-1.5 h-1.5 rounded-full bg-aurum-400 mt-1.5 flex-shrink-0" />
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Human-in-the-Loop Action Controls (Section 29) */}
      {isPending ? (
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-charcoal-500 font-medium">
            Human Review Required
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              disabled={submitting}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> Reject
            </button>
            <button
              onClick={() => setShowOverrideModal(true)}
              disabled={submitting}
              className="px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 border border-purple-200 rounded-xl transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Override
            </button>
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Approve & Execute
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-charcoal-500">
          <span>Decision finalized</span>
          <span className="font-semibold text-charcoal-700 uppercase">{recommendation.status}</span>
        </div>
      )}

      {/* Override Modal */}
      <OverrideReasonModal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        recommendation={recommendation}
        onConfirm={handleOverrideSubmit}
      />
    </div>
  );
};
