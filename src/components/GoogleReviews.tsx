import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import review1Img from '../assets/images/regenerated_image_1788106058528.png';
import review2Img from '../assets/images/regenerated_image_1788107584949.png';
import review3Img from '../assets/images/regenerated_image_1788196667368.png';
import review4Img from '../assets/images/regenerated_image_1788196670153.png';
import review5Img from '../assets/images/regenerated_image_1788196674657.png';

interface GoogleReviewsProps {
  onNavigate?: (path: string) => void;
}

interface ReviewItem {
  id: number;
  img: string;
  alt: string;
}

const ORIGINAL_REVIEWS: ReviewItem[] = [
  { id: 1, img: review1Img, alt: 'Google Review 1' },
  { id: 2, img: review2Img, alt: 'Google Review 2' },
  { id: 3, img: review3Img, alt: 'Google Review 3' },
  { id: 4, img: review4Img, alt: 'Google Review 4' },
  { id: 5, img: review5Img, alt: 'Google Review 5' },
];

// Cloned list for seamless infinite loop (5 before + 5 original + 5 after = 15 cards)
const EXTENDED_REVIEWS = [
  ...ORIGINAL_REVIEWS,
  ...ORIGINAL_REVIEWS,
  ...ORIGINAL_REVIEWS,
];
const TOTAL_ORIGINAL = ORIGINAL_REVIEWS.length;
const START_INDEX = TOTAL_ORIGINAL; // Index 5 is first original review

export const GoogleReviews: React.FC<GoogleReviewsProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(START_INDEX);
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive mobile detector (1 card on mobile < 768px, 3 cards on desktop >= 768px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Re-enable smooth transition if it was momentarily disabled for instant clone snap
  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => {
        setWithTransition(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  // Navigate exactly one card forward
  const nextSlide = useCallback(() => {
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Navigate exactly one card backward
  const prevSlide = useCallback(() => {
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Direct indicator navigation
  const goToSlide = (index: number) => {
    setWithTransition(true);
    setCurrentIndex(START_INDEX + index);
  };

  // Instant clone boundary reset after 450ms slide transition
  const handleTransitionEnd = () => {
    if (currentIndex >= TOTAL_ORIGINAL * 2) {
      // Reached right clones (indices 10-14) -> seamlessly snap back to original (5-9)
      setWithTransition(false);
      setCurrentIndex((prev) => prev - TOTAL_ORIGINAL);
    } else if (currentIndex < TOTAL_ORIGINAL) {
      // Reached left clones (indices 0-4) -> seamlessly snap to original (5-9)
      setWithTransition(false);
      setCurrentIndex((prev) => prev + TOTAL_ORIGINAL);
    }
  };

  // Autoplay: 4 seconds interval, pauses on hover and during drag
  useEffect(() => {
    if (isPaused || isDragging) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, isDragging, nextSlide]);

  // Touch swipe handling (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      // 40px threshold for single-card swipe
      if (diff > 40) {
        nextSlide();
      } else if (diff < -40) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsDragging(false);
  };

  // Mouse drag support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    touchEndX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (isDragging) {
      handleTouchEnd();
    }
  };

  // Active indicator calculation (0 - 4)
  const activeIndicatorIndex =
    ((currentIndex % TOTAL_ORIGINAL) + TOTAL_ORIGINAL) % TOTAL_ORIGINAL;

  // Translation step: 100% on mobile (1 card), 33.333333% on desktop (1 card out of 3 visible)
  const stepPercent = isMobile ? 100 : 100 / 3;
  const translatePercent = currentIndex * stepPercent;

  return (
    <section
      id="google-reviews-section"
      className="w-full bg-transparent py-10 sm:py-14 lg:py-16 border-t border-slate-200/60 overflow-hidden select-none relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsDragging(false);
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          {/* Eyebrow */}
          <div className="glass-pill-blue inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-2.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>GOOGLE REVIEWS</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl sm:text-[28px] lg:text-[30px] font-bold text-[#0F172A] tracking-tight leading-tight mb-2.5">
            Trusted by Customers Across Delhi NCR
          </h2>

          {/* Google Stars & Rating Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-slate-700">
            <div className="flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 fill-[#FBBC04] text-[#FBBC04]"
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
              4.9 Google Rating
            </span>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Slider Viewport with Touch and Mouse Swipe */}
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div
              className="flex"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(-${translatePercent}%)`,
                transition: withTransition ? 'transform 450ms ease' : 'none',
                willChange: 'transform',
              }}
            >
              {EXTENDED_REVIEWS.map((review, idx) => {
                const uniqueCardId = `google-review-card-${review.id}`;
                return (
                  <div
                    key={`${review.id}-${idx}`}
                    className="w-full md:w-1/3 shrink-0 px-2 sm:px-2.5"
                  >
                    <div
                      id={uniqueCardId}
                      className="glass-card review-card rounded-2xl border border-white/80 bg-white/75 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_38px_rgba(29,78,216,0.12)] hover:border-blue-400/50 hover:bg-white/90 transition-all duration-300 p-2.5 max-w-[310px] md:max-w-[330px] w-full mx-auto flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={review.img}
                        alt={review.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-contain block rounded-xl"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Left / Right Navigation Buttons with Glass Effect */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Google Review"
            className="hidden md:flex absolute -left-4 lg:-left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-md items-center justify-center text-slate-700 hover:text-[#1D4ED8] hover:border-blue-400/50 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Google Review"
            className="hidden md:flex absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-md items-center justify-center text-slate-700 hover:text-[#1D4ED8] hover:border-blue-400/50 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Bottom Pagination Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-5 sm:mt-6">
          {ORIGINAL_REVIEWS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndicatorIndex === idx
                  ? 'w-6 bg-[#1D4ED8] shadow-[0_0_8px_rgba(29,78,216,0.5)]'
                  : 'w-1.5 bg-[#CBD5E1] hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

