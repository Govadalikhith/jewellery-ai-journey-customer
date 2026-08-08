import React from 'react';

export const StatusBadge = ({ status, type = 'status' }) => {
  if (!status) return null;
  const s = String(status).toLowerCase();

  let styles = 'bg-gray-100 text-gray-800 border-gray-200';

  if (s === 'active' || s === 'approved' || s === 'completed' || s === 'passed' || s === 'converted' || s === 'resolved' || s === 'low') {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  } else if (s === 'pending_review' || s === 'in_progress' || s === 'pending' || s === 'in_atelier' || s === 'medium' || s === 'scheduled') {
    styles = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (s === 'at_risk' || s === 'rejected' || s === 'urgent' || s === 'high' || s === 'frustrated' || s === 'negative' || s === 'churned') {
    styles = 'bg-rose-50 text-rose-800 border-rose-300';
  } else if (s === 'overridden' || s === 'vip' || s === 'elite bespoke' || s === 'vip_high_touch') {
    styles = 'bg-purple-50 text-purple-800 border-purple-300';
  } else if (s === 'design' || s === 'sourcing' || s === 'production' || s === 'certification') {
    styles = 'bg-blue-50 text-blue-800 border-blue-300';
  }

  const formatText = (txt) => {
    return txt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      {formatText(status)}
    </span>
  );
};
