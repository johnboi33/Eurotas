import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({});

  const toggleItem = (idx: number) => {
    setOpenIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const faqs = [
    {
      q: 'Is FarmLink available now?',
      a: 'We are currently running controlled pilot runs with select agricultural cooperatives, aggregators, and commercial off-takers across key northern farm belts and southern wholesale markets. By joining Early Access today, you secure priority matching and coordinated logistics support for our upcoming rollout.',
    },
    {
      q: 'Which produce does FarmLink support?',
      a: 'Our primary focus is on perishable crops that suffer the highest post-harvest losses: fresh tomatoes (Roma, UTC, and local varieties), peppers (Scotch Bonnet / Rodo, Tatase bell peppers, and Bawa), and onions. Additional perishable crops like leafy greens and citrus will be onboarded as refrigerated routes expand.',
    },
    {
      q: 'Which locations will FarmLink start with?',
      a: 'FarmLink starts on Nigeria’s high-volume agricultural transit corridors: sourcing directly from Kano, Kaduna, and Plateau (Jos) farm clusters, with destination deliveries into major Lagos wholesale centers (including Mile 12, Ketu, and Oyingbo), Ibadan (Bodija), and Abuja (Wuse & Dei-Dei).',
    },
    {
      q: 'Do I need a smartphone to use FarmLink?',
      a: 'No. While our mobile dashboard provides real-time maps and visual crate tallies, FarmLink is intentionally built to work seamlessly via WhatsApp and standard SMS. Farmers and drivers can list crops, confirm transport space, and receive delivery notifications on any phone.',
    },
    {
      q: 'How does FarmLink handle transport?',
      a: 'FarmLink coordinates vetted commercial haulage operators and refrigerated trucks. Crucially, we offer load consolidation: if you only have 40 or 70 crates, we combine your produce with neighboring farms on the same route, saving you the high cost of chartering an entire vehicle.',
    },
    {
      q: 'How does payment work?',
      a: 'Transactions are protected through a transparent escrow arrangement. When an order is confirmed, buyer payment is safely secured in escrow. Once the truck arrives, crate quantities are verified, and the buyer marks digital receipt, funds are released directly to farmer and transporter bank accounts without delayed paper reconciliation.',
    },
    {
      q: 'Does FarmLink buy produce directly from farmers?',
      a: 'FarmLink is a B2B coordination platform. We do not purchase and hoard produce; instead, we directly connect farmers and aggregators with verified wholesale buyers, industrial food processors, and logistics providers, providing the technology and escrow that guarantee fair trades.',
    },
    {
      q: 'How can I join the early-access list?',
      a: 'Simply fill out the short Early Access form above or send a WhatsApp message to our team at +234 812 790 4630. Our onboarding team will follow up directly to learn your typical harvest schedules and routes.',
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-24 bg-white text-[#202522] border-b border-[#092C24]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#075B3D]">
            Clear Answers
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.625rem] font-semibold text-[#092C24] tracking-tight [text-wrap:balance]">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-[#202522]/80 max-w-2xl mx-auto [text-wrap:pretty]">
            Everything you need to know about FarmLink by Eurotas and how we coordinate
            produce logistics in Nigeria.
          </p>
        </div>

        {/* FAQ Accordion - All collapsed initially, independent toggles */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = !!openIndices[idx];
            const headerId = `faq-header-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${
                  isOpen ? 'border-[#D4AF37]/80 bg-[#FFF9ED]/30' : 'border-[#092C24]/12 bg-white hover:border-[#D4AF37]/60'
                }`}
              >
                <button
                  type="button"
                  id={headerId}
                  onClick={() => toggleItem(idx)}
                  className="w-full p-5 text-left font-semibold text-[#092C24] flex items-center justify-between gap-4 hover:bg-[#FFF9ED]/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="text-base sm:text-lg font-semibold text-[#092C24]">{faq.q}</span>
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
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="disclosure-content"
                  data-open={isOpen}
                >
                  <div className={`disclosure-inner ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
                    <div className="px-5 pb-5 pt-3 text-sm text-[#202522]/85 leading-relaxed border-t border-[#092C24]/10">
                      {faq.a}
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
