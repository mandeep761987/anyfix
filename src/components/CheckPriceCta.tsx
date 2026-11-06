import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CheckPriceCtaProps {
  onCheckPrice?: () => void;
}

export const CheckPriceCta: React.FC<CheckPriceCtaProps> = ({ onCheckPrice }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onCheckPrice) {
      onCheckPrice();
    } else {
      window.location.href = '/book-repair';
    }
  };

  return (
    <section
      id="check-repair-price-section"
      className="w-full bg-transparent py-10 md:py-14 lg:py-16 border-t border-slate-200/60 flex flex-col items-center justify-center text-center select-none relative"
    >
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel relative rounded-3xl p-8 sm:p-12 flex flex-col items-center shadow-[0_12px_40px_rgba(15,23,42,0.05)] border border-white/90 bg-white/70 backdrop-blur-xl overflow-hidden">
          {/* Subtle Ambient Radial Light Behind Heading */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"
          />

          {/* Royal Blue Accent Line Above Heading */}
          <div
            aria-hidden="true"
            className="w-12 h-1 bg-[#1D4ED8] rounded-full mx-auto mb-3.5 sm:mb-4 shadow-[0_0_12px_rgba(29,78,216,0.5)]"
          />

          {/* Heading with Inter ExtraBold, Black (#111827), and Royal Blue highlight (#1D4ED8) */}
          <h2
            id="check-price-cta-heading"
            className="text-[24px] sm:text-[28px] lg:text-[32px] font-extrabold tracking-tight text-[#111827] mb-5 sm:mb-6 leading-tight max-w-xl relative z-10"
          >
            Know Your <span className="text-[#1D4ED8]">Repair Cost</span> Before You Book
          </h2>

          {/* Primary CTA Button: Full rounded pill, Royal Blue Glass Sheen */}
          <a
            id="btn-check-repair-price"
            href="/book-repair"
            onClick={handleClick}
            className="glass-btn-primary group w-full max-w-[320px] sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-9 h-[50px] sm:h-[52px] rounded-full text-sm sm:text-base font-bold text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2 relative z-10"
          >
            <span>Check Repair Price</span>
            <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  );
};
