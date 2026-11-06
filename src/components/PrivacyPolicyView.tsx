import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Calendar, ShieldCheck, Lock, Eye, RefreshCw, FileCheck } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onNavigate?: (path: string) => void;
}

interface SectionItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onNavigate }) => {
  // Track open accordion sections (default open first section)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'section-1': true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (onNavigate) {
      onNavigate('/');
    }
  };

  const sections: SectionItem[] = [
    {
      id: 'section-1',
      title: '1. Information We Collect',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            When you schedule an on-demand doorstep repair with ANYFIX, we collect essential details to facilitate transparent and timely technician dispatch to your residence or workplace:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Personal Contact Data:</strong> Full name, verified mobile phone number, and email address for order notifications and booking receipts.</li>
            <li><strong>Doorstep Location Details:</strong> Residential/office address, flat or floor number, landmark, and postal code within our Delhi NCR service zone.</li>
            <li><strong>Smartphone Specifications:</strong> Device brand, exact model name, color variant, and reported hardware faults (such as cracked screen, battery degradation, camera fault).</li>
            <li><strong>Service Appointment Preferences:</strong> Scheduled repair date, preferred two-hour arrival slot, and chosen mode of payment (UPI, Cash, or Card).</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'section-2',
      title: '2. How We Use Your Information',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            We process your personal information strictly to fulfill your requested mobile repair appointments and ensure outstanding doorstep customer experience:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Dispatching certified technicians to your doorstep at your selected time.</li>
            <li>Sending real-time order confirmations, technician arrival ETAs, and digital service invoices via SMS or WhatsApp.</li>
            <li>Activating and validating your 6-month ANYFIX warranty coverage for replaced smartphone components.</li>
            <li>Providing proactive customer support and handling warranty service requests promptly.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'section-3',
      title: '3. Sharing of Information',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            ANYFIX maintains a strict zero-compromise privacy commitment. <strong>We do not sell, rent, or lease your personal data to third-party advertisers or telemarketers.</strong>
          </p>
          <p>
            Your information is only shared with:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Assigned ANYFIX Technicians:</strong> Contact number and service location strictly for the duration of the scheduled service visit.</li>
            <li><strong>Secure Infrastructure Partners:</strong> Cloud hosting, transactional SMS gateways, and secure digital invoicing platforms operating under strict data protection terms.</li>
            <li><strong>Legal &amp; Regulatory Authorities:</strong> Only when strictly required by applicable Indian law or law enforcement directives.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'section-4',
      title: '4. Data Security & Device Privacy',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            We recognize that your smartphone contains your most private personal and financial life:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>100% On-Site Visibility:</strong> All hardware repairs are carried out right before your eyes at your doorstep. You never have to hand over your phone to be taken away.</li>
            <li><strong>No Passcode Requirement:</strong> Technicians will never request your screen lock passcode, PIN, or biometric credentials. You unlock the device yourself during pre-repair and post-repair checkups.</li>
            <li><strong>Zero Data Access:</strong> Our certified technicians strictly handle hardware modules (display assemblies, batteries, charging ports) and never browse internal storage, galleries, or applications.</li>
            <li><strong>Encrypted Digital Storage:</strong> All customer order records and warranty certificates are stored on encrypted servers with role-based access safeguards.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'section-5',
      title: '5. Cookies & Tracking Technologies',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Our website uses standard essential cookies and local session caching solely to enhance your browsing experience, remember selected device brands or models in the price estimator, and optimize site loading speed.
          </p>
          <p>
            We do not deploy intrusive cross-site tracking cookies. You may disable cookies through your browser settings at any time without impacting basic website viewing.
          </p>
        </div>
      ),
    },
    {
      id: 'section-6',
      title: '6. Your Rights',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            As an ANYFIX customer, you retain complete authority over your personal information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Right to Access &amp; Verify:</strong> You may request a summary of the personal information and past repair service orders associated with your contact details.</li>
            <li><strong>Right to Rectification:</strong> You can update or correct phone numbers, delivery addresses, or contact names by messaging our support desk.</li>
            <li><strong>Right to Erasure:</strong> You can request deletion of non-essential profile data, subject to retaining statutory tax records and active warranty claims.</li>
            <li><strong>Opt-Out of Promotional Alerts:</strong> You can unsubscribe from promotional messages at any time while continuing to receive transactional repair alerts.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'section-7',
      title: '7. Contact Us',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            If you have any questions, clarifications, or privacy grievances regarding this policy or our data practices, please get in touch with our data protection desk:
          </p>
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-slate-700 space-y-1">
            <p><strong>ANYFIX Customer Care &amp; Privacy Desk</strong></p>
            <p>Email: <a href="mailto:support@anyfix.in" className="text-[#1D4ED8] font-bold hover:underline">support@anyfix.in</a></p>
            <p>Helpline: <a href="tel:+919999999999" className="text-[#1D4ED8] font-bold hover:underline">+91 99999 99999</a></p>
            <p className="text-xs text-slate-500 pt-1">Operational Hours: Monday – Sunday, 9:00 AM – 8:00 PM IST</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-transparent text-[#111827] font-sans pt-[88px] sm:pt-[104px] pb-20 relative">
      {/* Sticky Back button at top on mobile / tablet */}
      <div className="sticky top-[72px] sm:top-[80px] z-20 w-full glass-nav border-b border-white/60 py-3 px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            id="btn-back-privacy"
            onClick={handleBack}
            className="glass-btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-full text-[#111827] text-sm font-semibold transition-all duration-250 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[#1D4ED8]" />
            <span>Back</span>
          </button>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Legal Documentation
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="glass-pill-blue inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>User Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Your privacy matters. Here&apos;s how ANYFIX collects, uses and protects your information.
          </p>
        </div>

        {/* Last Updated Card — Royal Blue Accent Glass Card */}
        <div
          id="privacy-last-updated-card"
          className="w-full bg-gradient-to-r from-[#1D4ED8] to-[#1E40AF] text-white rounded-[28px] p-6 sm:p-8 shadow-[0_12px_36px_rgba(29,78,216,0.25)] border border-white/20 mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200 block">
                Policy Revision Date
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                September 2026
              </h3>
            </div>
          </div>
          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide text-white">
              Official ANYFIX Standard
            </span>
            <p className="text-xs text-blue-100 mt-1">
              Applicable across all Delhi NCR operations
            </p>
          </div>
        </div>

        {/* Content Sections — Collapsible Premium Accordion Cards */}
        <div className="space-y-4 sm:space-y-5">
          {sections.map((section) => {
            const isOpen = !!openSections[section.id];
            return (
              <div
                key={section.id}
                id={section.id}
                className="glass-card rounded-[24px] border border-white/80 bg-white/75 backdrop-blur-md shadow-[0_6px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_14px_32px_rgba(29,78,216,0.08)] hover:border-blue-300/60 transition-all duration-250 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-left cursor-pointer transition-colors duration-250 focus:outline-none"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-[#1D4ED8] tracking-tight pr-4 leading-snug">
                    {section.title}
                  </h2>
                  <div
                    className={`w-9 h-9 rounded-full bg-blue-50/90 text-[#1D4ED8] border border-blue-200/50 flex items-center justify-center shrink-0 transition-transform duration-250 ${
                      isOpen ? 'rotate-180 bg-[#1D4ED8] text-white border-transparent' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 border-t border-slate-100/80 transition-all duration-250">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Helper CTA */}
        <div className="mt-12 sm:mt-16 text-center bg-slate-50 rounded-[28px] border border-slate-200/80 p-8 sm:p-10">
          <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-2">
            Have further questions regarding your data security?
          </h3>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mb-6">
            Speak directly with our privacy team or explore our service terms and guarantees.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:support@anyfix.in"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-[#111827] font-bold text-sm rounded-full border border-slate-200 shadow-xs transition-all duration-250"
            >
              Email Privacy Team
            </a>
            <button
              type="button"
              onClick={() => onNavigate?.('/terms-and-conditions')}
              className="px-6 py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-full shadow-md shadow-[#1D4ED8]/20 transition-all duration-250 cursor-pointer"
            >
              View Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
