import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  Shield,
  Truck,
} from 'lucide-react';
import warrantyFeatureImg from '../../assets/images/regenerated_image_1793118343632.jpg';

interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'doorstep' | 'time' | 'safe' | 'warranty';
}

const FEATURES: FeatureItem[] = [
  {
    id: 'doorstep',
    title: 'Doorstep Repair',
    subtitle: 'At Your Location',
    iconType: 'doorstep',
  },
  {
    id: 'speed',
    title: '30 Minute Service',
    subtitle: 'Fast & Hassle-Free',
    iconType: 'time',
  },
  {
    id: 'safe',
    title: '100% Safe',
    subtitle: 'Data & Device Safe',
    iconType: 'safe',
  },
  {
    id: 'warranty',
    title: 'Warranty',
    subtitle: 'On All Repairs',
    iconType: 'warranty',
  },
];

export const BookingFeatureCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % FEATURES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
  }, []);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  // Auto-slide every 4.5 seconds when not hovered/paused
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isPaused]);

  const renderIcon = (feature: FeatureItem) => {
    switch (feature.iconType) {
      case 'doorstep':
        if (!imgError['doorstep']) {
          return (
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              <img
                src="/hero-trust/doorstep.webp"
                alt="Doorstep Repair"
                className="w-full h-full object-contain pointer-events-none"
                onError={() => setImgError((prev) => ({ ...prev, doorstep: true }))}
              />
            </div>
          );
        }
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EFF6FF] border border-blue-100 flex items-center justify-center text-[#1D4ED8] shrink-0 shadow-2xs">
            <Truck className="w-5 h-5 stroke-[2]" />
          </div>
        );

      case 'time':
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EFF6FF] border border-blue-100 flex items-center justify-center text-[#1D4ED8] shrink-0 shadow-2xs">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
        );

      case 'safe':
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EFF6FF] border border-blue-100 flex items-center justify-center text-[#1D4ED8] shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
        );

      case 'warranty':
        if (!imgError['warranty']) {
          return (
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              <img
                src={warrantyFeatureImg}
                alt="Warranty"
                className="w-full h-full object-contain rounded-lg pointer-events-none"
                onError={() => setImgError((prev) => ({ ...prev, warranty: true }))}
              />
            </div>
          );
        }
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EFF6FF] border border-blue-100 flex items-center justify-center text-[#1D4ED8] shrink-0 shadow-2xs">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="w-full mb-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="ANYFIX features carousel"
    >
      <div className="glass-panel relative overflow-hidden rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 shadow-[0_4px_20px_rgba(29,78,216,0.04)] px-3 sm:px-5 py-3 sm:py-3.5 h-[84px] sm:h-[90px] flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous feature"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/90 hover:border-[#1D4ED8] hover:bg-white text-[#1D4ED8] flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 z-10"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </button>

        {/* Desktop View: All 4 features in a clean horizontal strip with subtle dividers */}
        <div className="hidden md:flex items-center justify-between flex-1 px-2 gap-3 lg:gap-4">
          {FEATURES.map((feature, idx) => {
            const isHighlighted = activeIndex === idx;
            return (
              <React.Fragment key={feature.id}>
                {idx > 0 && (
                  <div className="w-[1px] h-8 bg-slate-200/60 shrink-0" />
                )}
                <div
                  onClick={() => goToSlide(idx)}
                  className={`flex-1 flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-300 cursor-pointer ${
                    isHighlighted
                      ? 'bg-white/90 backdrop-blur-md shadow-xs ring-1 ring-[#1D4ED8]/25'
                      : 'hover:bg-white/60'
                  }`}
                >
                  {renderIcon(feature)}
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs lg:text-[13px] font-bold text-[#111827] leading-tight truncate">
                      {feature.title}
                    </p>
                    <p className="text-[11px] lg:text-xs text-[#64748B] font-medium leading-tight mt-0.5 truncate">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile / Tablet View: 1 feature visible at a time with smooth sliding animation */}
        <div className="md:hidden flex-1 overflow-hidden relative">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="w-full flex-shrink-0 flex items-center justify-center gap-3 px-2"
              >
                {renderIcon(feature)}
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-[#111827] leading-tight">
                    {feature.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#64748B] font-medium leading-tight mt-0.5">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next feature"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/90 hover:border-[#1D4ED8] hover:bg-white text-[#1D4ED8] flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 z-10"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </button>

        {/* Pagination Dots at Bottom Center */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {FEATURES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === idx
                  ? 'w-4 h-1.5 bg-[#1D4ED8]'
                  : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
