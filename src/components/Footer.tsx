import React from 'react';
import { MessageCircle, Mail, MapPin, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigateTo: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTo }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#092C24] text-[#FFF9ED] border-t border-[#D4AF37]/25 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#D4AF37]/20">
          {/* Brand & Mission Line */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <picture className="h-14 sm:h-16 w-auto shrink-0 flex items-center">
                <source srcSet="/assets/eurotas-logo.webp" type="image/webp" />
                <img
                  src="/assets/eurotas-logo.png"
                  alt="Eurotas logo"
                  width={360}
                  height={239}
                  loading="lazy"
                  decoding="async"
                  className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                />
              </picture>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-tight text-[#FFF9ED] leading-none">
                  FarmLink
                </span>
                <span className="text-[10px] font-semibold text-[#D4AF37] tracking-[0.18em] uppercase mt-1">
                  by Eurotas
                </span>
              </div>
            </div>

            <p className="text-sm text-[#FFF9ED]/80 leading-relaxed max-w-sm">
              FarmLink connects farmers, aggregators, transporters, and buyers across Nigeria to coordinate
              perishable produce distribution faster, with less spoilage and transparent payment records.
            </p>

            <div className="pt-2 text-xs text-[#FFF9ED]/75 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Kano · Jos · Kaduna · Abuja · Ibadan · Lagos, Nigeria</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#FFF9ED]/80">
              <li>
                <button
                  onClick={() => onNavigateTo('home')}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTo('how-it-works')}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTo('who-it-is-for')}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Who It Is For
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTo('survey')}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Product Survey
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTo('early-access')}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Join Early Access
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTo('faq')}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Social Media Placeholders */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
              Contact &amp; Connect
            </h4>

            <div className="space-y-2.5 text-sm text-[#FFF9ED]/85">
              <a
                href="mailto:contact@farmlinkeurotas.ng"
                className="flex items-center gap-2.5 hover:text-[#FFD700] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#075B3D]/60 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <Mail className="w-4 h-4" />
                </div>
                <span>contact@farmlinkeurotas.ng</span>
              </a>

              <a
                href="https://wa.me/2348127904630?text=Hello%20FarmLink%20by%20Eurotas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-[#FFD700] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#075B3D]/60 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>+234 812 790 4630 (WhatsApp)</span>
              </a>
            </div>

            {/* Social Media Placeholders */}
            <div className="pt-2">
              <div className="text-xs text-[#FFF9ED]/65 mb-2">Connect with Eurotas:</div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <a
                  href="#contact"
                  className="px-3 py-1.5 rounded-lg bg-[#075B3D]/40 hover:bg-[#075B3D] border border-[#D4AF37]/25 text-[#FFF9ED]/85 hover:text-[#FFD700] transition-colors"
                  title="LinkedIn"
                >
                  LinkedIn
                </a>
                <a
                  href="#contact"
                  className="px-3 py-1.5 rounded-lg bg-[#075B3D]/40 hover:bg-[#075B3D] border border-[#D4AF37]/25 text-[#FFF9ED]/85 hover:text-[#FFD700] transition-colors"
                  title="X (Twitter)"
                >
                  X (Twitter)
                </a>
                <a
                  href="#contact"
                  className="px-3 py-1.5 rounded-lg bg-[#075B3D]/40 hover:bg-[#075B3D] border border-[#D4AF37]/25 text-[#FFF9ED]/85 hover:text-[#FFD700] transition-colors"
                  title="Facebook"
                >
                  Facebook
                </a>
                <a
                  href="#contact"
                  className="px-3 py-1.5 rounded-lg bg-[#075B3D]/40 hover:bg-[#075B3D] border border-[#D4AF37]/25 text-[#FFF9ED]/85 hover:text-[#FFD700] transition-colors"
                  title="Instagram"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF9ED]/65">
          <p>© {new Date().getFullYear()} FarmLink by Eurotas. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>B2B Produce Logistics for Nigeria</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#D4AF37] hover:text-[#FFD700] transition-colors font-medium"
              aria-label="Scroll to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
