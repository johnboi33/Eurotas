import React, { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';

interface NavbarProps {
  onNavigateTo: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateTo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Who It Is For', id: 'who-it-is-for' },
    { label: 'Survey', id: 'survey' },
    { label: 'Early Access', id: 'early-access' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateTo(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#092C24]/95 backdrop-blur-md border-b border-[#D4AF37]/25 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Brand Zone */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg p-1"
            >
              <picture className="h-12 sm:h-14 w-auto shrink-0 flex items-center">
                <source srcSet="/assets/eurotas-logo.webp" type="image/webp" />
                <img
                  src="/assets/eurotas-logo.png"
                  alt="Eurotas logo"
                  width={360}
                  height={239}
                  loading="eager"
                  decoding="async"
                  className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                />
              </picture>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-tight text-[#FFF9ED] whitespace-nowrap leading-none">
                  FarmLink
                </span>
                <span className="text-[10px] font-semibold text-[#D4AF37] tracking-[0.18em] uppercase mt-1 whitespace-nowrap">
                  by Eurotas
                </span>
              </div>
            </button>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-[#FFF9ED]/85">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="hover:text-[#FFD700] transition-colors whitespace-nowrap shrink-0 py-1.5 border-b border-transparent hover:border-[#D4AF37] focus:outline-none focus-visible:text-[#FFD700]"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Primary Action Zone (Desktop) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">

            <a
              href="https://wa.me/2348127904630?text=Hello%20FarmLink%20by%20Eurotas%2C%20I%20would%20like%20to%20learn%20more%20about%20early%20access."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#FFF9ED]/90 hover:text-[#FFF9ED] bg-transparent hover:bg-[#075B3D]/60 rounded-lg transition-colors border border-[#FFF9ED]/20 whitespace-nowrap shrink-0"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => handleLinkClick('early-access')}
              className="px-5 py-2.5 text-sm font-semibold text-[#092C24] bg-golden-radiance hover:brightness-105 active:brightness-95 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#092C24]"
            >
              Join Early Access
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2.5">
            <button
              onClick={() => handleLinkClick('early-access')}
              className="px-3.5 py-2 text-xs font-semibold text-[#092C24] bg-golden-radiance rounded-lg transition-all whitespace-nowrap shrink-0"
            >
              Join
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#FFF9ED] hover:text-[#FFD700] focus:outline-none rounded-lg hover:bg-[#075B3D]/50"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#092C24] border-b border-[#D4AF37]/30 shadow-xl px-4 pt-3 pb-6 space-y-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-[#FFF9ED]/90 hover:bg-[#075B3D]/60 hover:text-[#FFD700] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#D4AF37]/20 flex flex-col gap-2.5">
            <button
              onClick={() => handleLinkClick('early-access')}
              className="w-full py-3 text-center font-semibold text-[#092C24] bg-golden-radiance rounded-lg shadow-sm text-sm"
            >
              Join Early Access
            </button>
            <a
              href="https://wa.me/2348127904630?text=Hello%20FarmLink%20by%20Eurotas%2C%20I%20would%20like%20to%20learn%20more%20about%20early%20access."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-center font-medium text-[#FFF9ED] bg-[#075B3D] rounded-lg text-sm border border-[#D4AF37]/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>Chat With Us on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
