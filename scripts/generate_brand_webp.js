import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDir = path.join(process.cwd(), 'public', 'booking', 'brands');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 8 Distinct, High-End Smartphone Devices (Pure Phone Hardware & Screens - No Logos, No Brand Names)
const brands = [
  {
    name: 'apple',
    svg: `<svg width="256" height="340" viewBox="0 0 256 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ap-body" x1="48" y1="20" x2="208" y2="310" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#3A3D40"/>
          <stop offset="50%" stop-color="#1E2022"/>
          <stop offset="100%" stop-color="#121315"/>
        </linearGradient>
        <linearGradient id="ap-screen" x1="56" y1="28" x2="200" y2="302" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="30%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="ap-rim" x1="46" y1="18" x2="210" y2="312" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#94A3B8"/>
          <stop offset="40%" stop-color="#475569"/>
          <stop offset="100%" stop-color="#1E293B"/>
        </linearGradient>
        <linearGradient id="ap-glow" x1="128" y1="28" x2="128" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#38BDF8" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="ap-wallpaper" x1="70" y1="90" x2="190" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#6366F1" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="#3B82F6" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="128" cy="324" rx="72" ry="12" fill="#0F172A" fill-opacity="0.15"/>
      
      <!-- Outer Rim (Titanium finish with curved corners) -->
      <rect x="48" y="18" width="160" height="294" rx="38" fill="url(#ap-rim)"/>
      <!-- Inner Body Frame -->
      <rect x="51" y="21" width="154" height="288" rx="35" fill="url(#ap-body)"/>
      <!-- Super Retina Screen -->
      <rect x="55" y="25" width="146" height="280" rx="31" fill="url(#ap-screen)"/>
      <!-- Ambient Glow & Wallpaper Wave (Pure visual, no logos) -->
      <rect x="55" y="25" width="146" height="120" rx="31" fill="url(#ap-glow)"/>
      <path d="M55 180C90 140 130 200 201 150V274C201 291 187 305 170 305H86C69 305 55 291 55 274V180Z" fill="url(#ap-wallpaper)"/>
      
      <!-- Dynamic Island Pill -->
      <rect x="105" y="34" width="46" height="13" rx="6.5" fill="#000000"/>
      <circle cx="140" cy="40.5" r="2.5" fill="#1E293B"/>
      <circle cx="118" cy="40.5" r="1.8" fill="#0F172A"/>
      
      <!-- Home Indicator bar -->
      <rect x="104" y="294" width="48" height="4" rx="2" fill="#FFFFFF" fill-opacity="0.7"/>
    </svg>`
  },
  {
    name: 'samsung',
    svg: `<svg width="256" height="340" viewBox="0 0 256 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ss-body" x1="46" y1="18" x2="210" y2="312" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="ss-screen" x1="52" y1="24" x2="204" y2="306" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#0F172A"/>
          <stop offset="50%" stop-color="#1E1B4B"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="ss-rim" x1="44" y1="16" x2="212" y2="314" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#94A3B8"/>
          <stop offset="50%" stop-color="#64748B"/>
          <stop offset="100%" stop-color="#334155"/>
        </linearGradient>
        <linearGradient id="ss-lines" x1="60" y1="100" x2="200" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#818CF8" stop-opacity="0.7"/>
          <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#C084FC" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="128" cy="324" rx="72" ry="12" fill="#0F172A" fill-opacity="0.15"/>
      
      <!-- Outer Boxy Ultra Rim with tight corners -->
      <rect x="46" y="18" width="164" height="294" rx="14" fill="url(#ss-rim)"/>
      <!-- Inner Frame -->
      <rect x="49" y="21" width="158" height="288" rx="11" fill="url(#ss-body)"/>
      <!-- Infinity Flat Screen -->
      <rect x="53" y="25" width="150" height="280" rx="8" fill="url(#ss-screen)"/>
      
      <!-- Center Infinity-O Punch Hole -->
      <circle cx="128" cy="36" r="3.5" fill="#000000"/>
      <circle cx="128" cy="36" r="1.8" fill="#1E293B"/>
      <circle cx="129" cy="35" r="0.8" fill="#38BDF8" fill-opacity="0.8"/>
      
      <!-- Geometric Modern Screen Wallpaper (Pure phone visual) -->
      <path d="M70 230C100 170 150 210 190 140" stroke="url(#ss-lines)" stroke-width="4" stroke-linecap="round"/>
      <path d="M80 250C110 190 150 230 180 170" stroke="url(#ss-lines)" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.6"/>
      
      <!-- Bottom bar -->
      <rect x="108" y="294" width="40" height="3" rx="1.5" fill="#E2E8F0" fill-opacity="0.7"/>
    </svg>`
  },
  {
    name: 'oneplus',
    svg: `<svg width="256" height="340" viewBox="0 0 256 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="op-body" x1="48" y1="18" x2="208" y2="312" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#2D3748"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
        <linearGradient id="op-screen" x1="54" y1="24" x2="202" y2="306" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#18181B"/>
          <stop offset="50%" stop-color="#27272A"/>
          <stop offset="100%" stop-color="#09090B"/>
        </linearGradient>
        <linearGradient id="op-wave" x1="60" y1="120" x2="200" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#EF4444" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#991B1B" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="128" cy="324" rx="72" ry="12" fill="#0F172A" fill-opacity="0.15"/>
      
      <!-- Outer Rim (Curved flagship ergonomics) -->
      <rect x="48" y="18" width="160" height="294" rx="30" fill="#64748B"/>
      <!-- Inner Frame -->
      <rect x="51" y="21" width="154" height="288" rx="27" fill="url(#op-body)"/>
      <!-- Fluid Screen -->
      <rect x="55" y="25" width="146" height="280" rx="24" fill="url(#op-screen)"/>
      
      <!-- Minimal punch hole -->
      <circle cx="128" cy="36" r="3.2" fill="#000000"/>
      <circle cx="128" cy="36" r="1.6" fill="#475569"/>
      
      <!-- Flowing Fluid Wallpaper Wave (No logos) -->
      <path d="M55 210C95 160 140 240 201 170V280C201 294 190 305 176 305H80C66 305 55 294 55 280V210Z" fill="url(#op-wave)"/>
      
      <!-- Bottom gesture bar -->
      <rect x="106" y="294" width="44" height="3.5" rx="1.75" fill="#E2E8F0" fill-opacity="0.6"/>
    </svg>`
  },
  {
    name: 'xiaomi',
    svg: `<svg width="256" height="340" viewBox="0 0 256 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="xm-body" x1="48" y1="18" x2="208" y2="312" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#374151"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
        <linearGradient id="xm-screen" x1="54" y1="24" x2="202" y2="306" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="60%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="xm-wallpaper" x1="80" y1="100" x2="180" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FB923C" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#EA580C" stop-opacity="0.15"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="128" cy="324" rx="72" ry="12" fill="#0F172A" fill-opacity="0.15"/>
      
      <!-- Outer Rim (Quad curved micro bezel) -->
      <rect x="48" y="18" width="160" height="294" rx="32" fill="#71717A"/>
      <rect x="51" y="21" width="154" height="288" rx="29" fill="url(#xm-body)"/>
      <rect x="55" y="25" width="146" height="280" rx="25" fill="url(#xm-screen)"/>
      
      <!-- Punch hole -->
      <circle cx="128" cy="36" r="3" fill="#000000"/>
      <circle cx="128" cy="36" r="1.5" fill="#3F3F46"/>
      
      <!-- Abstract Ambient Ring Wallpaper (No logos) -->
      <circle cx="128" cy="160" r="50" stroke="url(#xm-wallpaper)" stroke-width="6" stroke-dasharray="8 6"/>
      <circle cx="128" cy="160" r="36" stroke="url(#xm-wallpaper)" stroke-width="2.5"/>
      
      <!-- Bottom bar -->
      <rect x="108" y="294" width="40" height="3" rx="1.5" fill="#CBD5E1" fill-opacity="0.6"/>
    </svg>`
  },
  {
    name: 'vivo',
    svg: `<svg width="256" height="340" viewBox="0 0 256 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vv-body" x1="48" y1="18" x2="208" y2="312" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="vv-screen" x1="54" y1="24" x2="202" y2="306" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#0F172A"/>
          <stop offset="70%" stop-color="#0369A1"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="vv-glow" x1="128" y1="100" x2="128" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#0284C7" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="128" cy="324" rx="72" ry="12" fill="#0F172A" fill-opacity="0.15"/>
      
      <!-- Outer Rim (Slim curved bezel) -->
      <rect x="48" y="18" width="160" height="294" rx="30" fill="#475569"/>
      <rect x="51" y="21" width="154" height="288" rx="27" fill="url(#vv-body)"/>
      <rect x="55" y="25" width="146" height="280" rx="24" fill="url(#vv-screen)"/>
      
      <!-- Punch hole -->
      <circle cx="128" cy="36" r="3" fill="#000000"/>
      <circle cx="128" cy="36" r="1.5" fill="#0284C7"/>
      
      <!-- Smooth Blue Light Ribbon Wallpaper (No logos) -->
      <path d="M55 220C100 150 150 250 201 180V278C201 293 189 305 174 305H82C67 305 55 293 55 278V220Z" fill="url(#vv-glow)"/>
      
      <!-- Bottom bar -->
      <rect x="108" y="294" width="40" height="3" rx="1.5" fill="#E2E8F0" fill-opacity="0.6"/>
    </svg>`
  },
  {
    name: 'oppo',
    svg: `<svg width="256" height="340" viewBox="0 0 256 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="op-bd" x1="48" y1="18" x2="208" y2="312" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="op-sc" x1="54" y1="24" x2="202" y2="306" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#064E3B"/>
          <stop offset="50%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#022C22"/>
        </linearGradient>
        <linearGradient id="op-emerald" x1="60" y1="110" x2="190" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#34D399" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#059669" stop-opacity="0.05"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="128" cy="324" rx="72" ry="12" fill="#0F172A" fill-opacity="0.15"/>
      
      <!-- Outer Rim -->
      <rect x="48" y="18" width="160" height="294" rx="30" fill="#64748B"/>
      <rect x="51" y="21" width="154" height="288" rx="27" fill="url(#op-bd)"/>
      <rect x="55" y="25" width="146" height="280" rx="24" fill="url(#op-sc)"/>
      
      <!-- Camera punch -->
      <circle cx="128" cy="36" r="3" fill="#000000"/>
      <circle cx="128" cy="36" r="1.5" fill="#10B981"/>
      
      <!-- Emerald Silk Wallpaper Ribbon (No logos) -->
      <path d="M60 210C110 160 140 230 196 170" stroke="url(#op-emerald)" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M70 230C120 180 150 250 186 190" stroke="url(#op-emerald)" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.6"/>
      
      <!-- Bottom bar -->
      <rect x="108" y="294" width="40" height="3" rx="1.5" fill="#D1FAE5" fill-opacity="0.6"/>
    </svg>`
  },
  {
    name: 'realme',
    svg: `<svg width="256" height="340" viewBox="0 0 256 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rm-body" x1="48" y1="18" x2="208" y2="312" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#374151"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
        <linearGradient id="rm-screen" x1="54" y1="24" x2="202" y2="306" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#18181B"/>
          <stop offset="60%" stop-color="#27272A"/>
          <stop offset="100%" stop-color="#09090B"/>
        </linearGradient>
        <linearGradient id="rm-accent" x1="70" y1="120" x2="190" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FACC15" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#CA8A04" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="128" cy="324" rx="72" ry="12" fill="#0F172A" fill-opacity="0.15"/>
      
      <!-- Outer Rim -->
      <rect x="48" y="18" width="160" height="294" rx="28" fill="#9CA3AF"/>
      <rect x="51" y="21" width="154" height="288" rx="25" fill="url(#rm-body)"/>
      <rect x="55" y="25" width="146" height="280" rx="22" fill="url(#rm-screen)"/>
      
      <!-- Punch hole -->
      <circle cx="128" cy="36" r="3" fill="#000000"/>
      <circle cx="128" cy="36" r="1.5" fill="#EAB308"/>
      
      <!-- Modern Diagonal Speed Stripes Wallpaper (No logos) -->
      <line x1="80" y1="120" x2="160" y2="240" stroke="url(#rm-accent)" stroke-width="4" stroke-linecap="round"/>
      <line x1="96" y1="120" x2="176" y2="240" stroke="url(#rm-accent)" stroke-width="2" stroke-linecap="round" stroke-opacity="0.5"/>
      
      <!-- Bottom bar -->
      <rect x="108" y="294" width="40" height="3" rx="1.5" fill="#FEF08A" fill-opacity="0.6"/>
    </svg>`
  },
  {
    name: 'pixel',
    svg: `<svg width="256" height="340" viewBox="0 0 256 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="px-body" x1="48" y1="18" x2="208" y2="312" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#475569"/>
          <stop offset="100%" stop-color="#1E293B"/>
        </linearGradient>
        <linearGradient id="px-screen" x1="54" y1="24" x2="202" y2="306" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#0F172A"/>
          <stop offset="50%" stop-color="#1E293B"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="px-bloom" x1="128" y1="90" x2="128" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.5"/>
          <stop offset="50%" stop-color="#A78BFA" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#F472B6" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <!-- Shadow -->
      <ellipse cx="128" cy="324" rx="72" ry="12" fill="#0F172A" fill-opacity="0.15"/>
      
      <!-- Outer Rim (Very rounded iconic Google corners) -->
      <rect x="48" y="18" width="160" height="294" rx="38" fill="#94A3B8"/>
      <rect x="51" y="21" width="154" height="288" rx="35" fill="url(#px-body)"/>
      <rect x="55" y="25" width="146" height="280" rx="31" fill="url(#px-screen)"/>
      
      <!-- Punch hole -->
      <circle cx="128" cy="36" r="3.2" fill="#000000"/>
      <circle cx="128" cy="36" r="1.6" fill="#3B82F6"/>
      
      <!-- Soft Atmospheric Bloom Wallpaper (Pure visual, no logos) -->
      <circle cx="128" cy="170" r="48" fill="url(#px-bloom)"/>
      <ellipse cx="128" cy="180" rx="58" ry="32" fill="url(#px-bloom)" fill-opacity="0.7"/>
      
      <!-- Bottom bar -->
      <rect x="106" y="294" width="44" height="3" rx="1.5" fill="#E2E8F0" fill-opacity="0.6"/>
    </svg>`
  }
];

async function generate() {
  for (const b of brands) {
    const filePath = path.join(outputDir, `${b.name}.webp`);
    const svgBuffer = Buffer.from(b.svg);
    await sharp(svgBuffer)
      .resize(256, 340)
      .webp({ quality: 95 })
      .toFile(filePath);
    console.log(`Generated ${filePath}`);
  }
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
