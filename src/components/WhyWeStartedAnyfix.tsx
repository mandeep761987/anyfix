import React from 'react';
import { ArrowRight } from 'lucide-react';

import whyAnyfix1Img from '../assets/images/regenerated_image_1788383004515.png';
import whyAnyfix2Img from '../assets/images/regenerated_image_1788383007745.png';
import whyAnyfix3Img from '../assets/images/regenerated_image_1788383021009.png';
import whyAnyfix4Img from '../assets/images/regenerated_image_1788383016698.png';

interface WhyWeStartedAnyfixProps {
  onNavigate?: (path: string) => void;
}

interface StoryItem {
  number: string;
  label?: string;
  imageId: 'whyAnyfix1' | 'whyAnyfix2' | 'whyAnyfix3' | 'whyAnyfix4';
  imageSrc: string;
  imageAlt: string;
  heading: string;
  description: string;
  imageOnLeft: boolean; // true for Row 1 & 3, false for Row 2 & 4
}

const STORIES: StoryItem[] = [
  {
    number: '01',
    imageId: 'whyAnyfix1',
    imageSrc: whyAnyfix1Img,
    imageAlt: 'Customer waiting at traditional repair shop',
    heading: "Repair Shouldn't Mean Losing Your Whole Day.",
    description:
      'Standing in crowded queues, leaving your personal phone for days, and losing productive hours is frustrating. We created ANYFIX to give you your precious time back.',
    imageOnLeft: true,
  },
  {
    number: '02',
    imageId: 'whyAnyfix2',
    imageSrc: whyAnyfix2Img,
    imageAlt: 'Technician clearly explaining parts and diagnostics to customer',
    heading: 'You Deserve to Know What Is Being Repaired.',
    description:
      'No shadowy backrooms and zero guesswork. Our certified technician diagnoses your device directly in front of your eyes and explains every component before work begins.',
    imageOnLeft: false,
  },
  {
    number: '03',
    label: 'WE ARE PROFESSIONALS',
    imageId: 'whyAnyfix3',
    imageSrc: whyAnyfix3Img,
    imageAlt: 'Certified ANYFIX technician performing precision smartphone repair with professional tools',
    heading: 'Expert & Trained Technicians',
    description:
      'At ANYFIX, your phone is handled by trained and skilled technicians who understand the job. From diagnosis to repair, we focus on professional service, careful handling, genuine-quality parts, and transparent communication.',
    imageOnLeft: true,
  },
  {
    number: '04',
    imageId: 'whyAnyfix4',
    imageSrc: whyAnyfix4Img,
    imageAlt: 'Customer receiving comprehensive warranty support from ANYFIX',
    heading: 'Reliable Support Should Continue After the Repair.',
    description:
      'Our commitment doesn’t end when the technician leaves. Every fix is backed by up to 6 months warranty with no-hassle doorstep resolution if any issue persists.',
    imageOnLeft: false,
  },
];

export const WhyWeStartedAnyfix: React.FC<WhyWeStartedAnyfixProps> = ({
  onNavigate,
}) => {
  const handleTalkToExpert = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/contact');
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/contact');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section
      id="why-we-started-anyfix-section"
      className="w-full bg-transparent py-14 sm:py-20 lg:py-24 border-t border-slate-200/60 relative"
    >
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 lg:mb-20">
          <span className="glass-pill-blue inline-block text-xs sm:text-[13px] font-bold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full">
            OUR STORY
          </span>
          <h2
            id="why-anyfix-heading"
            className="text-[26px] sm:text-[30px] lg:text-[34px] font-extrabold text-[#111827] tracking-tight leading-tight mb-2.5"
          >
            Why We Started ANYFIX
          </h2>
          <p className="text-sm sm:text-base text-[#5B667A] leading-relaxed max-w-lg mx-auto">
            Because phone repair should feel simple, transparent, and trustworthy.
          </p>
        </div>

        {/* 4 Alternating Story Rows */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-24">
          {STORIES.map((story) => (
            <article
              key={story.number}
              className={`flex flex-col items-center gap-6 sm:gap-8 lg:gap-14 w-full ${
                story.imageOnLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Image Column with Glass Frame */}
              <div className="w-full md:w-[50%] lg:w-[52%] max-w-[540px] shrink-0">
                <div className="glass-card rounded-[18px] p-2 border border-white/80 bg-white/75 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_40px_rgba(29,78,216,0.12)] hover:-translate-y-1.5 transition-all duration-300 group">
                  <div className="w-full aspect-[16/9] rounded-[12px] sm:rounded-[14px] overflow-hidden bg-slate-100">
                    <img
                      id={story.imageId}
                      src={story.imageSrc}
                      alt={story.imageAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center block transform transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Text Column (Vertically centered, max 480px) */}
              <div className="w-full md:w-[50%] lg:w-[48%] flex-1 flex flex-col justify-center text-left max-w-[480px]">
                {/* Story Number & Optional Label */}
                <div className="flex items-center gap-2 mb-2 sm:mb-2.5 flex-wrap">
                  <span className="text-[14px] font-bold text-[#1D4ED8] tracking-wide">
                    {story.number}
                  </span>
                  {story.label && (
                    <>
                      <span className="text-[#94A3B8] text-xs font-semibold">•</span>
                      <span
                        className="tracking-wider uppercase"
                        style={{
                          fontFamily: 'system-ui',
                          color: '#000101',
                          fontWeight: 'bold',
                          fontSize: '25px',
                        }}
                      >
                        {story.label}
                      </span>
                    </>
                  )}
                </div>

                {/* Story Heading */}
                <h3
                  className={`font-bold text-[#111827] leading-snug tracking-tight mb-2.5 sm:mb-3 ${
                    story.number === '03'
                      ? ''
                      : 'text-[21px] sm:text-[23px] lg:text-[28px]'
                  }`}
                  style={
                    story.number === '03'
                      ? {
                          fontSize: '25px',
                          fontFamily: 'system-ui',
                        }
                      : undefined
                  }
                >
                  {story.heading}
                </h3>

                {/* Supporting Paragraph */}
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#5B667A] leading-[1.6]">
                  {story.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA: Talk to an Expert with Frosted Glass Callout Panel */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/90 bg-white/70 backdrop-blur-xl shadow-[0_12px_36px_rgba(29,78,216,0.06)] max-w-2xl mx-auto mt-16 sm:mt-20 text-center relative overflow-hidden">
          <span className="inline-block text-xs font-bold tracking-widest text-[#1D4ED8] uppercase mb-1.5">
            NEED HELP?
          </span>
          <h3 className="text-[22px] sm:text-[24px] lg:text-[26px] font-bold text-[#111827] tracking-tight mb-2">
            Talk to an Expert
          </h3>
          <p className="text-[14px] sm:text-[15px] text-[#5B667A] max-w-md mx-auto mb-6 leading-relaxed">
            Have a question about your phone repair? Our team is here to help.
          </p>
          <div>
            <a
              id="cta-talk-to-expert"
              href="/contact"
              onClick={handleTalkToExpert}
              className="glass-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[48px] px-7 rounded-xl text-white text-[15px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
            >
              <span>Talk to an Expert</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeStartedAnyfix;
