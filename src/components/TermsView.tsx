import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Calendar, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface TermsViewProps {
  onNavigate?: (path: string) => void;
}

interface TermSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export const TermsView: React.FC<TermsViewProps> = ({ onNavigate }) => {
  // Track open accordion sections (default open first section)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'term-1': true,
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

  const sections: TermSection[] = [
    {
      id: 'term-1',
      title: '1. Service Eligibility',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            ANYFIX doorstep mobile repair services are available to individual consumers and businesses located within our actively serviced zones across <strong>Delhi, Noida, and Ghaziabad</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Users must be at least 18 years of age or possess legal parental/guardian consent to schedule an appointment.</li>
            <li>The device submitted for doorstep inspection and repair must be lawful personal or authorized corporate property.</li>
            <li>ANYFIX reserves the right to decline service for devices showing evidence of illegality, lost/stolen reports, or severe structural compromise posing safety risks.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'term-2',
      title: '2. Booking Terms & Appointment Scheduling',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            When submitting a doorstep service booking via our website:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Slot Confirmation:</strong> Your chosen repair date and 2-hour arrival window are confirmed upon SMS/WhatsApp notification by the ANYFIX dispatch system.</li>
            <li><strong>On-Site Access:</strong> You agree to provide our certified technician safe and suitable indoor or covered access (residential flat, office desk, lobby) with adequate lighting and a flat work surface.</li>
            <li><strong>Rescheduling:</strong> You may reschedule your booking without penalty up to 2 hours prior to the scheduled technician arrival time.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'term-3',
      title: '3. Pricing & Transparent Billing',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            We operate on a strict <strong>100% Transparent Pricing</strong> principle:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>All quotes generated in our online price estimator include the genuine replacement part, professional technician labor, doorstep travel, and warranty registration.</li>
            <li><strong>No Hidden Surcharges:</strong> If additional faults (such as battery swelling or internal chassis bends) are discovered during initial diagnosis, no work begins without your prior consent to an updated quote.</li>
            <li><strong>Payment on Satisfaction:</strong> Full payment is due only after the repair is completed and you have tested and verified device functionality. We accept UPI, Cards, and Cash.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'term-4',
      title: '4. Warranty Coverage & Claim Process',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            ANYFIX provides up to <strong>6 Months Comprehensive Warranty</strong> on replacement screens and spare parts:
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
            <p className="font-bold text-[#1D4ED8]">What is Covered:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Touchscreen ghost touches, dead zones, or unresponsive areas.</li>
              <li>Display discoloration or lines not caused by physical impact.</li>
              <li>Component manufacturing defects in replacement batteries or charging assemblies.</li>
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs sm:text-sm space-y-2 text-amber-900">
            <p className="font-bold text-amber-800">What Voids Warranty Coverage:</p>
            <ul className="list-disc pl-4 space-y-1 text-amber-700">
              <li>Subsequent physical drops, cracks, chips, or glass shattering.</li>
              <li>Liquid or moisture ingress occurring after the repair.</li>
              <li>Unauthorized opening or tampering by third-party repair shops.</li>
            </ul>
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Warranty claims are resolved via free doorstep technician re-visit within 24 to 48 hours.
          </p>
        </div>
      ),
    },
    {
      id: 'term-5',
      title: '5. Customer Responsibilities & Data Backup',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            To ensure a seamless and safe repair experience, customers are advised to observe the following responsibilities:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Data Backup:</strong> While doorstep hardware repairs (screen, battery) do not wipe internal storage, customers are strongly recommended to back up critical data (photos, contacts, chats) to cloud or local storage prior to service.</li>
            <li><strong>Device Presence:</strong> The owner or authorized adult representative must be physically present during the 30-minute repair procedure and post-repair check.</li>
            <li><strong>Pre-Service Inspection:</strong> You must participate in the 2-minute diagnostic pre-check with our technician to record existing cosmetic or secondary defects.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'term-6',
      title: '6. Cancellations & Missed Appointments',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            We strive to be flexible and fair with booking alterations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Cancellations made prior to technician departure carry <strong>zero cancellation fee</strong>.</li>
            <li>If a technician arrives at the scheduled location and the customer is unreachable or unavailable after 15 minutes, the appointment will be marked as missed and may require re-booking.</li>
            <li>In the rare event that ANYFIX must reschedule due to unforeseen weather or transit constraints, you will be notified immediately and offered priority next-slot dispatch.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'term-7',
      title: '7. Limitation of Liability',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            To the maximum extent permitted by applicable law:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>ANYFIX is not liable for indirect, incidental, or consequential damages resulting from pre-existing motherboard degradation, software anomalies, or failure of non-serviced legacy components.</li>
            <li>Our total cumulative liability for any verified claim arising out of a service visit is strictly capped at the total fee paid by the customer for that specific repair order.</li>
            <li>Opening water-resistant devices may compromise manufacturer ingress IP-ratings; while our technicians apply fresh adhesive seals, factory-grade water immersion protection cannot be guaranteed post-service.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'term-8',
      title: '8. Contact Information & Dispute Resolution',
      content: (
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            For inquiries, service escalations, or legal communications regarding these Terms &amp; Conditions:
          </p>
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-slate-700 space-y-1">
            <p><strong>ANYFIX Legal &amp; Customer Support Cell</strong></p>
            <p>Email: <a href="mailto:support@anyfix.in" className="text-[#1D4ED8] font-bold hover:underline">support@anyfix.in</a></p>
            <p>Customer Support Helpline: <a href="tel:+919999999999" className="text-[#1D4ED8] font-bold hover:underline">+91 99999 99999</a></p>
            <p>Service Headquarters: Delhi NCR, India</p>
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
            id="btn-back-terms"
            onClick={handleBack}
            className="glass-btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-full text-[#111827] text-sm font-semibold transition-all duration-250 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[#1D4ED8]" />
            <span>Back</span>
          </button>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Terms of Service
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="glass-pill-blue inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-4">
            <FileText className="w-4 h-4" />
            <span>Customer Service Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Please read these terms before using ANYFIX services.
          </p>
        </div>

        {/* Last Updated Card — Royal Blue Accent Glass Card */}
        <div
          id="terms-last-updated-card"
          className="w-full bg-gradient-to-r from-[#1D4ED8] to-[#1E40AF] text-white rounded-[28px] p-6 sm:p-8 shadow-[0_12px_36px_rgba(29,78,216,0.25)] border border-white/20 mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200 block">
                Last Updated
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                September 2026
              </h3>
            </div>
          </div>
          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide text-white">
              Binding Service Agreement
            </span>
            <p className="text-xs text-blue-100 mt-1">
              Governs doorstep repair bookings &amp; warranties
            </p>
          </div>
        </div>

        {/* Content Sections — Premium Accordion Cards */}
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
        <div className="mt-12 sm:mt-16 text-center glass-panel rounded-[28px] p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-2">
            Ready to book your doorstep repair?
          </h3>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mb-6">
            Get instant guaranteed pricing and schedule a technician at your doorstep in under 60 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate?.('/book-repair')}
              className="glass-btn-primary px-6 py-3 font-bold text-sm rounded-full transition-all duration-250 cursor-pointer"
            >
              Book Doorstep Repair
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('/privacy-policy')}
              className="glass-btn-secondary px-6 py-3 font-bold text-sm rounded-full transition-all duration-250 cursor-pointer"
            >
              View Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
