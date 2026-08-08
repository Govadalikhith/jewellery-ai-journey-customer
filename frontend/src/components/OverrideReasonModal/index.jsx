import React, { useState } from 'react';
import { AlertTriangle, X, Check, ShieldAlert } from 'lucide-react';

export const OverrideReasonModal = ({ isOpen, onClose, recommendation, onConfirm }) => {
  const [overrideReason, setOverrideReason] = useState('');
  const [finalAction, setFinalAction] = useState(recommendation?.recommended_action || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !recommendation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!overrideReason || overrideReason.trim().length < 5) {
      setError('A mandatory override rationale (minimum 5 characters) is strictly required for compliance audit trails.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onConfirm({
        override_reason: overrideReason,
        final_action_taken: finalAction
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit override.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-aurum-300 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-aurum-50 border-b border-aurum-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-charcoal-900 font-semibold font-serif text-lg">
            <ShieldAlert className="w-5 h-5 text-purple-700" />
            Human-in-the-Loop Override Decision
          </div>
          <button onClick={onClose} className="text-charcoal-400 hover:text-charcoal-700 rounded-lg p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
            <strong>Governance Notice:</strong> Overriding an AI recommendation bypasses the automated Gemini Next Best Action. This decision will be permanently recorded in the immutable audit log with your employee identifier.
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-600 uppercase tracking-wider mb-1">
              Original AI Recommendation
            </label>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-charcoal-700">
              {recommendation.recommended_action}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-600 uppercase tracking-wider mb-1">
              Final Modified Action to Execute <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={finalAction}
              onChange={(e) => setFinalAction(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-aurum-400"
              placeholder="Specify the exact customized action to be taken..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-600 uppercase tracking-wider mb-1">
              Mandatory Override Reason & Rationale <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="E.g., Client has ₹50L+ lifetime spend; Director authorized complimentary custom appraisal and direct salon phone call..."
              required
            />
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-charcoal-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md transition flex items-center gap-2"
            >
              {loading ? 'Recording...' : <><Check className="w-4 h-4" /> Confirm & Audit Override</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
