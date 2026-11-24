import React, { useState } from 'react';
import { Clock, Search, Truck, FileText, ChevronDown } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const [openCards, setOpenCards] = useState<Record<number, boolean>>({});

  const toggleCard = (idx: number) => {
    setOpenCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const problems = [
    {
      title: 'Produce Spoils During Delays',
      description:
        'Tomatoes and peppers deteriorate within hours in tropical heat. When trucks arrive late or produce sits in the open sun without fast dispatch, entire harvests spoil before reaching the marketplace.',
      icon: Clock,
      stat: 'Perishable window measured in hours',
    },
    {
      title: 'Buyers Are Hard to Find',
      description:
        'Farmers and aggregators frequently rely on informal spot middlemen who offer inconsistent prices or fail to show up. Without direct links to verified off-takers, farmgate produce sits stranded.',
      icon: Search,
      stat: 'Limited to immediate local network',
    },
    {
      title: 'Transport Is Uncertain',
      description:
        'Finding available trucks during peak harvest is unpredictable. Drivers struggle with empty return runs, while farmers deal with sudden cancellations, lack of refrigeration, and poorly ventilated loads.',
      icon: Truck,
      stat: 'Empty return trips inflate costs',
    },
    {
      title: 'Payment Records Are Unclear',
      description:
        'Handwritten paper tallies, disputed crate counts, and late bank transfers create friction. Farmers wait weeks to get settled, while buyers worry about paying for produce damaged in transit.',
      icon: FileText,
      stat: 'Manual tallies cause disputes',
    },
  ];

  return (
    <section id="problem" className="py-20 lg:py-24 bg-[#FFF9ED] text-[#202522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#075B3D]">
            The Current Challenge
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.625rem] font-semibold text-[#092C24] tracking-tight leading-[1.2] [text-wrap:balance]">
            Fresh Produce Should Not Spoil Before It Reaches the Market.
          </h2>

          <p className="text-base sm:text-lg text-[#202522]/80 leading-[1.65] [text-wrap:pretty]">
            Farmers and traders in Nigeria face an uphill battle every harvest season.
            Fragmented coordination, unreliable logistics, and delayed buyer discovery turn hard-earned
            agricultural yields into preventable post-harvest waste.
          </p>
        </div>

        {/* 4 Collapsible Problem Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            const isOpen = !!openCards[idx];
            const headerId = `problem-card-header-${idx}`;
            const panelId = `problem-card-panel-${idx}`;

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
                  className="w-full p-6 text-left flex flex-col gap-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9ED]"
                >
                  <div className="w-full flex items-center justify-between gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#FFF9ED] border border-[#D4AF37]/40 flex items-center justify-center text-[#075B3D] shrink-0">
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
                    <h3 className="text-lg font-semibold text-[#092C24] tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-[#8A6414]">
                      {item.stat}
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
                    <div className="px-6 pb-6 pt-3 border-t border-[#092C24]/10">
                      <p className="text-sm text-[#202522]/85 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* End Callout Banner */}
        <div className="mt-12 max-w-2xl mx-auto text-center bg-[#092C24] text-[#FFF9ED] px-6 py-6 sm:px-8 rounded-2xl shadow-sm border border-[#D4AF37]/35">
          <p className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#FFF9ED]">
            “Every delay can turn fresh produce into a loss.”
          </p>
          <p className="text-xs sm:text-sm text-[#FFF9ED]/75 mt-2">
            Produce cannot wait for slow middlemen. It requires real-time coordination from harvest to market stall.
          </p>
        </div>
      </div>
    </section>
  );
};
