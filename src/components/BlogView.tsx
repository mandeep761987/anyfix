import React from 'react';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface BlogViewProps {
  onNavigate?: (path: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onNavigate }) => {
  const handleBookRepair = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/book-repair');
    }
  };

  return (
    <div className="w-full bg-transparent text-[#0F172A] font-sans pt-[100px] sm:pt-[120px] pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="glass-pill-blue inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ANYFIX Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Latest Repair Tips
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Helpful guides and phone repair insights.
          </p>
        </div>

        {/* Three Article Cards with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              id: 'card-1',
              title: 'Screen Replacement: OEM vs Aftermarket Displays',
              category: 'Hardware Insights',
              readTime: '4 min read',
              placeholderText: 'Coming Soon • Article in preparation by certified technicians',
            },
            {
              id: 'card-2',
              title: 'Extending Battery Longevity & Charging Health',
              category: 'Battery Care',
              readTime: '3 min read',
              placeholderText: 'Coming Soon • Best practices for Li-ion battery health',
            },
            {
              id: 'card-3',
              title: 'Emergency Steps After Phone Water Damage',
              category: 'Emergency Guide',
              readTime: '5 min read',
              placeholderText: 'Coming Soon • First-response actions to protect device internals',
            },
          ].map((article) => (
            <article
              key={article.id}
              className="glass-card rounded-[28px] border border-white/80 bg-white/75 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_40px_rgba(29,78,216,0.12)] hover:border-blue-400/50 hover:bg-white/95 hover:-translate-y-1.5 transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Image Placeholder Frame */}
                <div className="w-full h-48 bg-slate-50/70 border-2 border-dashed border-slate-200/90 rounded-[20px] flex flex-col items-center justify-center p-4 text-slate-400 group-hover:border-blue-300 transition-colors duration-250 mb-6">
                  <BookOpen className="w-8 h-8 text-slate-300 group-hover:text-[#1D4ED8] transition-colors duration-250 mb-2" />
                  <span className="text-xs font-semibold text-slate-400">Featured Image Slot</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                  <span className="glass-pill-blue font-bold px-3 py-1 rounded-full text-xs">
                    {article.category}
                  </span>
                  <span>{article.readTime}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors duration-250 leading-snug mb-3">
                  {article.title}
                </h2>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {article.placeholderText}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Coming Soon</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1D4ED8] group-hover:translate-x-1 transition-transform duration-250">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Quick CTA with Frosted Glass Panel */}
        <div className="glass-panel rounded-[28px] border border-white/90 bg-white/70 backdrop-blur-xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-[0_12px_36px_rgba(29,78,216,0.06)] relative overflow-hidden">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-2">
            Experiencing phone trouble today?
          </h3>
          <p className="text-slate-600 text-sm mb-6">
            Skip the DIY risks. Certified ANYFIX doorstep engineers repair your phone in 30 minutes in Delhi NCR.
          </p>
          <button
            type="button"
            onClick={handleBookRepair}
            className="glass-btn-primary inline-flex items-center justify-center px-7 py-3 text-white font-bold text-sm rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
          >
            Book Doorstep Repair
          </button>
        </div>
      </div>
    </div>
  );
};
