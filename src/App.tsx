import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { GoogleReviews } from './components/GoogleReviews';
import { CheckPriceCta } from './components/CheckPriceCta';
import { WhyWeStartedAnyfix } from './components/WhyWeStartedAnyfix';
import { BookingForm } from './components/BookingForm';
import { TrackingView } from './components/TrackingView';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { Footer } from './components/Footer';
import { BlogView } from './components/BlogView';
import { ContactView } from './components/ContactView';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { TermsView } from './components/TermsView';
import { useRouteSeo } from './lib/useRouteSeo';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}` || '/'
      : '/';
  });

  useRouteSeo(currentPath);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(`${window.location.pathname}${window.location.search}` || '/');
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      const currentFull = `${window.location.pathname}${window.location.search}`;
      if (currentFull !== path) {
        window.history.pushState({}, '', path);
        setCurrentPath(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const renderCurrentView = () => {
    const pathname = currentPath.split('?')[0];
    const queryStr = currentPath.includes('?')
      ? currentPath.substring(currentPath.indexOf('?'))
      : '';
    const searchParams = new URLSearchParams(
      queryStr || (typeof window !== 'undefined' ? window.location.search : '')
    );
    const bookingIdFromUrl =
      searchParams.get('bookingId') || searchParams.get('id') || '';

    // 1. Dynamic Google Sheet Booking Form Flow
    if (
      pathname === '/book-repair' ||
      pathname === '/price-estimator' ||
      pathname === '/services'
    ) {
      return (
        <div className="pt-[72px] flex-1 flex flex-col">
          <BookingForm
            onSuccess={(summary) => {
              console.log('Booking submitted successfully:', summary);
            }}
            onTrackRepair={(bookingId) => {
              handleNavigate(`/track-repair?bookingId=${encodeURIComponent(bookingId)}`);
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onNavigate={handleNavigate}
          />
        </div>
      );
    }

    // 2. Track Repair View
    if (pathname === '/track-repair') {
      return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] sm:pt-[120px] pb-16 sm:pb-20">
          <TrackingView
            initialBookingId={bookingIdFromUrl}
            onBookNew={() => {
              handleNavigate('/book-repair');
            }}
          />
        </div>
      );
    }

    // 3. Blog View
    if (pathname === '/blog') {
      return <BlogView onNavigate={handleNavigate} />;
    }

    // 4. Contact View
    if (pathname === '/contact') {
      return <ContactView onNavigate={handleNavigate} />;
    }

    // 5. Privacy Policy View
    if (pathname === '/privacy-policy') {
      return <PrivacyPolicyView onNavigate={handleNavigate} />;
    }

    // 6. Terms & Conditions View
    if (pathname === '/terms-and-conditions') {
      return <TermsView onNavigate={handleNavigate} />;
    }

    // Default / Homepage (Hero + How ANYFIX Works + Google Reviews + Check Repair Price CTA + Why We Started)
    return (
      <>
        <Hero onNavigate={handleNavigate} />
        <HowItWorks onNavigate={handleNavigate} />
        <GoogleReviews onNavigate={handleNavigate} />
        <CheckPriceCta
          onCheckPrice={() => {
            handleNavigate('/book-repair');
          }}
        />
        <WhyWeStartedAnyfix onNavigate={handleNavigate} />
      </>
    );
  };

  const isBookingFlow =
    currentPath.startsWith('/book-repair') ||
    currentPath.startsWith('/price-estimator') ||
    currentPath.startsWith('/services');

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#1D4ED8] selection:text-white relative">
      {/* Ambient Fluid Mesh & Glassmorphism Depth Layer (Fixed & Non-blocking) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      >
        <div className="absolute -top-[15%] left-[5%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-blue-400/12 via-indigo-400/8 to-transparent blur-[90px] animate-ambient-1" />
        <div className="absolute top-[35%] -right-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-bl from-sky-300/15 via-blue-500/8 to-transparent blur-[110px] animate-ambient-2" />
        <div className="absolute top-[75%] left-[15%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-indigo-300/10 via-cyan-400/8 to-transparent blur-[100px] animate-ambient-3" />
      </div>

      {/* ANYFIX Premium Brand Navigation */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main id="main-content" className="flex-1 w-full overflow-x-clip flex flex-col relative z-0">
        {renderCurrentView()}
      </main>

      {/* Premium ANYFIX Footer (hidden on Booking flow per request) */}
      {!isBookingFlow && <Footer onNavigate={handleNavigate} />}

      {/* API Configuration Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUrlUpdated={() => {
          // Re-trigger location to refresh component with updated endpoint
          window.dispatchEvent(new Event('storage'));
        }}
      />
    </div>
  );
}
