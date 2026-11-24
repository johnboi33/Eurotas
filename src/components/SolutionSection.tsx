import React, { useState } from 'react';
import { PackagePlus, Users, Truck, CheckCircle2, ArrowRight, ChevronDown } from 'lucide-react';

interface SolutionSectionProps {
  onJoinEarlyAccess: () => void;
}

export const SolutionSection: React.FC<SolutionSectionProps> = ({ onJoinEarlyAccess }) => {
  const [openCards, setOpenCards] = useState<Record<number, boolean>>({});
  const [showcaseOpen, setShowcaseOpen] = useState(false);

  const toggleCard = (idx: number) => {
    setOpenCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const solutions = [
    {
      step: '01',
      title: 'List Available Produce',
      description:
        'Tell FarmLink what you harvested—tomatoes, peppers, or onions. Enter crate quantities, grade, location, and your selling price easily over mobile or WhatsApp.',
      icon: PackagePlus,
      highlight: 'Takes under 2 minutes',
    },
    {
      step: '02',
      title: 'Find Ready Buyers',
      description:
        'Connect directly with verified market wholesalers, distributors, and bulk produce buyers who need your specific crops and are ready to purchase.',
      icon: Users,
      highlight: 'Direct buyer matching',
    },
    {
      step: '03',
      title: 'Arrange Transport',
      description:
        'Schedule pickups with verified commercial trucks and transport operators. Share truck capacity with neighboring farmers to reduce delivery fees.',
      icon: Truck,
      highlight: 'Consolidated freight options',
    },
    {
      step: '04',
      title: 'Track Delivery and Confirm Receipt',
      description:
        'Get clear updates as your produce travels down the corridor. Once the buyer confirms arrival and crate condition, payments are settled transparently.',
      icon: CheckCircle2,
      highlight: 'Clear record on both ends',
    },
  ];

  return (
    <section id="solution" className="py-20 lg:py-24 bg-white text-[#202522] border-y border-[#092C24]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#075B3D]">
            The Coordinated Solution
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.625rem] font-semibold text-[#092C24] tracking-tight leading-[1.2] [text-wrap:balance]">
            FarmLink Connects the Produce Value Chain.
          </h2>

          <p className="text-base sm:text-lg text-[#202522]/80 leading-[1.65] [text-wrap:pretty]">
            Instead of multiple confusing phone calls, delayed drivers, and price arguments,
            FarmLink brings farmers, aggregators, transporters, and buyers into one simple,
            trustworthy system.
          </p>
        </div>

        {/* 4 Collapsible Solution Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            const isOpen = !!openCards[idx];
            const headerId = `solution-card-header-${idx}`;
            const panelId = `solution-card-panel-${idx}`;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-colors ${
                  isOpen
                    ? 'bg-[#092C24] text-[#FFF9ED] border-[#D4AF37]/60 shadow-sm'
                    : 'bg-[#FFF9ED]/70 text-[#202522] border-[#092C24]/12 hover:border-[#D4AF37]/60'
                }`}
              >
                <button
                  type="button"
                  id={headerId}
                  onClick={() => toggleCard(idx)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full p-6 text-left flex flex-col gap-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <div className="w-full flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-golden-radiance text-[#092C24]'
                            : 'bg-[#075B3D] text-[#FFF9ED]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`font-display text-xl font-bold tabular-nums ${
                          isOpen ? 'text-[#D4AF37]' : 'text-[#8A6414]'
                        }`}
                      >
                        {item.step}
                      </span>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 border ${
                        isOpen
                          ? 'rotate-180 bg-[#075B3D] text-[#FFD700] border-[#D4AF37]/50'
                          : 'bg-white text-[#075B3D] border-[#092C24]/15'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3
                      className={`text-lg font-semibold tracking-tight leading-snug ${
                        isOpen ? 'text-[#FFF9ED]' : 'text-[#092C24]'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-xs font-semibold ${
                        isOpen ? 'text-[#D4AF37]' : 'text-[#075B3D]'
                      }`}
                    >
                      {item.highlight}
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
                    <div className="px-6 pb-6 pt-3 border-t border-[#D4AF37]/25">
                      <p className="text-sm text-[#FFF9ED]/85 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collapsible Visual Showcase Card */}
        <div className="mt-12 bg-emerald-depth rounded-3xl overflow-hidden shadow-md border border-[#D4AF37]/35 text-[#FFF9ED]">
          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <button
              type="button"
              id="solution-showcase-header"
              onClick={() => setShowcaseOpen((prev) => !prev)}
              aria-expanded={showcaseOpen}
              aria-controls="solution-showcase-panel"
              className="flex-1 text-left flex items-center justify-between gap-4 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] p-1 -m-1"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37] block">
                  Aggregated Produce Movement
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#FFF9ED] [text-wrap:balance]">
                  Built specifically for perishables like tomatoes and peppers.
                </h3>
              </div>

              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 border ${
                  showcaseOpen
                    ? 'rotate-180 bg-[#092C24] text-[#FFD700] border-[#D4AF37]'
                    : 'bg-[#092C24]/70 text-[#D4AF37] border-[#D4AF37]/40'
                }`}
                aria-hidden="true"
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <div className="shrink-0">
              <button
                type="button"
                onClick={onJoinEarlyAccess}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-[#092C24] bg-golden-radiance hover:brightness-105 rounded-xl transition-all shadow-sm whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]"
              >
                <span>Join Early Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            id="solution-showcase-panel"
            role="region"
            aria-labelledby="solution-showcase-header"
            className="disclosure-content"
            data-open={showcaseOpen}
          >
            <div className={`disclosure-inner ${showcaseOpen ? 'visible' : 'invisible pointer-events-none'}`}>
              <div className="border-t border-[#D4AF37]/25 grid grid-cols-1 lg:grid-cols-12 items-center">
                <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
                  <p className="text-sm sm:text-base text-[#FFF9ED]/85 leading-[1.65] [text-wrap:pretty]">
                    Perishable crops cannot sit around. FarmLink focuses on the critical harvest-to-market
                    window, matching verified buyers and haulage trucks before produce leaves the farmgate.
                  </p>
                </div>

                <div className="lg:col-span-5 h-56 sm:h-64 lg:h-full relative overflow-hidden">
                  <img
                    src="/src/assets/images/nigerian_harvest_crates_1794460148147.jpg"
                    alt="Nigerian farmers aggregating fresh tomatoes and peppers in wooden and plastic crates"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#092C24]/85 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
