import React from 'react';
import { CheckCircle2, Circle, Clock, Sparkles, Award, Truck, Gem, Hammer, Glasses, Receipt, FileCheck, Wrench, Repeat } from 'lucide-react';
import { JOURNEY_STAGES } from '../../constants';
import { StatusBadge } from '../StatusBadge';

const ICONS = {
  design: Sparkles,
  sourcing: Gem,
  production: Hammer,
  hallmarking: Award,
  inventory_transfer: Truck,
  consultation: Glasses,
  sale: Receipt,
  certification: FileCheck,
  repair: Wrench,
  exchange: Repeat
};

export const JourneyTimeline = ({ stages = [], currentStage = 'design', onStageClick }) => {
  const currentStageIndex = JOURNEY_STAGES.findIndex(s => s.key === currentStage);

  return (
    <div className="w-full bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold font-serif text-charcoal-900">
            10-Stage Unified Customer Journey
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Connecting Bespoke Design, Assay Hallmarking, GIA Certification, Atelier Repairs & Lifetime Exchange
          </p>
        </div>
        <div className="text-xs bg-aurum-50 text-aurum-800 border border-aurum-300 font-semibold px-3 py-1.5 rounded-xl">
          Current Stage: <span className="uppercase">{currentStage?.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Horizontal / Wrapped Stage Progression Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {JOURNEY_STAGES.map((stg, idx) => {
          const Icon = ICONS[stg.key] || Circle;
          const stageRecord = stages.find(s => s.stage_name === stg.key);
          const isPassed = idx < currentStageIndex || stageRecord?.status === 'completed';
          const isCurrent = stg.key === currentStage || stageRecord?.status === 'in_progress';

          return (
            <div
              key={stg.key}
              onClick={() => onStageClick && onStageClick(stg.key, stageRecord)}
              className={`relative flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                isCurrent ? 'bg-aurum-50/80 border-aurum-400 shadow-md ring-2 ring-aurum-300' :
                isPassed ? 'bg-emerald-50/40 border-emerald-300 hover:bg-emerald-50' :
                'bg-gray-50/60 border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Top Step Number */}
              <div className="absolute top-1.5 left-2 text-[10px] font-bold text-charcoal-400">
                0{idx + 1}
              </div>

              {/* Stage Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 mt-1 shadow-sm transition ${
                isCurrent ? 'bg-aurum-400 text-white' :
                isPassed ? 'bg-emerald-600 text-white' :
                'bg-gray-200 text-charcoal-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Title */}
              <div className="text-xs font-bold text-charcoal-800 line-clamp-1">
                {stg.short}
              </div>

              {/* Status Pill */}
              <div className="mt-1.5">
                {isPassed ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                    Done
                  </span>
                ) : isCurrent ? (
                  <span className="text-[10px] font-semibold text-aurum-800 bg-aurum-200 px-1.5 py-0.5 rounded-md animate-pulse">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500">
                    Pending
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
