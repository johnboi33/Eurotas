import React from 'react';
import { MapPin } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-[#092C24] border-y border-[#D4AF37]/25 py-7 text-[#FFF9ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Main Trust Line */}
          <div className="text-center lg:text-left">
            <p className="font-display text-lg sm:text-xl font-semibold text-[#FFF9ED] tracking-tight">
              Connecting farms, markets, transport, and buyers.
            </p>
            <p className="text-xs text-[#FFF9ED]/70 mt-1">
              Coordinating high-loss corridors across Northern farms and Southern consumer markets.
            </p>
          </div>

          {/* Key Agricultural Corridors */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#075B3D]/40 border border-[#D4AF37]/25 text-[#FFF9ED]/90">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold text-[#FFF9ED]">Kano &amp; Kaduna</span>
              <span className="text-[#D4AF37]">➔</span>
              <span>Lagos (Mile 12)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#075B3D]/40 border border-[#D4AF37]/25 text-[#FFF9ED]/90">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold text-[#FFF9ED]">Jos Plateau</span>
              <span className="text-[#D4AF37]">➔</span>
              <span>Port Harcourt &amp; Abuja</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#075B3D]/40 border border-[#D4AF37]/25 text-[#FFF9ED]/90">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold text-[#FFF9ED]">Oyo &amp; Ogun</span>
              <span className="text-[#D4AF37]">➔</span>
              <span>Ibadan &amp; Lagos</span>
            </div>
          </div>
        </div>

        {/* Clear Placeholder for Partner Logos */}
        <div className="mt-6 pt-5 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF9ED]/70">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-[#D4AF37]">
              Pilot Onboarding:
            </span>
            <span>Agricultural Cooperatives · Logistics Operators · Wholesale Market Associations</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <div className="px-3 py-1.5 rounded-lg border border-dashed border-[#D4AF37]/35 bg-[#075B3D]/25 text-[#FFF9ED]/80">
              Cooperative Partners [Onboarding]
            </div>
            <div className="px-3 py-1.5 rounded-lg border border-dashed border-[#D4AF37]/35 bg-[#075B3D]/25 text-[#FFF9ED]/80">
              Logistics Fleet [Onboarding]
            </div>
            <div className="hidden md:block px-3 py-1.5 rounded-lg border border-dashed border-[#D4AF37]/35 bg-[#075B3D]/25 text-[#FFF9ED]/80">
              Wholesale Off-takers [Onboarding]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
