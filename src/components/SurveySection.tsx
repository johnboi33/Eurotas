import React, { useState } from 'react';
import {
  ClipboardCheck,
  MessageCircle,
  Copy,
  Check,
  Send,
  Lock,
  ChevronDown,
  ClipboardList,
} from 'lucide-react';
import { SurveyFormData } from '../types';
import { saveSurveySubmission } from '../services/submissionsStore';
import { tryAutoSyncSubmission } from '../services/googleSheets';
import { getAccessToken } from '../services/googleAuth';

interface SurveySectionProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const SurveySection: React.FC<SurveySectionProps> = ({ isOpen: controlledOpen, onToggle }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isSurveyOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleToggleSurvey = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };
  const [formData, setFormData] = useState<SurveyFormData>({
    roleDescription: 'Farmer (Smallholder / Commercial)',
    produceTypes: ['Tomatoes'],
    cityOrState: '',
    biggestChallenge: 'Produce spoilage / heat delay in transit',
    estimatedLoss: '25% – 40% of harvest lost',
    currentTools: ['Phone calls & SMS', 'Physical middlemen at market'],
    preferredPayment: 'Direct bank transfer upon verified delivery',
    launchInterest: 'Definitely yes — ready to test immediately',
    mustHaveFeature: 'Guaranteed buyers before harvest starts',
    fullName: '',
    whatsappNumber: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleProduce = (item: string) => {
    setFormData((prev) => {
      const exists = prev.produceTypes.includes(item);
      if (exists) {
        if (prev.produceTypes.length === 1) return prev;
        return { ...prev, produceTypes: prev.produceTypes.filter((p) => p !== item) };
      } else {
        return { ...prev, produceTypes: [...prev.produceTypes, item] };
      }
    });
  };

  const toggleTool = (tool: string) => {
    setFormData((prev) => {
      const exists = prev.currentTools.includes(tool);
      if (exists) {
        if (prev.currentTools.length === 1) return prev;
        return { ...prev, currentTools: prev.currentTools.filter((t) => t !== tool) };
      } else {
        return { ...prev, currentTools: [...prev.currentTools, tool] };
      }
    });
  };

  const constructSurveyWhatsAppMessage = (data: SurveyFormData) => {
    return `*FarmLink by Eurotas — Product Survey Response*
=========================================
1. *Role:* ${data.roleDescription}
2. *Produce Handled:* ${data.produceTypes.join(', ')}
3. *Location:* ${data.cityOrState.trim()}
4. *Main Challenge:* ${data.biggestChallenge}
5. *Loss Due to Spoilage/Delays:* ${data.estimatedLoss}
6. *Current Tools Used:* ${data.currentTools.join(', ')}
7. *Preferred Payment Method:* ${data.preferredPayment}
8. *Interest in FarmLink Launch:* ${data.launchInterest}
9. *Feature for Immediate Use:* ${data.mustHaveFeature.trim()}
10. *Respondent Contact:*
   - Name: ${data.fullName.trim()}
   - WhatsApp: ${data.whatsappNumber.trim()}
   - Email: ${data.email.trim() || 'N/A'}
=========================================
Thank you for building FarmLink for Nigeria!`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cityOrState.trim()) {
      setErrorMsg('Please answer Question 3 (Your state or city).');
      return;
    }
    if (!formData.fullName.trim() || !formData.whatsappNumber.trim()) {
      setErrorMsg('Please provide your Name and WhatsApp number in Question 10.');
      return;
    }

    setErrorMsg('');
    const saved = saveSurveySubmission(formData);
    getAccessToken().then((tok) => {
      if (tok) {
        tryAutoSyncSubmission(tok, 'survey', saved);
      }
    });

    const message = constructSurveyWhatsAppMessage(formData);
    const whatsappUrl = `https://wa.me/2348127904630?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const handleCopy = () => {
    const message = constructSurveyWhatsAppMessage(formData);
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="survey" className="py-20 lg:py-24 bg-[#FFF9ED] text-[#202522] border-b border-[#092C24]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#075B3D]">
            Co-Design With Us
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.625rem] font-semibold text-[#092C24] tracking-tight [text-wrap:balance]">
            Help Us Build FarmLink.
          </h2>

          <p className="text-base sm:text-lg text-[#202522]/80 max-w-2xl mx-auto [text-wrap:pretty]">
            We are designing FarmLink specifically for the reality of Nigerian farm gates and wholesale
            markets. Your answers directly shape how the platform handles orders, trucks, and payouts.
          </p>
        </div>

        {/* Collapsible Survey Card */}
        <div
          className={`bg-white rounded-3xl border transition-colors ${
            isSurveyOpen ? 'border-[#D4AF37] shadow-sm' : 'border-[#092C24]/15 hover:border-[#D4AF37]/60 shadow-xs'
          }`}
        >
          <button
            type="button"
            id="survey-card-header"
            onClick={handleToggleSurvey}
            aria-expanded={isSurveyOpen}
            aria-controls="survey-card-panel"
            className="w-full p-6 sm:p-8 text-left flex items-center justify-between gap-4 rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9ED]"
          >
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#092C24] border border-[#D4AF37]/45 text-[#D4AF37] flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#075B3D]">
                  10-Question Ecosystem Survey
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#092C24] tracking-tight">
                  Share Your Produce, Logistics &amp; Payment Feedback
                </h3>
                <p className="text-xs sm:text-sm text-[#202522]/75">
                  {isSurveyOpen
                    ? 'Complete the 10 questions below and submit directly to our team.'
                    : 'Click to open the 10-question product survey (takes about 2 minutes).'}
                </p>
              </div>
            </div>

            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 border ${
                isSurveyOpen
                  ? 'rotate-180 bg-[#092C24] text-[#D4AF37] border-[#D4AF37]/50'
                  : 'bg-[#FFF9ED] text-[#075B3D] border-[#092C24]/15'
              }`}
              aria-hidden="true"
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>

          <div
            id="survey-card-panel"
            role="region"
            aria-labelledby="survey-card-header"
            className="disclosure-content"
            data-open={isSurveyOpen}
          >
            <div className={`disclosure-inner ${isSurveyOpen ? 'visible' : 'invisible pointer-events-none'}`}>
              <div className="px-6 sm:px-10 pb-8 sm:pb-10 pt-6 border-t border-[#092C24]/10">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Question 1: Role */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-[#092C24]">
                  <span className="text-[#8A6414] font-bold mr-1.5">1.</span>
                  Which best describes you? <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Farmer (Smallholder / Commercial)',
                    'Produce Aggregator / Local Buying Agent',
                    'Commercial Transporter / Driver / Fleet Owner',
                    'Market Wholesaler / Retail Trader (e.g. Mile 12, Bodija)',
                    'Food Processing Company / Industrial Buyer',
                    'Supermarket / Restaurant / Hotel Buyer',
                  ].map((role) => (
                    <button
                      type="button"
                      key={role}
                      onClick={() => setFormData({ ...formData, roleDescription: role })}
                      className={`text-left text-xs p-3 rounded-xl border transition-all flex items-center justify-between ${
                        formData.roleDescription === role
                          ? 'bg-[#075B3D] text-[#FFF9ED] border-[#075B3D] font-semibold shadow-xs'
                          : 'bg-[#FFF9ED]/50 text-[#202522] border-[#092C24]/15 hover:bg-[#FFF9ED] font-medium'
                      }`}
                    >
                      <span>{role}</span>
                      {formData.roleDescription === role && (
                        <Check className="w-3.5 h-3.5 text-[#FFD700] shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Produce Types */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-[#092C24]">
                  <span className="text-[#8A6414] font-bold mr-1.5">2.</span>
                  Which produce do you buy, sell, or transport most often?{' '}
                  <span className="text-[#202522]/60 font-normal text-xs">(Select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Tomatoes',
                    'Peppers (Scotch Bonnet / Rodo)',
                    'Peppers (Tatase / Bell Pepper)',
                    'Peppers (Bawa / Cayenne)',
                    'Onions',
                    'Leafy Vegetables',
                    'Carrots / Cabbage / Cucumber',
                    'Fruits (Watermelon, Citrus)',
                  ].map((item) => {
                    const isSelected = formData.produceTypes.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleProduce(item)}
                        className={`text-xs px-3.5 py-2 rounded-xl border transition-all font-semibold flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#075B3D] text-[#FFF9ED] border-[#075B3D] shadow-xs'
                            : 'bg-[#FFF9ED]/50 text-[#202522] border-[#092C24]/15 hover:bg-[#FFF9ED]'
                        }`}
                      >
                        <span>{item}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FFD700]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: City or State */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#092C24]">
                  <span className="text-[#8A6414] font-bold mr-1.5">3.</span>
                  Which state or city are you based in? <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kano, Kano State / Jos, Plateau / Lagos State / Kaduna"
                  value={formData.cityOrState}
                  onChange={(e) => setFormData({ ...formData, cityOrState: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] bg-[#FFF9ED]/40 focus:bg-white"
                />
              </div>

              {/* Question 4: Biggest Challenge */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-[#092C24]">
                  <span className="text-[#8A6414] font-bold mr-1.5">4.</span>
                  What is your biggest challenge in moving or selling produce?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Produce spoilage / heat delay in transit',
                    'Difficulty finding verified buyers at fair prices',
                    'High transport costs and empty return trips',
                    'Delayed payments, bad debts, or bounced transfers',
                    'Damage to crates / dispute over quantity at arrival',
                    'Lack of cold storage or shaded holding points',
                  ].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setFormData({ ...formData, biggestChallenge: c })}
                      className={`text-left text-xs p-3 rounded-xl border transition-all flex items-center justify-between ${
                        formData.biggestChallenge === c
                          ? 'bg-[#075B3D] text-[#FFF9ED] border-[#075B3D] font-semibold shadow-xs'
                          : 'bg-[#FFF9ED]/50 text-[#202522] border-[#092C24]/15 hover:bg-[#FFF9ED] font-medium'
                      }`}
                    >
                      <span>{c}</span>
                      {formData.biggestChallenge === c && (
                        <Check className="w-3.5 h-3.5 text-[#FFD700] shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 5: Spoilage loss */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-[#092C24]">
                  <span className="text-[#8A6414] font-bold mr-1.5">5.</span>
                  Approximately how much produce do you lose due to spoilage, delays, or lack of buyers?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    'Under 10%',
                    '10% – 25%',
                    '25% – 40% of harvest lost',
                    'Over 40% (Heavy loss)',
                  ].map((tier) => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => setFormData({ ...formData, estimatedLoss: tier })}
                      className={`text-xs p-3 rounded-xl border font-semibold text-center transition-all ${
                        formData.estimatedLoss === tier
                          ? 'bg-golden-radiance text-[#092C24] border-[#D4AF37] shadow-xs'
                          : 'bg-[#FFF9ED]/50 text-[#202522] border-[#092C24]/15 hover:bg-[#FFF9ED]'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 6: Current tools */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-[#092C24]">
                  <span className="text-[#8A6414] font-bold mr-1.5">6.</span>
                  What do you currently use to find buyers, arrange transport, or manage orders?{' '}
                  <span className="text-[#202522]/60 font-normal text-xs">(Select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Phone calls & SMS',
                    'WhatsApp groups',
                    'Physical middlemen at market',
                    'Paper notebooks & handwritten receipts',
                    'Word-of-mouth through friends',
                  ].map((tool) => {
                    const isSelected = formData.currentTools.includes(tool);
                    return (
                      <button
                        type="button"
                        key={tool}
                        onClick={() => toggleTool(tool)}
                        className={`text-xs px-3.5 py-2 rounded-xl border transition-all font-semibold flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#075B3D] text-[#FFF9ED] border-[#075B3D] shadow-xs'
                            : 'bg-[#FFF9ED]/50 text-[#202522] border-[#092C24]/15 hover:bg-[#FFF9ED]'
                        }`}
                      >
                        <span>{tool}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FFD700]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 7: Preferred payment */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-[#092C24]">
                  <span className="text-[#8A6414] font-bold mr-1.5">7.</span>
                  What payment method do you prefer?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Direct bank transfer upon verified delivery',
                    'Escrow holding (funds locked safely before truck leaves)',
                    'Cash on delivery at the market stall',
                    'Mobile money / USSD wallet',
                  ].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setFormData({ ...formData, preferredPayment: method })}
                      className={`text-left text-xs p-3 rounded-xl border transition-all flex items-center justify-between ${
                        formData.preferredPayment === method
                          ? 'bg-[#075B3D] text-[#FFF9ED] border-[#075B3D] font-semibold shadow-xs'
                          : 'bg-[#FFF9ED]/50 text-[#202522] border-[#092C24]/15 hover:bg-[#FFF9ED] font-medium'
                      }`}
                    >
                      <span>{method}</span>
                      {formData.preferredPayment === method && (
                        <Check className="w-3.5 h-3.5 text-[#FFD700] shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 8: Launch interest */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-[#092C24]">
                  <span className="text-[#8A6414] font-bold mr-1.5">8.</span>
                  Would you be interested in using FarmLink when it launches?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    'Definitely yes — ready to test immediately',
                    'Very likely — need a quick demo',
                    'Maybe — depending on the fees',
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setFormData({ ...formData, launchInterest: opt })}
                      className={`text-xs p-3 rounded-xl border font-semibold text-center transition-all ${
                        formData.launchInterest === opt
                          ? 'bg-golden-radiance text-[#092C24] border-[#D4AF37] shadow-xs'
                          : 'bg-[#FFF9ED]/50 text-[#202522] border-[#092C24]/15 hover:bg-[#FFF9ED]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 9: Must-have feature */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#092C24]">
                  <span className="text-[#8A6414] font-bold mr-1.5">9.</span>
                  What feature would make you use FarmLink immediately?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guaranteed off-takers, shared refrigerated trucks, instant payout on arrival"
                  value={formData.mustHaveFeature}
                  onChange={(e) => setFormData({ ...formData, mustHaveFeature: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] bg-[#FFF9ED]/40 focus:bg-white"
                />
              </div>

              {/* Question 10: Contact details */}
              <div className="space-y-4 pt-4 border-t border-[#092C24]/10">
                <label className="block text-sm font-semibold text-[#092C24]">
                  <span className="text-[#8A6414] font-bold mr-1.5">10.</span>
                  Your Name, WhatsApp number, and Email <span className="text-rose-600">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] bg-[#FFF9ED]/40 focus:bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp Number *"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] bg-[#FFF9ED]/40 focus:bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address (Optional)"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] bg-[#FFF9ED]/40 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 space-y-2.5">
                <button
                  type="submit"
                  className="w-full py-4 text-base font-semibold text-[#092C24] bg-golden-radiance hover:brightness-105 active:brightness-95 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Response</span>
                </button>
                <p className="text-[11px] text-center text-[#202522]/70 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#075B3D] shrink-0" />
                  <span>
                    Survey responses are saved for product planning and sent to our team via WhatsApp (+234 812 790 4630).
                  </span>
                </p>
              </div>
            </form>
          ) : (
            /* Survey Confirmation Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#075B3D]/10 text-[#075B3D] border border-[#D4AF37]/40 flex items-center justify-center mx-auto">
                <ClipboardCheck className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-[#092C24] tracking-tight">
                  Thank You for Helping Build FarmLink
                </h3>
                <p className="text-sm text-[#202522]/80 max-w-lg mx-auto">
                  Your response has been recorded and prepared for our team. We appreciate your insights
                  from <strong>{formData.cityOrState}</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                <a
                  href={`https://wa.me/2348127904630?text=${encodeURIComponent(constructSurveyWhatsAppMessage(formData))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#075B3D] hover:bg-[#092C24] text-[#FFF9ED] font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#D4AF37]/30"
                >
                  <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Send Response via WhatsApp</span>
                </a>

                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-5 py-3 bg-[#FFF9ED] hover:bg-[#092C24]/5 text-[#092C24] border border-[#092C24]/20 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-[#075B3D]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-[#075B3D] hover:text-[#092C24] underline font-medium"
                >
                  Edit or submit another survey
                </button>
              </div>
            </div>
          )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
