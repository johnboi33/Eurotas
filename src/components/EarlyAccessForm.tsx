import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  Lock,
} from 'lucide-react';
import { EarlyAccessFormData, RoleType, ProduceType, ChallengeType } from '../types';
import { saveEarlyAccessSubmission } from '../services/submissionsStore';
import { tryAutoSyncSubmission } from '../services/googleSheets';
import { getAccessToken } from '../services/googleAuth';

interface EarlyAccessFormProps {
  initialRole?: RoleType;
}

export const EarlyAccessForm: React.FC<EarlyAccessFormProps> = ({ initialRole }) => {
  const [formData, setFormData] = useState<EarlyAccessFormData>({
    fullName: '',
    whatsappNumber: '',
    role: initialRole || 'Farmer',
    cityOrState: '',
    mainProduce: 'Tomatoes',
    biggestChallenge: 'Finding Reliable Buyers',
    wouldLikeEarlyAccess: 'Yes',
  });

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (initialRole) {
      setFormData((prev) => ({ ...prev, role: initialRole }));
    }
  }, [initialRole]);

  const roles: RoleType[] = [
    'Farmer',
    'Aggregator/Trader',
    'Transporter',
    'Buyer/Wholesaler',
    'Processor',
    'Other',
  ];

  const produceList: ProduceType[] = [
    'Tomatoes',
    'Peppers (Rodo / Tatase / Bawa)',
    'Onions',
    'Leafy Vegetables',
    'Fruits',
    'Other',
  ];

  const challenges: ChallengeType[] = [
    'Finding Reliable Buyers',
    'Transport Delays & Breakdowns',
    'Produce Spoilage / Post-Harvest Losses',
    'Late or Unclear Payments',
    'Other',
  ];

  const quickLocations = ['Kano', 'Kaduna', 'Jos (Plateau)', 'Lagos', 'Ibadan (Oyo)', 'Abuja', 'Ogun', 'Benue'];

  const constructWhatsAppMessage = (data: EarlyAccessFormData) => {
    return `*FarmLink by Eurotas — Early Access Registration*
---------------------------------------
*Full Name:* ${data.fullName.trim()}
*WhatsApp:* ${data.whatsappNumber.trim()}
*Role:* ${data.role}
*Location:* ${data.cityOrState.trim()}
*Main Produce:* ${data.mainProduce}
*Biggest Challenge:* ${data.biggestChallenge}
*Would like early access:* ${data.wouldLikeEarlyAccess}
---------------------------------------
Please confirm my spot in the upcoming pilot.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.whatsappNumber.trim()) {
      setErrorMessage('Please enter your WhatsApp phone number.');
      return;
    }
    if (!formData.cityOrState.trim()) {
      setErrorMessage('Please enter your city or state in Nigeria.');
      return;
    }

    setErrorMessage('');
    const saved = saveEarlyAccessSubmission(formData);
    getAccessToken().then((tok) => {
      if (tok) {
        tryAutoSyncSubmission(tok, 'early_access', saved);
      }
    });

    const message = constructWhatsAppMessage(formData);
    const whatsappUrl = `https://wa.me/2348127904630?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const handleCopySummary = () => {
    const message = constructWhatsAppMessage(formData);
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="early-access" className="py-20 lg:py-24 bg-[#092C24] text-[#FFF9ED] relative overflow-hidden">
      {/* Hairline gold border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
            Priority Onboarding
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[#FFF9ED] [text-wrap:balance]">
            Be Among the First to Use FarmLink.
          </h2>

          <p className="text-base sm:text-lg text-[#FFF9ED]/85 max-w-2xl mx-auto [text-wrap:pretty]">
            Join farmers, aggregators, transport owners, and wholesale produce buyers preparing for the upcoming
            launch. Lock in priority matching and coordinated pilot routes.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white text-[#202522] rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#D4AF37]/40">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Row 1: Name and WhatsApp Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#092C24] mb-1.5">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mallam Ibrahim Musa / Grace Adeleke"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] focus:border-transparent transition-all placeholder:text-[#202522]/40 bg-[#FFF9ED]/40 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#092C24] mb-1.5">
                    WhatsApp Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] focus:border-transparent transition-all placeholder:text-[#202522]/40 bg-[#FFF9ED]/40 focus:bg-white"
                  />
                  <span className="text-[11px] text-[#202522]/65 mt-1 block">
                    We will send your early invite and produce updates to this number.
                  </span>
                </div>
              </div>

              {/* Row 2: Role Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#092C24] mb-2">
                  What is Your Primary Role? <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {roles.map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setFormData({ ...formData, role: r })}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all text-left flex items-center justify-between ${
                        formData.role === r
                          ? 'bg-[#075B3D] text-[#FFF9ED] border-[#075B3D] shadow-xs'
                          : 'bg-[#FFF9ED]/50 text-[#202522] border-[#092C24]/15 hover:bg-[#FFF9ED]'
                      }`}
                    >
                      <span className="truncate">{r}</span>
                      {formData.role === r && <Check className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: City or State */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#092C24] mb-1.5">
                  City or State (Nigeria) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jos, Plateau State / Mile 12, Lagos / Kano Municipal"
                  value={formData.cityOrState}
                  onChange={(e) => setFormData({ ...formData, cityOrState: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] focus:border-transparent transition-all placeholder:text-[#202522]/40 bg-[#FFF9ED]/40 focus:bg-white"
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-[#202522]/65">Quick select:</span>
                  {quickLocations.map((loc) => (
                    <button
                      type="button"
                      key={loc}
                      onClick={() => setFormData({ ...formData, cityOrState: loc })}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#FFF9ED] hover:bg-[#075B3D]/10 text-[#092C24] border border-[#092C24]/10 transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Main Produce & Biggest Challenge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#092C24] mb-1.5">
                    Main Produce Handled <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.mainProduce}
                    onChange={(e) => setFormData({ ...formData, mainProduce: e.target.value as ProduceType })}
                    className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] bg-[#FFF9ED]/40 focus:bg-white font-medium"
                  >
                    {produceList.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#092C24] mb-1.5">
                    Your Biggest Challenge <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.biggestChallenge}
                    onChange={(e) => setFormData({ ...formData, biggestChallenge: e.target.value as ChallengeType })}
                    className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] bg-[#FFF9ED]/40 focus:bg-white font-medium"
                  >
                    {challenges.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Would you like early access? Yes / Maybe / No */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#092C24] mb-2">
                  Would you like early access when FarmLink launches? <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Yes', 'Maybe', 'No'] as const).map((choice) => (
                    <button
                      type="button"
                      key={choice}
                      onClick={() => setFormData({ ...formData, wouldLikeEarlyAccess: choice })}
                      className={`py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm border transition-all text-center ${
                        formData.wouldLikeEarlyAccess === choice
                          ? 'bg-golden-radiance text-[#092C24] border-[#D4AF37] shadow-xs'
                          : 'bg-[#FFF9ED]/50 text-[#202522] border-[#092C24]/15 hover:bg-[#FFF9ED]'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA & Privacy Reassurance */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full py-4 text-base font-semibold text-[#092C24] bg-golden-radiance hover:brightness-105 active:brightness-95 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  <Send className="w-4 h-4" />
                  <span>Join Early Access</span>
                </button>
                <p className="text-[11px] text-center text-[#202522]/70 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#075B3D] shrink-0" />
                  <span>
                    Your details are recorded for FarmLink pilot onboarding and sent via WhatsApp (+234 812 790 4630). We never sell or share your contact information.
                  </span>
                </p>
              </div>
            </form>
          ) : (
            /* Success Confirmation State */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#075B3D]/10 text-[#075B3D] border border-[#D4AF37]/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-[#092C24] tracking-tight">
                  Welcome to the FarmLink Early Access List
                </h3>
                <p className="text-sm text-[#202522]/80 max-w-lg mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>. Your registration has been recorded and formatted
                  for our coordination team.
                </p>
              </div>

              <div className="bg-[#FFF9ED] border border-[#D4AF37]/35 rounded-2xl p-4 sm:p-5 text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-[#092C24]/10 pb-2 font-semibold text-[#092C24]">
                  <span>Registered Role:</span>
                  <span className="text-[#075B3D]">{formData.role}</span>
                </div>
                <div className="flex justify-between border-b border-[#092C24]/10 pb-2">
                  <span className="text-[#202522]/70">Location:</span>
                  <span className="font-medium text-[#092C24]">{formData.cityOrState}</span>
                </div>
                <div className="flex justify-between border-b border-[#092C24]/10 pb-2">
                  <span className="text-[#202522]/70">Main Crop:</span>
                  <span className="font-medium text-[#092C24]">{formData.mainProduce}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#202522]/70">WhatsApp:</span>
                  <span className="font-mono font-medium text-[#092C24]">{formData.whatsappNumber}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                <a
                  href={`https://wa.me/2348127904630?text=${encodeURIComponent(constructWhatsAppMessage(formData))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#075B3D] hover:bg-[#092C24] text-[#FFF9ED] font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#D4AF37]/30"
                >
                  <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Open WhatsApp Direct</span>
                </a>

                <button
                  onClick={handleCopySummary}
                  className="w-full sm:w-auto px-5 py-3 bg-[#FFF9ED] hover:bg-[#092C24]/5 text-[#092C24] border border-[#092C24]/20 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-[#075B3D]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-[#075B3D] hover:text-[#092C24] underline font-medium"
                >
                  Register another participant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
