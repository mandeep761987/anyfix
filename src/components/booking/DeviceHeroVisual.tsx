import React from 'react';

/**
 * Premium smartphone background visual for "Select Your Device" hero banner.
 * Modeled strictly after the uploaded reference design:
 * - White + very light ANYFIX blue (#F0F7FF)
 * - Modern flagship smartphones placed on the right
 * - Subtle tech wave curves & ambient glow
 * - Completely unobtrusive to text and search field
 */
export const DeviceHeroVisual: React.FC = () => {
  return (
    <div
      className="absolute right-0 top-0 bottom-0 w-full sm:w-3/5 lg:w-1/2 pointer-events-none select-none overflow-hidden flex items-center justify-end"
      aria-hidden="true"
    >
      {/* Ambient soft glow background */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-[#1D4ED8]/10 via-[#3B82F6]/15 to-transparent blur-3xl pointer-events-none" />

      {/* Graceful left-fade gradient mask to guarantee 100% text readability */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-[#F0F7FF] via-[#F0F7FF]/80 to-transparent z-10 pointer-events-none" />

      {/* SVG Vector Composition: Modern Flagship Phones & Tech Wave Curves */}
      <svg
        className="w-full h-full max-h-[340px] sm:max-h-[380px] lg:max-h-[400px] object-contain object-right opacity-30 sm:opacity-90 lg:opacity-100 transition-opacity duration-300"
        viewBox="0 0 560 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Shadow Filter */}
          <filter id="phone-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
            <feOffset dx="0" dy="16" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.18" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Titanium Frame Gradients */}
          <linearGradient id="titanium-front" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="40%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="titanium-back" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Screen OLED Wallpaper */}
          <linearGradient id="oled-screen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="45%" stopColor="#1C2D5A" />
            <stop offset="85%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Screen Luminous Waves */}
          <linearGradient id="screen-luminous-wave" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.95" />
          </linearGradient>

          {/* Glass Glare */}
          <linearGradient id="glass-glare" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Background Ambient Curved Waves */}
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="40%" stopColor="#2563EB" stopOpacity="0.25" />
            <stop offset="80%" stopColor="#60A5FA" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="50%" stopColor="#1D4ED8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.05" />
          </linearGradient>

          {/* Clip path for front phone screen */}
          <clipPath id="front-screen-clip">
            <rect x="6" y="6" width="168" height="328" rx="28" />
          </clipPath>
        </defs>

        {/* ================================================================= */}
        {/* Subtle Sweeping Flow Curves (Abstract Technology Waves)           */}
        {/* ================================================================= */}
        <g opacity="0.9">
          <path
            d="M-40,310 C120,290 220,180 340,150 C440,120 490,60 580,20"
            stroke="url(#wave-grad-1)"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
          <path
            d="M20,350 C180,330 270,220 390,190 C480,165 520,100 600,60"
            stroke="url(#wave-grad-2)"
            strokeWidth="2.5"
          />
          <path
            d="M90,380 C240,360 320,270 430,240 C510,215 550,160 610,130"
            stroke="url(#wave-grad-1)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
        </g>

        {/* Tech Nodes / Precision Accents */}
        <g opacity="0.45">
          <circle cx="270" cy="195" r="24" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="270" cy="195" r="14" stroke="#60A5FA" strokeWidth="1" />
          <circle cx="270" cy="195" r="3" fill="#1D4ED8" />

          <circle cx="490" cy="140" r="18" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="490" cy="140" r="2.5" fill="#2563EB" />
        </g>

        {/* ================================================================= */}
        {/* PHONE 2: SECONDARY SMARTPHONE (Offset Behind, Angled at +8°)     */}
        {/* ================================================================= */}
        <g transform="translate(375, 20) rotate(8)" filter="url(#phone-shadow)">
          {/* Phone Shadow Base */}
          <ellipse cx="85" cy="335" rx="75" ry="14" fill="#0F172A" opacity="0.16" />

          {/* Outer Chassis */}
          <rect
            x="0"
            y="0"
            width="170"
            height="325"
            rx="32"
            fill="#0F172A"
            stroke="url(#titanium-back)"
            strokeWidth="2.5"
          />

          {/* Matte Glass Back Panel */}
          <rect
            x="3"
            y="3"
            width="164"
            height="319"
            rx="29"
            fill="url(#titanium-back)"
          />

          {/* Triple Camera Bump Module */}
          <rect
            x="14"
            y="16"
            width="68"
            height="72"
            rx="18"
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="1.2"
          />

          {/* Lens 1 (Top Left) */}
          <g transform="translate(32, 34)">
            <circle cx="0" cy="0" r="12" fill="#0B0F19" stroke="#64748B" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="7" fill="#020617" />
            <circle cx="-2" cy="-2" r="2" fill="#38BDF8" opacity="0.75" />
          </g>

          {/* Lens 2 (Bottom Left) */}
          <g transform="translate(32, 66)">
            <circle cx="0" cy="0" r="12" fill="#0B0F19" stroke="#64748B" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="7" fill="#020617" />
            <circle cx="-2" cy="-2" r="2" fill="#38BDF8" opacity="0.75" />
          </g>

          {/* Lens 3 (Right Middle) */}
          <g transform="translate(60, 50)">
            <circle cx="0" cy="0" r="12" fill="#0B0F19" stroke="#64748B" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="7" fill="#020617" />
            <circle cx="-2" cy="-2" r="2" fill="#38BDF8" opacity="0.75" />
          </g>

          {/* Camera Flash */}
          <circle cx="60" cy="28" r="4" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.8" opacity="0.9" />

          {/* Microphone Hole */}
          <circle cx="60" cy="72" r="2" fill="#020617" />
        </g>

        {/* ================================================================= */}
        {/* PHONE 1: PRIMARY FLAGSHIP SMARTPHONE (Front, Angled at -5°)       */}
        {/* ================================================================= */}
        <g transform="translate(290, 25) rotate(-5)" filter="url(#phone-shadow)">
          {/* Phone Shadow Base */}
          <ellipse cx="90" cy="348" rx="85" ry="16" fill="#0F172A" opacity="0.22" />

          {/* Titanium Outer Rim */}
          <rect
            x="0"
            y="0"
            width="180"
            height="340"
            rx="34"
            fill="#1E293B"
            stroke="url(#titanium-front)"
            strokeWidth="3"
          />

          {/* Side Buttons Hint */}
          <rect x="-3" y="65" width="3" height="24" rx="1.5" fill="#64748B" />
          <rect x="-3" y="98" width="3" height="32" rx="1.5" fill="#64748B" />
          <rect x="180" y="80" width="3" height="38" rx="1.5" fill="#64748B" />

          {/* Inner OLED Display */}
          <g clipPath="url(#front-screen-clip)">
            {/* Display Base */}
            <rect x="6" y="6" width="168" height="328" rx="28" fill="url(#oled-screen-grad)" />

            {/* Glowing Screen Artwork (Tech Fluid Aurora in Royal Blue & Cyan) */}
            <path
              d="M6,160 C50,110 110,210 174,150 L174,334 L6,334 Z"
              fill="url(#screen-luminous-wave)"
            />

            <circle cx="125" cy="115" r="60" fill="#60A5FA" opacity="0.35" filter="url(#phone-shadow)" />
            <circle cx="50" cy="230" r="70" fill="#1D4ED8" opacity="0.4" />

            {/* Subtle Screen Interface Mockup Elements */}
            <text
              x="20"
              y="32"
              fill="#FFFFFF"
              fontSize="9"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="600"
              opacity="0.85"
            >
              9:41
            </text>
            <circle cx="150" cy="28" r="2.5" fill="#FFFFFF" opacity="0.85" />
            <path d="M156,26 L164,26 M156,28.5 L164,28.5 M156,31 L164,31" stroke="#FFFFFF" strokeWidth="1" opacity="0.85" />

            {/* Top Dynamic Island */}
            <rect x="56" y="16" width="56" height="15" rx="7.5" fill="#000000" />
            <circle cx="66" cy="23.5" r="3" fill="#0F172A" />
            <circle cx="66" cy="23.5" r="1.2" fill="#0284C7" opacity="0.8" />
            <circle cx="98" cy="23.5" r="2.2" fill="#0F172A" />

            {/* Bottom Home Bar */}
            <rect x="62" y="324" width="56" height="3.5" rx="1.75" fill="#FFFFFF" opacity="0.75" />

            {/* Glass Surface Glare / Specular Reflection */}
            <polygon points="6,6 80,6 25,334 6,334" fill="url(#glass-glare)" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default DeviceHeroVisual;
