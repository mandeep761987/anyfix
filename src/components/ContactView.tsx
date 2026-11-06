import React from 'react';
import { Phone, MessageSquare, Mail, Clock, MapPin, ArrowRight } from 'lucide-react';

interface ContactViewProps {
  onNavigate?: (path: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = () => {
  return (
    <div className="w-full bg-transparent text-[#111827] font-sans pt-[90px] sm:pt-[100px] pb-12 sm:pb-16 min-h-[calc(100vh-72px)] flex flex-col justify-center relative">
      <div className="max-w-[960px] w-full mx-auto px-5 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <span className="glass-pill-blue inline-block text-xs font-bold tracking-widest uppercase mb-2 px-3.5 py-1 rounded-full">
            CONTACT ANYFIX
          </span>
          <h1 className="text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[#111827] tracking-tight leading-tight mb-2">
            We&apos;re Here to Help
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#5B667A] leading-relaxed">
            Have a question about your phone repair? Our team is ready to help.
          </p>
        </div>

        {/* 3 Compact Contact Cards (Horizontal 3-column on desktop) with Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-4 sm:mb-5">
          {/* 1. Call Us */}
          <a
            href="tel:+917985082547"
            id="contact-card-call"
            className="glass-card group rounded-[16px] border border-white/80 bg-white/75 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_36px_rgba(29,78,216,0.12)] hover:border-blue-400/50 hover:bg-white/95 hover:-translate-y-1.5 transition-all p-3.5 sm:p-4 flex items-center gap-3.5 h-[84px] sm:h-[96px] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50/90 text-[#1D4ED8] group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors flex items-center justify-center shrink-0 shadow-2xs">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[13px] sm:text-sm font-bold text-[#111827] mb-0.5">
                Call Us
              </h2>
              <span className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-bold text-[#1D4ED8] group-hover:text-[#1E40AF] transition-colors">
                <span>Call Now</span>
                <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </a>

          {/* 2. WhatsApp */}
          <a
            href="https://wa.me/917985082547"
            target="_blank"
            rel="noreferrer"
            id="contact-card-whatsapp"
            className="glass-card group rounded-[16px] border border-white/80 bg-white/75 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_36px_rgba(16,185,129,0.14)] hover:border-emerald-400/50 hover:bg-white/95 hover:-translate-y-1.5 transition-all p-3.5 sm:p-4 flex items-center gap-3.5 h-[84px] sm:h-[96px] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50/90 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0 shadow-2xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[13px] sm:text-sm font-bold text-[#111827] mb-0.5">
                WhatsApp
              </h2>
              <span className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                <span>Chat on WhatsApp</span>
                <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </a>

          {/* 3. Email Us */}
          <a
            href="mailto:support@withanyfix.com"
            id="contact-card-email"
            className="glass-card group rounded-[16px] border border-white/80 bg-white/75 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_36px_rgba(29,78,216,0.12)] hover:border-blue-400/50 hover:bg-white/95 hover:-translate-y-1.5 transition-all p-3.5 sm:p-4 flex items-center gap-3.5 h-[84px] sm:h-[96px] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50/90 text-[#1D4ED8] group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors flex items-center justify-center shrink-0 shadow-2xs">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <h2 className="text-[13px] sm:text-sm font-bold text-[#111827]">
                  Email Us
                </h2>
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-[#1D4ED8] transition-colors">
                  Send &rarr;
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-bold text-[#1D4ED8] font-mono truncate">
                support@withanyfix.com
              </p>
            </div>
          </a>
        </div>

        {/* Service Information: Service Areas & Working Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6 sm:mb-8">
          {/* Service Areas */}
          <div className="glass-panel rounded-[16px] border border-white/80 bg-white/70 backdrop-blur-md p-3.5 sm:p-4 flex items-center gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-white/90 border border-slate-200/60 flex items-center justify-center text-[#1D4ED8] shrink-0 shadow-2xs">
              <MapPin className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Service Areas
              </span>
              <div className="text-[13px] sm:text-sm font-bold text-[#111827] flex items-center gap-1.5 flex-wrap">
                <span>Delhi NCR</span>
                <span className="text-slate-300">•</span>
                <span>Noida</span>
                <span className="text-slate-300">•</span>
                <span>Ghaziabad</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="glass-panel rounded-[16px] border border-white/80 bg-white/70 backdrop-blur-md p-3.5 sm:p-4 flex items-center gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-white/90 border border-slate-200/60 flex items-center justify-center text-[#1D4ED8] shrink-0 shadow-2xs">
              <Clock className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Working Hours
              </span>
              <div className="text-[13px] sm:text-sm font-bold text-[#111827] flex items-center gap-1.5 flex-wrap">
                <span>9:00 AM – 8:00 PM</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">7 Days a Week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA: Talk to an Expert */}
        <div className="text-center">
          <a
            id="contact-btn-talk-expert"
            href="tel:+917985082547"
            className="glass-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-xl text-white text-[15px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
          >
            <span>Talk to an Expert</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
