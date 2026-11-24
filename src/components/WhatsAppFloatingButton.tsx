import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  return (
    <aside aria-label="Support chat" className="fixed bottom-5 right-5 z-40">
      <a
        href="https://wa.me/2348127904630?text=Hello%20FarmLink%20by%20Eurotas%2C%20I%20would%20like%20to%20chat%20with%20your%20team."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#075B3D] hover:bg-[#092C24] text-[#FFF9ED] px-4 py-3 rounded-full shadow-lg shadow-black/25 transition-all text-xs sm:text-sm font-semibold border border-[#D4AF37]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
        aria-label="Chat with FarmLink by Eurotas on WhatsApp"
      >
        <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
        <span className="hidden sm:inline">WhatsApp Us</span>
      </a>
    </aside>
  );
};
