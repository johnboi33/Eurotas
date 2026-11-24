import React from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, Zap, Users, Truck } from 'lucide-react';
import { PhoneMockup } from './PhoneMockup';

interface HeroProps {
  onJoinEarlyAccess: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinEarlyAccess }) => {
  return (
    <section className="relative overflow-hidden bg-emerald-depth text-[#FFF9ED] pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Subtle architectural hairline lattice */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Clean Unboxed Kicker */}
            <div className="inline-flex items-center justify-center lg:justify-start gap-2.5 text-xs sm:text-sm font-medium tracking-wider uppercase text-[#D4AF37]">
              <span>Early Access</span>
              <span aria-hidden="true" className="text-[#FFF9ED]/40">|</span>
              <span className="text-[#FFF9ED]/90">Nigeria</span>
            </div>

            {/* Headline in Playfair Display */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.12] text-[#FFF9ED] [text-wrap:balance]">
              Move Fresh Produce From Farm to Market{' '}
              <span className="text-imperial-metallic">Faster.</span>
            </h1>

            {/* Subheadline in Montserrat */}
            <p className="text-base sm:text-lg text-[#FFF9ED]/85 leading-[1.65] max-w-2xl mx-auto lg:mx-0 [text-wrap:pretty]">
              FarmLink by Eurotas connects farmers, aggregators, transporters, and buyers
              to reduce spoilage, improve market access, and make produce delivery more
              coordinated.
            </p>

            {/* Key Value Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="bg-[#092C24]/70 border border-[#D4AF37]/25 rounded-xl p-3">
                <div className="text-[11px] text-[#D4AF37] flex items-center gap-1.5 font-semibold">
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span>Speed</span>
                </div>
                <div className="text-xs font-semibold text-[#FFF9ED] mt-1">Rapid Dispatch</div>
              </div>
              <div className="bg-[#092C24]/70 border border-[#D4AF37]/25 rounded-xl p-3">
                <div className="text-[11px] text-[#D4AF37] flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Protection</span>
                </div>
                <div className="text-xs font-semibold text-[#FFF9ED] mt-1">Less Spoilage</div>
              </div>
              <div className="bg-[#092C24]/70 border border-[#D4AF37]/25 rounded-xl p-3">
                <div className="text-[11px] text-[#D4AF37] flex items-center gap-1.5 font-semibold">
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>Logistics</span>
                </div>
                <div className="text-xs font-semibold text-[#FFF9ED] mt-1">Shared Trucks</div>
              </div>
              <div className="bg-[#092C24]/70 border border-[#D4AF37]/25 rounded-xl p-3">
                <div className="text-[11px] text-[#D4AF37] flex items-center gap-1.5 font-semibold">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>Settlement</span>
                </div>
                <div className="text-xs font-semibold text-[#FFF9ED] mt-1">Clear Payouts</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={onJoinEarlyAccess}
                className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-semibold text-[#092C24] bg-golden-radiance hover:brightness-105 active:brightness-95 rounded-xl shadow-lg shadow-black/25 transition-all flex items-center justify-center gap-2 group whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]"
              >
                <span>Join Early Access</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://wa.me/2348127904630?text=Hello%20FarmLink%20by%20Eurotas%2C%20I%20am%20interested%20in%20early%20access."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-semibold text-[#FFF9ED] bg-[#075B3D] hover:bg-[#075B3D]/85 rounded-xl border border-[#D4AF37]/35 transition-colors flex items-center justify-center gap-2.5 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Chat With Us on WhatsApp</span>
              </a>
            </div>

            {/* Trust Line */}
            <div className="pt-2 text-xs sm:text-sm text-[#FFF9ED]/75 flex items-center justify-center lg:justify-start gap-2">
              <span className="w-4 h-px bg-[#D4AF37]" aria-hidden="true" />
              <span>Built for farmers, traders, transporters, and produce buyers.</span>
            </div>
          </div>

          {/* Right Column: Interactive Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};
