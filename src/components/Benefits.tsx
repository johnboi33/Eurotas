import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Compass, ArrowUpRight, ChevronDown } from 'lucide-react';

interface BenefitsProps {
  onJoinEarlyAccess: () => void;
}

export const Benefits: React.FC<BenefitsProps> = ({ onJoinEarlyAccess }) => {
  const [openCards, setOpenCards] = useState<Record<number, boolean>>({});

  const toggleCard = (idx: number) => {
    setOpenCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const benefits = [
    {
      title: 'Reduce Spoilage',
      headline: 'Faster coordination helps produce reach buyers sooner.',
      description:
        'By matching transport trucks and ready buyers before or immediately upon harvest, crops spend minimal time sitting under the sun. Lower rot rates mean higher net returns for every crate harvested.',
      icon: ShieldCheck,
      keyBenefit: 'Preserve crop freshness & saleable value',
    },
    {
      title: 'Improve Market Access',
      headline: 'Connect with buyers beyond immediate local contacts.',
      description:
        'Break out of localized price suppression. Farmers and aggregators gain direct visibility to major consumption hubs—Lagos, Abuja, Port Harcourt, and Ibadan—expanding sales reach effortlessly.',
      icon: TrendingUp,
      keyBenefit: 'Diversified off-take demand',
    },
    {
      title: 'Make Delivery Clearer',
      headline: 'Track orders, pickups, deliveries, and confirmations.',
      description:
        'Say goodbye to missing crates and unconfirmed handoffs. FarmLink provides clear waypoints, driver contacts, digital crate counts, and verifiable receipt records for seamless settlement.',
      icon: Compass,
      keyBenefit: 'Zero guesswork or tally disputes',
    },
  ];

  return (
    <section id="benefits" className="py-20 lg:py-24 bg-[#FFF9ED] text-[#202522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#075B3D]">
            Practical Outcomes
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.625rem] font-semibold text-[#092C24] tracking-tight leading-[1.2] [text-wrap:balance]">
            Core Benefits of FarmLink
          </h2>

          <p className="text-base sm:text-lg text-[#202522]/80 leading-[1.65] [text-wrap:pretty]">
            Purpose-built to fix the highest-friction bottlenecks in Nigeria’s perishable produce distribution.
          </p>
        </div>

        {/* 3 Collapsible Benefit Cards */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            const isOpen = !!openCards[idx];
            const headerId = `benefit-card-header-${idx}`;
            const panelId = `benefit-card-panel-${idx}`;

            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-colors ${
                  isOpen
                    ? 'border-[#D4AF37] shadow-sm'
                    : 'border-[#092C24]/12 hover:border-[#D4AF37]/60'
                }`}
              >
                <button
                  type="button"
                  id={headerId}
                  onClick={() => toggleCard(idx)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full p-7 text-left flex flex-col gap-5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9ED]"
                >
                  <div className="w-full flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#092C24] border border-[#D4AF37]/45 text-[#D4AF37] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
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
                    <h3 className="font-display text-2xl font-semibold text-[#092C24] tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-sm font-semibold text-[#075B3D] leading-snug">
                      {benefit.headline}
                    </p>
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
                    <div className="px-7 pb-7 pt-4 border-t border-[#092C24]/10 space-y-5">
                      <p className="text-sm text-[#202522]/85 leading-relaxed">
                        {benefit.description}
                      </p>

                      <div className="pt-4 border-t border-[#092C24]/10 flex items-center justify-between text-xs font-semibold text-[#8A6414]">
                        <span>{benefit.keyBenefit}</span>
                        <ArrowUpRight className="w-4 h-4 text-[#075B3D]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={onJoinEarlyAccess}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-[#092C24] bg-golden-radiance hover:brightness-105 rounded-xl shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <span>Join Early Access</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
