import React, { useState } from 'react';
import { Sprout, Store, Truck, Factory, Check, ChevronDown } from 'lucide-react';

interface WhoItIsForProps {
  onSelectRole: (role: string) => void;
}

export const WhoItIsFor: React.FC<WhoItIsForProps> = ({ onSelectRole }) => {
  const [openCards, setOpenCards] = useState<Record<number, boolean>>({});

  const toggleCard = (idx: number) => {
    setOpenCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const personas = [
    {
      role: 'Farmers and Cooperatives',
      badge: 'Producers & Growers',
      headline: 'Sell produce to more buyers and reduce post-harvest losses.',
      description:
        'Stop leaving ripe crops to rot in the field. List your upcoming harvest, get matched with ready off-takers, and access shared truck space to cut logistics costs.',
      bullets: [
        'Direct connection to off-takers beyond local spot middlemen',
        'Transparent crate & bag pricing',
        'Consolidated transport so small batches can move fast',
      ],
      image: '/src/assets/images/nigerian_farmer_tomatoes_1794460146413.jpg',
      alt: 'Nigerian farmer smiling in a sunlit field with a crate of fresh tomatoes',
      icon: Sprout,
      roleValue: 'Farmer',
    },
    {
      role: 'Aggregators and Traders',
      badge: 'Aggregation Hubs',
      headline: 'Find supply, buyers, and transport more easily.',
      description:
        'Coordinate multiple farm clusters across LGAs, verify harvest grades, and match bulk quantities with institutional buyers and major city wholesale stalls.',
      bullets: [
        'Source consistent tomato & pepper volumes from verified clusters',
        'Clear scheduling for multi-drop market deliveries',
        'Accurate digital transaction records to end tally disputes',
      ],
      image: '/src/assets/images/nigerian_market_traders_1794460147298.jpg',
      alt: 'Nigerian market traders at Mile 12 market with fresh tomatoes and rodo peppers',
      icon: Store,
      roleValue: 'Aggregator/Trader',
    },
    {
      role: 'Transporters',
      badge: 'Fleet & Logistics',
      headline: 'Receive delivery jobs and reduce empty trips.',
      description:
        'Maximize truck utilization along agricultural routes. Get scheduled loads, consolidate freight from nearby collection centers, and avoid deadhead return runs.',
      bullets: [
        'Guaranteed produce cargo bookings before you roll',
        'Reduce empty return miles from South to North',
        'Prompt digital freight payouts upon delivery sign-off',
      ],
      image: '/src/assets/images/produce_delivery_truck_1794460147863.jpg',
      alt: 'Commercial produce transport truck moving agricultural freight on a Nigerian road',
      icon: Truck,
      roleValue: 'Transporter',
    },
    {
      role: 'Buyers and Processors',
      badge: 'Off-takers & Retailers',
      headline: 'Source produce with clearer quantities, delivery details, and records.',
      description:
        'Whether you operate a wholesale stall at Mile 12, a supermarket chain, a hotel kitchen, or a tomato paste pasteurizing plant, source fresh produce reliably.',
      bullets: [
        'Verified crop quality grades and harvest dates',
        'Real-time transport tracking and ETA notifications',
        'Digital invoices and verified delivery documentation',
      ],
      image: '/src/assets/images/nigerian_harvest_crates_1794460148147.jpg',
      alt: 'Packed crates of fresh tomatoes at an aggregation collection center in Nigeria',
      icon: Factory,
      roleValue: 'Buyer/Wholesaler',
    },
  ];

  return (
    <section id="who-it-is-for" className="py-20 lg:py-24 bg-white text-[#202522] border-y border-[#092C24]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#075B3D]">
            Ecosystem Stakeholders
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.625rem] font-semibold text-[#092C24] tracking-tight leading-[1.2] [text-wrap:balance]">
            Who FarmLink Is For
          </h2>

          <p className="text-base sm:text-lg text-[#202522]/80 leading-[1.65] [text-wrap:pretty]">
            Every participant in the Nigerian produce chain plays a crucial role.
            FarmLink is tailored to solve specific day-to-day bottlenecks for each stakeholder.
          </p>
        </div>

        {/* 4 Collapsible Stakeholder Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {personas.map((item, idx) => {
            const Icon = item.icon;
            const isOpen = !!openCards[idx];
            const headerId = `persona-card-header-${idx}`;
            const panelId = `persona-card-panel-${idx}`;

            return (
              <div
                key={idx}
                className={`bg-[#FFF9ED]/55 rounded-2xl border overflow-hidden transition-colors ${
                  isOpen
                    ? 'border-[#D4AF37] shadow-sm'
                    : 'border-[#092C24]/12 hover:border-[#D4AF37]/60'
                }`}
              >
                {/* Clickable Compact Header */}
                <button
                  type="button"
                  id={headerId}
                  onClick={() => toggleCard(idx)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full p-6 sm:p-7 text-left flex items-start justify-between gap-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#092C24] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#075B3D]">
                        {item.badge}
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight text-[#092C24]">
                        {item.role}
                      </h3>
                      <p className="font-display text-sm sm:text-base font-medium text-[#202522]/85 leading-snug">
                        “{item.headline}”
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 transition-transform duration-200 border ${
                      isOpen
                        ? 'rotate-180 bg-[#092C24] text-[#D4AF37] border-[#D4AF37]/50'
                        : 'bg-white text-[#075B3D] border-[#092C24]/15'
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Collapsible Content: Photo, Description, Bullets, CTA */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="disclosure-content"
                  data-open={isOpen}
                >
                  <div className={`disclosure-inner ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
                    <div className="border-t border-[#092C24]/10">
                      {/* Real Life Image */}
                      <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-[#092C24]">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="w-full h-full object-cover object-center"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#092C24]/60 via-transparent to-transparent" />
                      </div>

                      {/* Details & CTA */}
                      <div className="p-6 sm:p-7 space-y-5 bg-white">
                        <p className="text-sm text-[#202522]/85 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="space-y-2.5 pt-3 border-t border-[#092C24]/10">
                          {item.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2.5 text-xs text-[#202522]/85">
                              <div className="w-4 h-4 rounded-full bg-[#075B3D]/15 text-[#075B3D] flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                              </div>
                              <span className="font-medium">{bullet}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => onSelectRole(item.roleValue)}
                            className="w-full py-2.5 px-4 text-xs font-semibold text-[#FFF9ED] bg-[#075B3D] hover:bg-[#092C24] rounded-xl transition-colors border border-[#D4AF37]/30 flex items-center justify-center gap-1.5"
                          >
                            <span>Register as {item.role}</span>
                            <span className="text-[#D4AF37]">➔</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
