import React from 'react';
import { User, Phone, Mail, Award, TrendingUp, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { TIER_COLORS, CHURN_COLORS } from '../../constants';

export const CustomerCard = ({ customer, onSelect }) => {
  if (!customer) return null;

  const churnRisk = customer.churn_risk_score ? Math.round(customer.churn_risk_score * 100) : 15;
  const propensity = customer.propensity_score ? Math.round(customer.propensity_score * 100) : 85;

  return (
    <div
      onClick={() => onSelect && onSelect(customer.id)}
      className="bg-white rounded-2xl border border-aurum-200 shadow-luxury hover:shadow-luxury-hover hover:border-aurum-400 transition-all duration-300 p-5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Tier & Status Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${TIER_COLORS[customer.tier] || 'bg-gray-100'}`}>
            {customer.tier}
          </span>
          <StatusBadge status={customer.status} />
        </div>

        {/* Customer Name & Spend */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-aurum-50 border border-aurum-300 flex items-center justify-center text-aurum-600 font-serif font-bold text-lg flex-shrink-0">
            {customer.first_name[0]}{customer.last_name[0]}
          </div>
          <div>
            <h4 className="font-bold text-charcoal-900 text-base leading-tight">
              {customer.first_name} {customer.last_name}
            </h4>
            <div className="text-xs text-charcoal-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5 text-charcoal-400" />
              <span>{customer.email}</span>
            </div>
            <div className="text-xs text-charcoal-500 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-charcoal-400" />
              <span>{customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Spend & Store */}
        <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-charcoal-500">Total Spend:</span>
            <div className="font-bold text-charcoal-900 text-sm">
              ₹{Number(customer.total_spend || 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <span className="text-charcoal-500">Boutique:</span>
            <div className="font-semibold text-charcoal-800 truncate">
              {customer.store_name || 'Mumbai Flagship'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Churn Risk & Propensity Gauges */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-charcoal-500">Churn Risk:</span>
          <span className={`font-bold px-2 py-0.5 rounded-md border ${
            churnRisk > 60 ? CHURN_COLORS.high :
            churnRisk > 30 ? CHURN_COLORS.medium : CHURN_COLORS.low
          }`}>
            {churnRisk}%
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-charcoal-500">Propensity:</span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {propensity}%
          </span>
        </div>
      </div>
    </div>
  );
};
