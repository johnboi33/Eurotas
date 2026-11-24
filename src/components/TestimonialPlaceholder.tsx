import React, { useState } from 'react';
import { Quote, ChevronDown } from 'lucide-react';

interface TestimonialPlaceholderProps {
  onJoinEarlyAccess: () => void;
}

export const TestimonialPlaceholder: React.FC<TestimonialPlaceholderProps> = ({ onJoinEarlyAccess }) => {
  const [openStudies, setOpenStudies] = useState<Record<number, boolean>>({});

  const toggleStudy = (idx: number) => {
    setOpenStudies((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const caseStudies = [
    {
      label: 'Case Study 01',
      title: 'Tomato Cooperative Transit Pilot (Jos ➔ Lagos)',
      status: '[Publishing Post-Pilot]',
      description:
        'Documenting transit coordination and crate consolidation along the northern corridor.',
    },
    {
      label: 'Case Study 02',
      title: 'Wholesale Market Off-Taker Experience (Mile 12)',
      status: '[Publishing Post-Pilot]',
      description:
        'Documenting digital delivery confirmations and escrow settlement clarity.',
    },
    {
      label: 'Case Study 03',
      title: 'Commercial Haulage Fleet Utilization',
      status: '[Publishing Post-Pilot]',
      description:
        'Tracking scheduled freight bookings and return-trip coordination.',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-[#FFF9ED] text-[#202522] border-b border-[#092C24]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#092C24]/12 shadow-xs">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#075B3D]">
              Pilot Transparency
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#092C24] tracking-tight [text-wrap:balance]">
              Verified Field Feedback &amp; Case Studies
            </h3>

            <p className="text-sm sm:text-base text-[#202522]/80 leading-relaxed [text-wrap:pretty]">
              We believe in complete transparency. FarmLink is currently onboarding pilot cooperatives,
              transporters, and market off-takers across northern supply hubs and southern markets.
              Verified testimonials and field reports will be published here once pilot runs conclude.
            </p>
          </div>

          {/* Collapsible Placeholders for Pilot Reports */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {caseStudies.map((study, idx) => {
              const isOpen = !!openStudies[idx];
              const headerId = `case-study-header-${idx}`;
              const panelId = `case-study-panel-${idx}`;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border border-dashed transition-colors ${
                    isOpen
                      ? 'border-[#D4AF37] bg-[#FFF9ED]/70'
                      : 'border-[#D4AF37]/50 bg-[#FFF9ED]/45 hover:border-[#D4AF37]'
                  }`}
                >
                  <button
                    type="button"
                    id={headerId}
                    onClick={() => toggleStudy(idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full p-6 text-left flex flex-col gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#8A6414]">
                        {study.label}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 border ${
                          isOpen
                            ? 'rotate-180 bg-[#092C24] text-[#D4AF37] border-[#D4AF37]/50'
                            : 'bg-white text-[#075B3D] border-[#092C24]/15'
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-[#092C24] leading-snug">
                      {study.title}
                    </h4>

                    <div className="text-[11px] font-semibold text-[#075B3D]">
                      {study.status}
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
                      <div className="px-6 pb-6 pt-3 border-t border-[#D4AF37]/30 flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#092C24]/5 text-[#075B3D] flex items-center justify-center shrink-0 mt-0.5">
                          <Quote className="w-4 h-4" />
                        </div>
                        <p className="text-xs text-[#202522]/80 leading-relaxed">
                          {study.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center pt-4">
            <span className="text-xs text-[#202522]/70 mr-2">
              Interested in featuring your farm, truck, or wholesale shop in our pilot program?
            </span>
            <button
              onClick={onJoinEarlyAccess}
              className="text-xs font-semibold text-[#075B3D] hover:text-[#092C24] underline inline-flex items-center gap-1"
            >
              Apply to join the pilot cohort ➔
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
