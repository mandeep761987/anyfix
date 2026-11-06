import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Menu, X, ArrowRight, MapPin } from 'lucide-react';

// Dedicated Navbar Logo Reference
import navbarLogo from '../assets/images/regenerated_image_1791568786089.png';

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath = typeof window !== 'undefined' ? window.location.pathname : '/',
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll listener for scroll threshold of 40px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { id: 'nav-home', label: 'Home', href: '/' },
    { id: 'nav-services', label: 'Services', href: '/services' },
    { id: 'nav-track-repair', label: 'Track Repair', href: '/track-repair' },
    { id: 'nav-blog', label: 'Blog', href: '/blog' },
    { id: 'nav-contact', label: 'Contact', href: '/contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (onNavigate) {
      onNavigate(href);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const isLinkActive = (href: string): boolean => {
    const cleanPath = currentPath.split('?')[0];
    if (href === '/') {
      return cleanPath === '/' || cleanPath === '';
    }
    return cleanPath === href || cleanPath.startsWith(`${href}/`);
  };

  return (
    <>
      {/* ===== ANYFIX HEADER NAVBAR ===== */}
      <header
        id="anyfix-main-navbar"
        role="banner"
        className="navbar-area fixed top-0 left-0 w-full z-[999] glass-nav h-[72px] transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="h-full w-full flex items-center justify-between pointer-events-auto">
          {/* LEFT: Dedicated Logo Area with breathing space */}
          <div className="flex items-center py-1">
            <a
              id="navbar-brand-link"
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              aria-label="ANYFIX Home"
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2 transition-transform duration-200 hover:opacity-90"
            >
              <img
                src={navbarLogo}
                alt="ANYFIX Doorstep Phone Repair"
                className="h-[44px] sm:h-[48px] w-auto object-contain drop-shadow-xs"
              />
            </a>
          </div>

          {/* CENTER: Navigation Links with 32px Gap and 16px Font */}
          <nav
            id="desktop-navbar-links"
            role="navigation"
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-[28px] lg:gap-[32px]"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <a
                  key={link.id}
                  id={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative text-[15px] lg:text-[16px] font-semibold transition-all duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                    active
                      ? 'bg-[#1D4ED8]/10 text-[#1D4ED8] border border-[#1D4ED8]/20 px-4 py-1.5 shadow-xs backdrop-blur-md'
                      : 'text-[#334155] hover:text-[#1D4ED8] hover:bg-white/70 hover:backdrop-blur-md px-3 py-1.5 border border-transparent'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  
                  {/* Smooth Underline animation for inactive links on hover */}
                  {!active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-[#1D4ED8] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* RIGHT: Single CTA Button "Book Repair" */}
          <div className="hidden sm:flex items-center">
            <a
              id="btn-nav-book-repair"
              href="/book-repair"
              onClick={(e) => handleLinkClick(e, '/book-repair')}
              className="glass-btn-primary inline-flex items-center justify-center gap-2 h-[46px] lg:h-[48px] px-5 lg:px-6 rounded-[14px] text-[15px] font-semibold text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
            >
              <Smartphone className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              <span>Book Repair</span>
            </a>
          </div>

          {/* MOBILE: Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              id="btn-mobile-menu"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/75 backdrop-blur-md border border-slate-200/80 text-[#334155] hover:text-[#1D4ED8] hover:bg-white/95 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] transition-all duration-200 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE DRAWER BACKDROP */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-backdrop"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 md:hidden"
        />
      )}

      {/* MOBILE FULL-SCREEN SLIDE DRAWER */}
      <div
        id="mobile-navigation-drawer"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white/90 backdrop-blur-2xl shadow-2xl border-l border-white/60 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden pt-safe pb-safe ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/60 flex items-center justify-between bg-white/60 backdrop-blur-md">
          <img
            src={navbarLogo}
            alt="ANYFIX Doorstep Phone Repair"
            className="h-[36px] w-auto object-contain"
          />

          <button
            id="btn-close-mobile-drawer"
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2.5">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <a
                key={`mobile-${link.id}`}
                id={`mobile-${link.id}`}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-semibold transition-all duration-200 min-h-[44px] ${
                  active
                    ? 'bg-[#1D4ED8]/10 text-[#1D4ED8] font-bold border border-[#1D4ED8]/25 shadow-xs backdrop-blur-md'
                    : 'text-[#334155] hover:bg-white/80 hover:text-[#1D4ED8] border border-transparent'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform ${
                    active ? 'text-[#1D4ED8] translate-x-0.5' : 'text-slate-400'
                  }`}
                />
              </a>
            );
          })}

          {/* Region indicator */}
          <div className="mt-4 p-3 bg-blue-50/80 backdrop-blur-md border border-blue-200/60 rounded-xl flex items-center gap-2.5 text-xs text-blue-900 font-medium shadow-2xs">
            <MapPin className="w-4 h-4 text-[#1D4ED8] shrink-0" />
            <span>Serving Delhi NCR • Noida • Ghaziabad</span>
          </div>
        </div>

        {/* Drawer Bottom CTA: Full-width Blue "Book Repair" Button */}
        <div className="p-4 border-t border-white/60 bg-white/70 backdrop-blur-md space-y-2.5">
          <a
            id="mobile-btn-book-repair"
            href="/book-repair"
            onClick={(e) => handleLinkClick(e, '/book-repair')}
            className="glass-btn-primary w-full inline-flex items-center justify-center gap-2 h-[48px] px-4 rounded-[14px] text-[15px] font-semibold text-white transition-all duration-200"
          >
            <Smartphone className="w-4 h-4 text-white" />
            <span>Book Repair</span>
          </a>
        </div>
      </div>
    </>
  );
};
