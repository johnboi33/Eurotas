import React, { useState } from 'react';
import {
  Package,
  ShoppingCart,
  Truck,
  CheckCircle2,
  CreditCard,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

type MockupTab = 'listings' | 'requests' | 'transport' | 'delivery' | 'payments';

export const PhoneMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MockupTab>('listings');

  return (
    <div className="relative mx-auto max-w-[340px] sm:max-w-[380px] w-full">
      {/* Restrained Gold & Emerald ambient glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-[#D4AF37]/15 via-[#075B3D]/20 to-[#FFD700]/10 rounded-[46px] blur-xl -z-10" />

      {/* Phone Hardware Shell */}
      <div className="relative bg-[#0d1412] p-3 sm:p-3.5 rounded-[42px] shadow-2xl shadow-black/40 border-2 border-[#D4AF37]/35">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#0d1412] rounded-full z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-[#1b2924] rounded-full mr-2" />
          <div className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full" />
        </div>

        {/* Screen Bezel */}
        <div className="relative bg-[#FFF9ED] rounded-[34px] overflow-hidden flex flex-col min-h-[570px] border border-[#D4AF37]/25 text-[#202522] text-xs">
          {/* Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-medium text-[#202522]/70 select-none bg-[#FFF9ED]">
            <span className="tabular-nums">09:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#075B3D] font-semibold tracking-wider">MTN 4G</span>
              <div className="w-4 h-2 rounded-xs border border-[#202522]/40 p-0.5 flex items-center">
                <div className="w-full h-full bg-[#075B3D] rounded-2xs" />
              </div>
            </div>
          </div>

          {/* App Header */}
          <div className="px-4 py-2.5 bg-[#092C24] text-[#FFF9ED] flex items-center justify-between border-b border-[#D4AF37]/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#075B3D] border border-[#D4AF37]/50 flex items-center justify-center font-bold text-[11px] text-[#FFD700]">
                FL
              </div>
              <div>
                <div className="font-semibold text-xs tracking-tight text-[#FFF9ED]">FarmLink Nigeria</div>
                <div className="text-[10px] text-[#D4AF37]">Produce Exchange · Active</div>
              </div>
            </div>
            <div className="text-[10px] font-semibold text-[#FFF9ED]/90 tracking-wide">
              Corridor View
            </div>
          </div>

          {/* Interactive Screen Sub-Tabs */}
          <div className="bg-[#092C24]/5 px-2 py-1.5 border-b border-[#092C24]/10 flex gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === 'listings'
                  ? 'bg-[#075B3D] text-[#FFF9ED] shadow-xs'
                  : 'text-[#202522]/75 hover:bg-[#092C24]/10'
              }`}
            >
              <Package className="w-3 h-3" />
              Listings
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === 'requests'
                  ? 'bg-[#075B3D] text-[#FFF9ED] shadow-xs'
                  : 'text-[#202522]/75 hover:bg-[#092C24]/10'
              }`}
            >
              <ShoppingCart className="w-3 h-3" />
              Requests
            </button>
            <button
              onClick={() => setActiveTab('transport')}
              className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === 'transport'
                  ? 'bg-[#075B3D] text-[#FFF9ED] shadow-xs'
                  : 'text-[#202522]/75 hover:bg-[#092C24]/10'
              }`}
            >
              <Truck className="w-3 h-3" />
              Transport
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === 'delivery'
                  ? 'bg-[#075B3D] text-[#FFF9ED] shadow-xs'
                  : 'text-[#202522]/75 hover:bg-[#092C24]/10'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Tracker
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === 'payments'
                  ? 'bg-[#075B3D] text-[#FFF9ED] shadow-xs'
                  : 'text-[#202522]/75 hover:bg-[#092C24]/10'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              Payouts
            </button>
          </div>

          {/* Interactive Screen Content Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
            {/* TAB 1: PRODUCE LISTINGS */}
            {activeTab === 'listings' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#202522]/70 font-medium">
                  <span>Farmgate Supply (Jos &amp; Kano)</span>
                  <span className="text-[#075B3D] font-semibold">3 Active</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#092C24]/12 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-[#092C24] text-xs">
                        Roma Tomatoes (Grade A)
                      </div>
                      <div className="text-[10px] text-[#202522]/65 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#075B3D]" />
                        <span>Jos North, Plateau · Fresh Harvest</span>
                      </div>
                    </div>
                    <span className="text-[#8A6414] font-bold text-xs tabular-nums">₦22,500/crate</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#092C24]/10 flex items-center justify-between text-[10px]">
                    <span className="text-[#202522]/80">Available: <strong className="tabular-nums">75 wooden crates</strong></span>
                    <span className="text-[#075B3D] font-semibold">Ready today</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#092C24]/12 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-[#092C24] text-xs">Scotch Bonnet / Rodo</div>
                      <div className="text-[10px] text-[#202522]/65 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#075B3D]" />
                        <span>Kaduna South · Zaria Coop</span>
                      </div>
                    </div>
                    <span className="text-[#8A6414] font-bold text-xs tabular-nums">₦34,000/bag</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#092C24]/10 flex items-center justify-between text-[10px]">
                    <span className="text-[#202522]/80">Available: <strong className="tabular-nums">40 jute bags</strong></span>
                    <span className="text-[#202522]/60">Harvest: Yesterday</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#092C24]/12 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-[#092C24] text-xs">Sweet Bell Pepper (Tatase)</div>
                      <div className="text-[10px] text-[#202522]/65 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#075B3D]" />
                        <span>Kura LGA, Kano State</span>
                      </div>
                    </div>
                    <span className="text-[#8A6414] font-bold text-xs tabular-nums">₦28,000/bag</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#092C24]/10 flex items-center justify-between text-[10px]">
                    <span className="text-[#202522]/80">Available: <strong className="tabular-nums">30 bags</strong></span>
                    <span className="text-[#075B3D] font-semibold">Consolidated load</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BUYER REQUESTS */}
            {activeTab === 'requests' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#202522]/70 font-medium">
                  <span>Market Buyer Demands</span>
                  <span className="text-[#075B3D] font-semibold">2 Verified Off-Takers</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#092C24]/12 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-[#092C24] text-xs">Mile 12 Wholesaler #04</span>
                      <div className="text-[10px] text-[#202522]/65 mt-0.5">Lagos State · High-Volume</div>
                    </div>
                    <span className="text-[10px] font-bold text-[#075B3D]">
                      Funds in Escrow
                    </span>
                  </div>
                  <div className="mt-1.5 bg-[#FFF9ED] p-2 rounded-lg text-[10px] space-y-1 border border-[#D4AF37]/20">
                    <div className="flex justify-between">
                      <span className="text-[#202522]/70">Target Produce:</span>
                      <strong className="text-[#092C24] tabular-nums">120 Crates Fresh Tomatoes</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#202522]/70">Target Arrival:</span>
                      <strong className="text-[#092C24]">Friday morning</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#092C24]/12 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-[#092C24] text-xs">Bodija Market Trader</span>
                      <div className="text-[10px] text-[#202522]/65 mt-0.5">Ibadan, Oyo State</div>
                    </div>
                    <span className="text-[10px] font-bold text-[#075B3D]">
                      Vetted Buyer
                    </span>
                  </div>
                  <div className="mt-1.5 bg-[#FFF9ED] p-2 rounded-lg text-[10px] space-y-1 border border-[#D4AF37]/20">
                    <div className="flex justify-between">
                      <span className="text-[#202522]/70">Target Produce:</span>
                      <strong className="text-[#092C24] tabular-nums">50 Bags Fresh Rodo</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#202522]/70">Consolidation:</span>
                      <strong className="text-[#075B3D]">Can share truck space</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TRANSPORT JOBS */}
            {activeTab === 'transport' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#202522]/70 font-medium">
                  <span>Scheduled Haulage Runs</span>
                  <span className="text-[#075B3D] font-semibold">Available Space</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#D4AF37]/50 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#092C24] text-xs flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#075B3D]" />
                      <span>Jos ➔ Lagos (Mile 12)</span>
                    </div>
                    <span className="text-[#075B3D] font-bold text-[11px]">8-Ton Chilled</span>
                  </div>
                  <div className="mt-2 text-[10px] text-[#202522]/80 space-y-1">
                    <div className="flex justify-between">
                      <span>Departure:</span>
                      <span className="font-semibold text-[#092C24]">Today, 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Space:</span>
                      <span className="font-semibold text-[#8A6414] tabular-nums">45 Crates Remaining</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Haulage Rate:</span>
                      <span className="font-semibold text-[#092C24] tabular-nums">₦2,800 / crate</span>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-[#092C24]/10 flex items-center justify-between">
                    <span className="text-[10px] text-[#075B3D] font-medium">Route Tracked</span>
                    <span className="bg-golden-radiance text-[#092C24] font-bold text-[10px] px-2.5 py-0.5 rounded">
                      Book Space
                    </span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#092C24]/12 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#092C24] text-xs flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#075B3D]" />
                      <span>Kano ➔ Abuja (Wuse Market)</span>
                    </div>
                    <span className="text-[#202522]/70 font-semibold text-[10px]">5-Ton Truck</span>
                  </div>
                  <div className="mt-1 text-[10px] text-[#202522]/65">
                    Departing tomorrow morning · Direct delivery
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DELIVERY STATUS */}
            {activeTab === 'delivery' && (
              <div className="space-y-2">
                <div className="bg-[#092C24] text-[#FFF9ED] p-3 rounded-xl border border-[#D4AF37]/30">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#D4AF37] font-mono">Shipment #FL-8821</span>
                    <span className="text-[#FFD700] font-semibold text-[10px]">
                      In Transit
                    </span>
                  </div>
                  <div className="mt-1.5 font-bold text-sm">Jos Farm Hub ➔ Lagos Mile 12</div>
                  <div className="mt-1 text-[11px] text-[#FFF9ED]/80 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span className="tabular-nums">Estimated Arrival: 5h 20m</span>
                  </div>
                </div>

                {/* Waypoints */}
                <div className="bg-white p-2.5 rounded-xl border border-[#092C24]/12 shadow-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#075B3D] text-[#FFF9ED] flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-[#092C24] text-[11px]">Loaded &amp; Inspected at Jos Farm Hub</div>
                      <div className="text-[10px] text-[#202522]/65 tabular-nums">80 crates checked · Seal #08492</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#075B3D] text-[#FFF9ED] flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-[#092C24] text-[11px]">Lokoja Checkpoint Passed</div>
                      <div className="text-[10px] text-[#202522]/65 tabular-nums">Condition checked · 15°C</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#092C24] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-[#8A6414] text-[11px]">Approaching Sagamu Interchange</div>
                      <div className="text-[10px] text-[#202522]/65">Driver: Ibrahim S. · Contact available</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 opacity-60">
                    <div className="w-4 h-4 rounded-full border border-[#092C24]/30 text-[#202522]/60 flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <div className="font-semibold text-[#092C24] text-[11px]">Final Mile 12 Offloading &amp; Sign-off</div>
                      <div className="text-[10px] text-[#202522]/60">Buyer receipt confirmation</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PAYMENT CONFIRMATION */}
            {activeTab === 'payments' && (
              <div className="space-y-2">
                <div className="bg-white p-3 rounded-xl border border-[#D4AF37]/45 shadow-xs">
                  <div className="flex items-center gap-1.5 text-[#075B3D] font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#075B3D]" />
                    <span>FarmLink Protected Settlement</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#092C24] tabular-nums">
                    ₦960,000.00
                  </div>
                  <div className="text-[10px] text-[#075B3D] font-medium mt-0.5">
                    Funds verified &amp; secured for Delivery #FL-8821
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#092C24]/10 space-y-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-[#202522]/70">Farmer Payout (80 Crates):</span>
                      <span className="font-bold text-[#092C24] tabular-nums">₦720,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#202522]/70">Transporter Freight:</span>
                      <span className="font-bold text-[#092C24] tabular-nums">₦240,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#202522]/70">Release Trigger:</span>
                      <span className="font-semibold text-[#075B3D]">Buyer Confirmation</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#092C24] text-[#FFF9ED] p-2.5 rounded-xl text-[10px] flex items-start gap-2 border border-[#D4AF37]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>
                    No delayed cash disputes or lost paper records. Transaction ledger is saved with digital receipt.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Dock */}
          <div className="bg-white border-t border-[#092C24]/10 px-3 py-2 flex items-center justify-between text-[10px] text-[#202522]/70">
            <span className="font-medium text-[#092C24]">Tap tabs above to preview</span>
            <span className="text-[#8A6414] font-semibold flex items-center gap-0.5">
              Interactive Preview <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
