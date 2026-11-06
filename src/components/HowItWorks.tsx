import React from 'react';
import { motion } from 'motion/react';

// Dedicated "How ANYFIX Works" Images
import howStep1Image from '../assets/images/how-it-works/step-1.png';
import howStep2Image from '../assets/images/regenerated_image_1791567036531.png';
import howStep3Image from '../assets/images/how-it-works/step-3.png';
import howStep4Image from '../assets/images/how-it-works/step-4.png';
import { ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onNavigate?: (path: string) => void;
}

interface StepCard {
  step: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  tag: string;
}

const steps: StepCard[] = [
  {
    step: '01',
    title: 'Choose Your Device & Book Instantly',
    description: 'Select your phone model, choose your issue, and pick a convenient doorstep time slot.',
    image: howStep1Image,
    alt: 'Customer scheduling doorstep phone repair on smartphone in modern apartment',
    tag: 'Quick Booking',
  },
  {
    step: '02',
    title: 'We Come to Your Doorstep',
    description: 'Certified ANYFIX technician arrives at your home or office equipped with professional tools.',
    image: howStep2Image,
    alt: 'Certified technician arriving at doorstep with professional toolkit',
    tag: 'At Your Doorstep',
  },
  {
    step: '03',
    title: 'We Repair Your Phone with 100% Transparency',
    description: 'Watch the entire precision repair happen live in front of your eyes with zero data risk.',
    image: howStep3Image,
    alt: 'Certified ANYFIX technician performing live screen repair in front of customer',
    tag: '100% Transparent',
  },
  {
    step: '04',
    title: 'We Deliver Every Repair with Trust & Warranty',
    description: 'Inspect your fully restored phone, test all features on the spot, and enjoy warranty coverage.',
    image: howStep4Image,
    alt: 'Delighted customer holding fully repaired and tested smartphone in living room',
    tag: 'Tested & Guaranteed',
  },
];

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/book-repair');
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/book-repair');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section
      id="how-anyfix-works-section"
      className="w-full bg-transparent py-10 sm:py-14 lg:py-16 border-t border-slate-200/60 relative"
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-[26px] sm:text-[30px] lg:text-[32px] font-extrabold text-[#0F172A] tracking-tight leading-tight mb-2 sm:mb-3"
          >
            How <span className="text-[#1D4ED8]">ANYFIX</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed"
          >
            No travel, no queues, and no handing over passwords. We bring certified expert smartphone repair directly to your living room.
          </motion.p>
        </div>

        {/* Clean Desktop 4-Column Grid / Naturally Stacking Mobile Cards with Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((item, index) => (
            <motion.article
              key={item.step}
              id={`how-it-works-step-${item.step}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className="glass-card group rounded-2xl overflow-hidden flex flex-col border border-white/80 bg-white/70 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_44px_rgba(29,78,216,0.14)] hover:-translate-y-2 hover:border-blue-400/50 hover:bg-white/90 transition-all duration-300"
            >
              {/* Image Container with Controlled Aspect Ratio */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105 block"
                />
                {/* Step Pill with Frosted Dark Glass */}
                <div className="glass-dark absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-white text-[11px] font-bold shadow-md">
                  Step {item.step}
                </div>
              </div>

              {/* Text Area in Glass Below Image */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#1D4ED8] uppercase tracking-wider block mb-1">
                    {item.tag}
                  </span>
                  <h3 className="text-[19px] sm:text-[20px] lg:text-[21px] font-bold text-[#111827] leading-snug tracking-tight mb-2 group-hover:text-[#1D4ED8] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom Booking Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-8 sm:mt-10 text-center"
        >
          <button
            type="button"
            onClick={handleCtaClick}
            className="glass-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 h-[48px] rounded-xl text-white font-bold text-sm sm:text-base cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
          >
            <span>Book Your Doorstep Repair</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
