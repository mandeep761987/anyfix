import React from 'react';
import { motion } from 'motion/react';
import heroImage from '../assets/images/regenerated_image_1787543156509.png';
import heroTrustTransparentImg from '../assets/images/regenerated_image_1788091287431.png';
import heroTrustDoorstepImg from '../assets/images/regenerated_image_1788091481739.png';
import heroTrustWarrantyImg from '../assets/images/regenerated_image_1788091485272.png';
import { Card } from "@/components/ui/card";
import {
  Smartphone,
  MapPin,
  ArrowRight,
} from 'lucide-react';

interface HeroProps {
  onNavigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section
      id="anyfix-hero-section"
      className="relative w-full flex items-center justify-center overflow-hidden bg-transparent pt-[80px] sm:pt-[92px] lg:pt-[100px] pb-8 sm:pb-12 lg:pb-14 px-4 sm:px-6 lg:px-8 [isolation:isolate]"
    >
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
          
          {/* DESKTOP 6/6 (col-span-6) / MOBILE TEXT (Order 1 on Mobile, Order 1 on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-1 lg:col-span-6 flex flex-col justify-center text-center lg:text-left items-center lg:items-start"
          >
            {/* Top Regional Badge with Glass Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 self-center lg:self-start px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_2px_12px_rgba(15,23,42,0.06)] hover:bg-white/95 hover:scale-[1.02] transition-all mb-3.5 cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <MapPin className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
              <span className="text-xs font-semibold text-slate-700 tracking-tight">
                Delhi NCR • Noida • Ghaziabad
              </span>
            </motion.div>

            {/* Headline Area with Dedicated Blue Light Sweep */}
            <div className="relative w-full overflow-visible">
              {/* Blue Light Sweep Layer behind Headline */}
              <div
                aria-hidden="true"
                className="absolute -top-[20%] -left-[10%] w-[120%] h-[140%] overflow-hidden pointer-events-none -z-10"
              >
                <div
                  className="absolute top-[-20%] left-0 w-[180px] h-[140%] blur-[24px] pointer-events-none animate-blue-sweep"
                  style={{
                    background:
                      'linear-gradient(110deg, transparent 0%, rgba(59,130,246,0.18) 35%, rgba(29,78,216,0.35) 50%, rgba(59,130,246,0.18) 65%, transparent 100%)',
                  }}
                />
              </div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-[30px] sm:text-[38px] lg:text-[44px] xl:text-[48px] font-bold text-[#0F172A] tracking-tight leading-[1.16] mb-4 sm:mb-5 relative z-10"
              >
                Professional Phone Repair{' '}
                <span className="text-[#1D4ED8] inline">
                  at Your Doorstep.
                </span>
              </motion.h1>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="w-full sm:w-auto mb-5 sm:mb-6"
            >
              {/* Primary Blue Book Repair CTA */}
              <a
                id="hero-btn-book-repair"
                href="/book-repair"
                onClick={(e) => handleLinkClick(e, '/book-repair')}
                className="glass-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-[48px] rounded-xl text-sm sm:text-base font-bold text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
              >
                <Smartphone className="w-4 h-4 text-white" />
                <span>Book Repair</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
              </a>
            </motion.div>

            {/* 3 EQUAL-WIDTH COMPACT TRUST CARDS IN HERO SECTION */}
            <motion.div
              id="hero-trust-cards-row"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="w-full grid grid-cols-3 gap-2 sm:gap-2.5 pt-4 border-t border-slate-200/80 text-left mt-4 sm:mt-5"
            >
              {/* Card 1: 100% Transparent */}
              <Card
                id="trust-card-transparent"
                className="glass-card group rounded-xl p-0 overflow-hidden flex flex-col justify-between cursor-pointer border border-white/80 bg-white/70 backdrop-blur-md shadow-[0_6px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_rgba(29,78,216,0.12)] hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/90 transition-all duration-300"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={heroTrustTransparentImg}
                    alt="100% Transparent"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/[0.03] pointer-events-none" />
                </div>
                <div className="p-2 sm:p-2.5 text-center sm:text-left flex items-center justify-center sm:justify-start">
                  <h3 className="text-[11px] sm:text-xs md:text-[13px] font-bold text-[#0F172A] leading-tight tracking-tight">
                    100% Transparent
                  </h3>
                </div>
              </Card>

              {/* Card 2: Doorstep Service */}
              <Card
                id="trust-card-doorstep"
                className="glass-card group rounded-xl p-0 overflow-hidden flex flex-col justify-between cursor-pointer border border-white/80 bg-white/70 backdrop-blur-md shadow-[0_6px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_rgba(29,78,216,0.12)] hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/90 transition-all duration-300"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={heroTrustDoorstepImg}
                    alt="Doorstep Service"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/[0.03] pointer-events-none" />
                </div>
                <div className="p-2 sm:p-2.5 text-center sm:text-left flex items-center justify-center sm:justify-start">
                  <h3 className="text-[11px] sm:text-xs md:text-[13px] font-bold text-[#0F172A] leading-tight tracking-tight">
                    Doorstep Service
                  </h3>
                </div>
              </Card>

              {/* Card 3: Warranty Included */}
              <Card
                id="trust-card-warranty"
                className="glass-card group rounded-xl p-0 overflow-hidden flex flex-col justify-between cursor-pointer border border-white/80 bg-white/70 backdrop-blur-md shadow-[0_6px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_rgba(29,78,216,0.12)] hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/90 transition-all duration-300"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={heroTrustWarrantyImg}
                    alt="Warranty Included"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/[0.03] pointer-events-none" />
                </div>
                <div className="p-2 sm:p-2.5 text-center sm:text-left flex items-center justify-center sm:justify-start">
                  <h3 className="text-[11px] sm:text-xs md:text-[13px] font-bold text-[#0F172A] leading-tight tracking-tight">
                    Warranty Included
                  </h3>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* DESKTOP 6/6 (col-span-6) / MOBILE CINEMATIC HERO IMAGE (Order 2 on Mobile, Order 2 on Desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-2 lg:col-span-6 relative w-full z-10 flex justify-center"
          >
            {/* Soft Ambient Light Behind Image */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 bg-gradient-to-tr from-[#1D4ED8]/15 via-[#3B82F6]/10 to-indigo-500/15 rounded-3xl blur-2xl -z-10 pointer-events-none"
            />

            {/* Clean Hero Image Container with Glass Frame */}
            <div className="glass-card relative z-10 w-full max-w-full lg:max-w-[480px] xl:max-w-[500px] rounded-2xl overflow-hidden p-1.5 shadow-[0_12px_36px_rgba(15,23,42,0.08)] group">
              {/* Aspect Ratio Controlled Image Wrapper (max rendered height 400-420px on desktop) */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11] lg:max-h-[410px] w-full overflow-hidden rounded-[14px]">
                <img
                  src={heroImage}
                  alt="Certified ANYFIX technician carefully repairing smartphone with precision tools in customer living room"
                  className="w-full h-full object-cover object-center contrast-[1.05] saturate-[1.03] transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* Ultra-Subtle Clean Overlay (4% opacity max) */}
                <div className="absolute inset-0 bg-slate-900/[0.04] pointer-events-none" />

                {/* Technician & Verification Badge Overlay on Image with Glass Effect */}
                <div className="glass-dark absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 text-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-[11px] font-black font-mono tracking-tight flex items-center">
                    ANY<span className="text-[#60A5FA]">FIX</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FDB515] ml-0.5" />
                  </span>
                  <span className="text-slate-400 text-xs">|</span>
                  <span className="text-[11px] font-semibold tracking-wide">
                    Certified Expert
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
