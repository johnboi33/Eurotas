import React, { useState } from 'react';
import { ClipboardList, Shuffle, ShieldCheck, CheckCircle2, ChevronDown } from 'lucide-react';

interface HowItWorksProps {
  onJoinEarlyAccess: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onJoinEarlyAccess }) => {
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setOpenSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const steps = [
    {
      num: '01',
      title: 'List Your Produce or Request Produce',
      summary:
        'Farmers and aggregators list crop type, quantity, grade, location, harvest date, and price. Buyers request what they need.',
      details: [
        'Farmers upload crate quantities (e.g. 80 wooden crates of Grade-A Roma Tomatoes).',
        'State your harvest date, pickup LGA (e.g. Jos North, Kura Kano, or Zaria), and target farmgate price.',
        'Buyers post open off-take requests with desired delivery dates and market drop-off points.',
      ],
      icon: ClipboardList,
    },
    {
      num: '02',
      title: 'Match Supply, Buyers, and Transport',
      summary:
        'FarmLink helps connect available produce with suitable buyers and transport options, including load consolidation where possible.',
      details: [
        'Smart matching pairs farmers with verified wholesale off-takers and food processors.',
        'Consolidate smaller harvests with neighboring farms into full truckloads to reduce haulage rates.',
        'Vetted transport operators accept scheduled routes with transparent per-crate rates.',
      ],
      icon: Shuffle,
    },
    {
      num: '03',
      title: 'Deliver, Confirm, and Get Paid',
      summary:
        'Users receive delivery updates, confirm receipt, and maintain clearer transaction records.',
      details: [
        'Receive live delivery check-ins and waypoint alerts as the truck journeys along the corridor.',
        'Buyer inspects crate count and produce freshness upon arrival and marks digital confirmation.',
        'Payment is recorded transparently with verifiable receipts and fast bank settlement.',
      ],
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-24 bg-[#FFF9ED] text-[#202522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#075B3D]">
            Simple 3-Step Process
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.625rem] font-semibold text-[#092C24] tracking-tight leading-[1.2] [text-wrap:balance]">
            How FarmLink Works
          </h2>

          <p className="text-base sm:text-lg text-[#202522]/80 leading-[1.65] [text-wrap:pretty]">
            Designed for ease of use in the field and market stalls. Fast, predictable, and
            structured to eliminate friction at every milestone.
          </p>
        </div>

        {/* 3 Collapsible Step Cards with Thin Gold Connectors */}
        <div className="mt-14 relative">
          {/* Thin horizontal Imperial Gold connector line across desktop cards */}
          <div
            className="hidden lg:block absolute top-11 left-[16%] right-[16%] h-px bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37] to-[#D4AF37]/30 pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative items-start">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isOpen = !!openSteps[idx];
              const headerId = `how-step-header-${idx}`;
              const panelId = `how-step-panel-${idx}`;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border bg-white transition-colors ${
                    isOpen
                      ? 'border-[#D4AF37] shadow-sm'
                      : 'border-[#092C24]/12 hover:border-[#D4AF37]/60'
                  }`}
                >
                  <button
                    type="button"
                    id={headerId}
                    onClick={() => toggleStep(idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full p-6 sm:p-7 text-left flex flex-col gap-5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9ED]"
                  >
                    <div className="w-full flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-[#092C24] border border-[#D4AF37]/50 text-[#D4AF37] font-display font-bold text-sm flex items-center justify-center tabular-nums shrink-0">
                          {step.num}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-[#FFF9ED] border border-[#D4AF37]/30 text-[#075B3D] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 border ${
                          isOpen
                            ? 'rotate-180 bg-[#092C24] text-[#D4AF37] border-[#D4AF37]/50'
                            : 'bg-[#FFF9ED] text-[#075B3D] border-[#092C24]/15'
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#075B3D] tabular-nums">
                        Step {idx + 1} of 3
                      </div>
                      <h3 className="text-xl font-semibold text-[#092C24] tracking-tight leading-snug">
                        {step.title}
                      </h3>
                    </div>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headerId}
                    className="disclosure-content"
                    data-open={isOpen}
                  >
                    <div className={`disclosure-inner ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
                      <div className="px-6 sm:px-7 pb-7 pt-4 border-t border-[#092C24]/10 space-y-5">
                        <p className="text-sm text-[#202522]/85 leading-relaxed">
                          {step.summary}
                        </p>

                        <div className="space-y-2.5 pt-4 border-t border-[#092C24]/10">
                          {step.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2 text-xs text-[#202522]/85">
                              <CheckCircle2 className="w-4 h-4 text-[#075B3D] shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Progression Action Bar */}
        <div className="mt-12 bg-[#092C24] text-[#FFF9ED] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border border-[#D4AF37]/30">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display text-xl font-semibold text-[#FFF9ED] tracking-tight">
              Ready to streamline your produce orders?
            </h4>
            <p className="text-xs sm:text-sm text-[#FFF9ED]/80">
              Join early access to lock in priority matching for upcoming harvests.
            </p>
          </div>
          <button
            onClick={onJoinEarlyAccess}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-[#092C24] bg-golden-radiance hover:brightness-105 rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap"
          >
            Join Early Access
          </button>
        </div>
      </div>
    </section>
  );
};
