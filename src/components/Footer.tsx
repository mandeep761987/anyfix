import React from 'react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    path: string
  ) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Book Repair', href: '/book-repair' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: '/footer/instagram.svg',
      href: 'https://instagram.com/anyfix.repair',
    },
    {
      name: 'Facebook',
      icon: '/footer/facebook.svg',
      href: 'https://facebook.com/anyfix.repair',
    },
    {
      name: 'LinkedIn',
      icon: '/footer/linkedin.svg',
      href: 'https://linkedin.com/company/anyfix',
    },
    {
      name: 'Website',
      icon: '/footer/website.svg',
      href: 'https://anyfix.in',
    },
  ];

  return (
    <footer id="anyfix-footer" className="w-full bg-gradient-to-b from-[#0F3D91] via-[#0D347D] to-[#0A265E] text-white flex flex-col font-sans relative overflow-hidden border-t border-white/15">
      {/* Subtle Ambient Radial Lighting in Footer */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-1/4 w-96 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* COMPACT MAIN FOOTER SECTION */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Block: Brand Logo & 1-line Tagline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="inline-block transition-opacity duration-250 hover:opacity-90 shrink-0"
              aria-label="ANYFIX Home"
            >
              <img
                src="/footer/anyfix-logo.svg"
                alt="ANYFIX"
                className="h-7 sm:h-8 w-auto object-contain drop-shadow-xs"
              />
            </a>
            <span className="hidden sm:inline-block text-white/30 text-xs">•</span>
            <p className="text-blue-100 text-xs sm:text-sm font-normal leading-tight">
              Doorstep Mobile Repair with transparent pricing &amp; 6 months warranty.
            </p>
          </div>

          {/* Center Block: Quick Links in One Single Row */}
          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 gap-y-2 text-xs sm:text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="group relative inline-flex items-center text-blue-100 hover:text-white font-medium transition-colors duration-250 cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-250 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Block: Social links with Frosted Glass Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 flex items-center justify-center p-2.5 text-white transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_0_16px_rgba(255,255,255,0.35)] active:scale-95 shrink-0"
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="w-4 h-4 object-contain filter invert brightness-0 [filter:brightness(0)_invert(1)]"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT BOTTOM BAR */}
      <div
        id="footer-bottom-bar"
        className="w-full border-t border-white/10 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 relative z-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-xs text-blue-200">
          <p>© 2026 ANYFIX. All Rights Reserved.</p>
          <div className="flex items-center gap-5 sm:gap-6">
            <a
              href="/privacy-policy"
              onClick={(e) => handleLinkClick(e, '/privacy-policy')}
              className="hover:text-white transition-colors duration-250 cursor-pointer"
            >
              Privacy Policy
            </a>
            <span className="text-white/20">•</span>
            <a
              href="/terms-and-conditions"
              onClick={(e) => handleLinkClick(e, '/terms-and-conditions')}
              className="hover:text-white transition-colors duration-250 cursor-pointer"
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
