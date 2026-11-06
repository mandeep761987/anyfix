import { useEffect } from 'react';

interface RouteMetadata {
  title: string;
  description: string;
  canonicalPath: string;
}

const ROUTE_SEO: Record<string, RouteMetadata> = {
  '/': {
    title: 'ANYFIX | Doorstep Mobile Phone Repair in Delhi NCR',
    description:
      'Get professional mobile phone repair at your doorstep with ANYFIX. Transparent service, trained technicians, quality parts and warranty across Delhi NCR, Noida and Ghaziabad.',
    canonicalPath: '/',
  },
  '/book-repair': {
    title: 'Book Mobile Repair at Your Doorstep | ANYFIX',
    description:
      'Schedule doorstep phone repair with ANYFIX. Select your phone brand, choose repair service, pick a convenient time slot and get it repaired at home.',
    canonicalPath: '/book-repair',
  },
  '/track-repair': {
    title: 'Track Your Phone Repair | ANYFIX',
    description:
      'Track your active ANYFIX doorstep phone repair order in real-time. Enter your Booking ID to see live technician updates and repair milestones.',
    canonicalPath: '/track-repair',
  },
  '/blog': {
    title: 'ANYFIX Blog | Mobile Repair Tips & Guides',
    description:
      'Read helpful smartphone repair guides, device maintenance tips, and industry insights from the ANYFIX technician team.',
    canonicalPath: '/blog',
  },
  '/contact': {
    title: 'Contact ANYFIX | Doorstep Mobile Repair',
    description:
      'Get in touch with ANYFIX for phone repair consultations, active order updates, and customer support across Delhi NCR, Noida, and Ghaziabad.',
    canonicalPath: '/contact',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | ANYFIX',
    description:
      "Learn about ANYFIX's commitment to protecting your privacy, data security, and how your personal information is handled.",
    canonicalPath: '/privacy-policy',
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | ANYFIX',
    description:
      'Review the official service terms, warranty guidelines, and repair agreement for ANYFIX doorstep smartphone repairs.',
    canonicalPath: '/terms-and-conditions',
  },
};

export function useRouteSeo(pathname: string) {
  useEffect(() => {
    const cleanPath = pathname.split('?')[0] || '/';
    const metadata = ROUTE_SEO[cleanPath] || ROUTE_SEO['/'];

    // Update document.title
    document.title = metadata.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', metadata.description);

    // Update Canonical URL
    const canonicalUrl = `https://withanyfix.in${
      metadata.canonicalPath === '/' ? '/' : metadata.canonicalPath
    }`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', metadata.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', metadata.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    // Update Twitter tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', metadata.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', metadata.description);
  }, [pathname]);
}
