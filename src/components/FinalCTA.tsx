import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';

interface FinalCTAProps {
  onJoinEarlyAccess: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onJoinEarlyAccess }) => {
  return (
    <section className="py-20 lg:py-24 bg-emerald-depth text-[#FFF9ED] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
          FarmLink by Eurotas · Nigeria B2B Distribution
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFF9ED] [text-wrap:balance]">
          Join the FarmLink Early-Access List.
        </h2>

        <p className="text-base sm:text-xl text-[#FFF9ED]/85 max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
          Be among the first farmers, aggregators, transporters, and buyers to use FarmLink when it launches.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onJoinEarlyAccess}
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-[#092C24] bg-golden-radiance hover:brightness-105 active:brightness-95 rounded-xl shadow-lg shadow-black/25 transition-all flex items-center justify-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]"
          >
            <span>Join Early Access</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="https://wa.me/2348127904630?text=Hello%20Eurotas%2C%20I%20would%20like%20to%20chat%20about%20FarmLink%20early%20access."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-4 text-base font-semibold text-[#FFF9ED] bg-[#075B3D] hover:bg-[#092C24] rounded-xl border border-[#D4AF37]/35 transition-colors flex items-center justify-center gap-2.5"
          >
            <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>Chat With Eurotas on WhatsApp</span>
          </a>
        </div>

        <p className="text-xs text-[#FFF9ED]/70 pt-2">
          No setup fees · Simple WhatsApp onboarding · Priority dispatch matching
        </p>
      </div>
    </section>
  );
};
