import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Smartphone,
  ShieldCheck,
  Wrench,
  RotateCcw,
  Clock,
  MapPin,
  Navigation,
  AlertCircle,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Battery,
  Camera,
  Zap,
  Layers,
  Volume2,
  Droplets,
  Cpu,
  Sliders,
  Pencil,
  Trash2,
  ShoppingCart,
  Plus,
  Shield,
  Wifi,
  Cog,
  AlertTriangle,
} from 'lucide-react';
import appleLogoImg from '../assets/images/regenerated_image_1790777418701.png';
import samsungLogoImg from '../assets/images/regenerated_image_1790777421399.png';
import oneplusLogoImg from '../assets/images/regenerated_image_1790778221919.png';
import googleLogoImg from '../assets/images/regenerated_image_1790778226948.png';
import motorolaLogoImg from '../assets/images/regenerated_image_1790778230701.png';
import nothingLogoImg from '../assets/images/regenerated_image_1790778234464.png';

// Service selection 16:9 photography assets
import serviceDisplayImg from '../assets/images/regenerated_image_1793119582675.jpg';
import serviceBatteryImg from '../assets/images/regenerated_image_1793016613820.png';
import serviceBackGlassImg from '../assets/images/regenerated_image_1793120726644.jpg';
import serviceCamerasImg from '../assets/images/regenerated_image_1793120735653.jpg';
import serviceRestartIssuesImg from '../assets/images/regenerated_image_1793120737437.jpg';
import serviceDamagedPhoneImg from '../assets/images/regenerated_image_1793120739048.jpg';
import serviceWaterDamageImg from '../assets/images/regenerated_image_1793120740800.jpg';
import serviceSpeakerImg from '../assets/images/regenerated_image_1793016588074.png';
import serviceMicrophoneImg from '../assets/images/regenerated_image_1793016591007.png';
import serviceConnectivityImg from '../assets/images/regenerated_image_1793016594164.png';
import serviceButtonsImg from '../assets/images/regenerated_image_1793016597005.png';
import serviceProximityImg from '../assets/images/regenerated_image_1793016601152.png';
import serviceHapticsImg from '../assets/images/regenerated_image_1793016604103.png';
import serviceOtherIssuesImg from '../assets/images/regenerated_image_1793120725034.jpg';
import partGradeOemImg from '../assets/images/regenerated_image_1793122351361.png';
import partGradeCompatibleImg from '../assets/images/regenerated_image_1793029416769.jpg';
import type { Coordinates } from '../lib/locationService';
import {
  getBrands,
  getModels,
  getServices,
  getIssues,
  getSubIssues,
  getIssueAnswers,
  getPartGrades,
  getRepairOption,
  createBooking,
  API_BASE_URL,
} from '../services/anyfixApi';
import { DeviceHeroVisual } from './booking/DeviceHeroVisual';
import { BookingFeatureCarousel } from './booking/BookingFeatureCarousel';

// =============================================================================
//                             PAGE 1 BRAND LOGO HELPER
// =============================================================================

/**
 * Returns the matching brand logo graphic for dynamic brands fetched from Google Sheet PRICE_LIST.
 */
const getBrandLogo = (brandName: string): string => {
  const normalized = brandName.trim().toLowerCase();
  if (normalized === 'apple') return appleLogoImg || '/booking/brands/apple-logo.svg';
  if (normalized === 'samsung') return samsungLogoImg || '/booking/brands/samsung-logo.svg';
  if (normalized === 'google') return googleLogoImg || '/booking/brands/google-logo.svg';
  if (normalized === 'motorola') return motorolaLogoImg || '/booking/brands/motorola-logo.svg';
  if (normalized === 'oppo') return '/booking/brands/oppo.webp';
  if (normalized === 'vivo') return '/booking/brands/vivo.webp';
  if (normalized === 'oneplus') return oneplusLogoImg || '/booking/brands/oneplus-logo.svg';
  if (normalized === 'nothing') return nothingLogoImg || '/booking/brands/nothing-logo.svg';
  if (normalized === 'xiaomi') return '/booking/brands/xiaomi.webp';
  if (normalized === 'realme') return '/booking/brands/realme.webp';
  return '';
};

// =============================================================================
//                             PAGE 2 SERVICE METADATA HELPER
// =============================================================================

interface ServiceMetadata {
  category: string;
  description: string;
  image: string;
  warranty?: string;
  repairTime?: string;
}

/**
 * Maps the live API service name from PRICE_LIST to appropriate category, description, graphic, warranty, and repair time.
 */
const getServiceMetadata = (serviceName: string): ServiceMetadata => {
  const lower = (serviceName || '').trim().toLowerCase();

  // 1. Screen Guard / Protector
  if (lower.includes('guard') || lower.includes('tempered') || lower.includes('protector')) {
    return {
      category: 'Screen',
      description: 'Premium shatter & scratch-resistant tempered glass screen protector.',
      image: '',
      warranty: 'Warranty Included',
      repairTime: '15–20 Mins',
    };
  }

  // 2. Display / Screen Replacement
  if (lower.includes('display') || (lower.includes('screen') && !lower.includes('guard'))) {
    return {
      category: 'Screen',
      description: 'Cracked, flickering, black spots or unresponsive touch display.',
      image: serviceDisplayImg,
      warranty: 'Warranty Included',
      repairTime: '30–45 Mins',
    };
  }

  // 3. Battery Replacement
  if (lower.includes('battery')) {
    return {
      category: 'Battery',
      description: 'Fast-draining, swollen, degraded or rapid-discharge battery.',
      image: serviceBatteryImg,
      warranty: 'Warranty Included',
      repairTime: '30–45 Mins',
    };
  }

  // 4. Back Glass / Rear Panel / Housing
  if (lower.includes('back') || lower.includes('rear') || lower.includes('housing') || lower.includes('panel')) {
    return {
      category: 'Body & Back',
      description: 'Broken, scratched or shattered rear back glass housing.',
      image: serviceBackGlassImg,
      warranty: 'Warranty Included',
      repairTime: '30–60 Mins',
    };
  }

  // 5. Charging Port
  if (lower.includes('charging') || lower.includes('port') || lower.includes('usb')) {
    return {
      category: 'Charging',
      description: 'Phone not charging, loose cable connection or port pin damage.',
      image: '',
      warranty: 'Warranty Included',
      repairTime: '30–45 Mins',
    };
  }

  // 6. Cameras / Camera Lens
  if (lower.includes('camera') || lower.includes('lens')) {
    return {
      category: 'Cameras',
      description: 'Blurry focus, cracked camera glass lens or blank viewfinder.',
      image: serviceCamerasImg,
      warranty: 'Warranty Included',
      repairTime: '30–45 Mins',
    };
  }

  // 7. Phone Start / Restart / Software Issues
  if (lower.includes('start') || lower.includes('restart') || lower.includes('boot') || lower.includes('software')) {
    return {
      category: 'Software',
      description: 'Stuck on boot logo, restart loops, system freezes or OS glitches.',
      image: serviceRestartIssuesImg,
      warranty: 'Warranty Included',
      repairTime: '30–60 Mins',
    };
  }

  // 8. Damaged Phone / Accidental Drop Diagnostics
  if (lower.includes('damaged phone') || (lower.includes('damage') && !lower.includes('water') && !lower.includes('liquid'))) {
    return {
      category: 'Damaged Phone',
      description: 'Severe impact drop, bent body chassis or multi-part inspection.',
      image: serviceDamagedPhoneImg,
      warranty: 'Warranty Included',
      repairTime: 'Varies',
    };
  }

  // 9. Water / Liquid Damage
  if (lower.includes('water') || lower.includes('liquid') || lower.includes('moisture') || lower.includes('submerged')) {
    return {
      category: 'Water Damage',
      description: 'Liquid ingress cleanup, corrosion treatment & motherboard restoration.',
      image: serviceWaterDamageImg,
      warranty: 'Warranty Included',
      repairTime: 'Varies',
    };
  }

  // 10. Speaker / Receiver
  if (lower.includes('speaker') || lower.includes('receiver') || lower.includes('earpiece') || lower.includes('sound')) {
    return {
      category: 'Audio',
      description: 'Low speaker volume, crackling noise or muffled call earpiece.',
      image: serviceSpeakerImg,
      warranty: 'Warranty Included',
      repairTime: '30–60 Mins',
    };
  }

  // 11. Microphone
  if (lower.includes('mic') || lower.includes('microphone')) {
    return {
      category: 'Audio',
      description: "Callers can't hear you clearly or voice audio sounds muffled.",
      image: serviceMicrophoneImg,
      warranty: 'Warranty Included',
      repairTime: '30–45 Mins',
    };
  }

  // 12. Connectivity / Wi-Fi / Bluetooth / Network
  if (lower.includes('connectivity') || lower.includes('wifi') || lower.includes('network') || lower.includes('signal') || lower.includes('bluetooth') || lower.includes('sim')) {
    return {
      category: 'Connectivity',
      description: 'Wi-Fi disconnects, cellular signal drops or Bluetooth pairing faults.',
      image: serviceConnectivityImg,
      warranty: 'Warranty Included',
      repairTime: '30–45 Mins',
    };
  }

  // 13. Buttons (Power, Volume, Mute, Action)
  if (lower.includes('button') || lower.includes('power') || lower.includes('volume') || lower.includes('key')) {
    return {
      category: 'Buttons',
      description: 'Stuck, jammed, unresponsive or sunken physical button keys.',
      image: serviceButtonsImg,
      warranty: 'Warranty Included',
      repairTime: '30–45 Mins',
    };
  }

  // 14. Proximity / Sensors
  if (lower.includes('proximity') || lower.includes('sensor') || lower.includes('face') || lower.includes('fingerprint')) {
    return {
      category: 'Other Issues',
      description: 'Display stays awake during calls, Face ID or sensor detection issue.',
      image: serviceProximityImg,
      warranty: 'Warranty Included',
      repairTime: '30–45 Mins',
    };
  }

  // 15. Haptics / Vibration Motor
  if (lower.includes('haptic') || lower.includes('vibrat')) {
    return {
      category: 'Audio',
      description: 'Silent vibration, erratic buzzing or defective haptic motor.',
      image: serviceHapticsImg,
      warranty: 'Warranty Included',
      repairTime: '30–45 Mins',
    };
  }

  // 16. Other Issues / General Diagnostic
  return {
    category: 'Other Issues',
    description: 'Comprehensive hardware diagnostic and repair for your phone issue.',
    image: serviceOtherIssuesImg,
    warranty: 'Warranty Included',
    repairTime: '30–45 Mins',
  };
};

/**
 * Returns a small category icon matching the design in the reference image.
 */
const renderCategoryIcon = (cat: string) => {
  const c = cat.toLowerCase();
  if (c === 'all') return null;
  if (c.includes('screen')) return <Smartphone className="w-3.5 h-3.5" />;
  if (c.includes('battery')) return <Battery className="w-3.5 h-3.5" />;
  if (c.includes('charging')) return <Zap className="w-3.5 h-3.5" />;
  if (c.includes('body') || c.includes('back')) return <Shield className="w-3.5 h-3.5" />;
  if (c.includes('camera')) return <Camera className="w-3.5 h-3.5" />;
  if (c.includes('audio')) return <Volume2 className="w-3.5 h-3.5" />;
  if (c.includes('connectivity')) return <Wifi className="w-3.5 h-3.5" />;
  if (c.includes('button')) return <Sliders className="w-3.5 h-3.5" />;
  if (c.includes('software')) return <Cog className="w-3.5 h-3.5" />;
  if (c.includes('damage') && !c.includes('water')) return <AlertTriangle className="w-3.5 h-3.5" />;
  if (c.includes('water')) return <Droplets className="w-3.5 h-3.5" />;
  return <Wrench className="w-3.5 h-3.5" />;
};

/**
 * Returns a vector icon component matching ANYFIX Royal Blue branding for services.
 */
const renderServiceIcon = (category: string, serviceName: string) => {
  const cat = (category || '').toLowerCase();
  const name = (serviceName || '').toLowerCase();

  let IconComp = Wrench;
  if (cat.includes('screen') || name.includes('screen') || name.includes('display') || name.includes('glass')) {
    IconComp = Smartphone;
  } else if (cat.includes('battery') || name.includes('battery')) {
    IconComp = Battery;
  } else if (cat.includes('camera') || name.includes('camera') || name.includes('lens')) {
    IconComp = Camera;
  } else if (cat.includes('charging') || name.includes('charging') || name.includes('port')) {
    IconComp = Zap;
  } else if (cat.includes('back') || cat.includes('body') || name.includes('back') || name.includes('housing')) {
    IconComp = Layers;
  } else if (cat.includes('audio') || cat.includes('speaker') || cat.includes('mic') || name.includes('sound')) {
    IconComp = Volume2;
  } else if (cat.includes('water') || name.includes('water') || name.includes('liquid')) {
    IconComp = Droplets;
  } else if (cat.includes('software') || name.includes('software') || name.includes('boot')) {
    IconComp = Cpu;
  } else if (cat.includes('button') || name.includes('button') || name.includes('power') || name.includes('volume')) {
    IconComp = Sliders;
  }

  return (
    <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-blue-100 flex items-center justify-center shrink-0 text-[#1D4ED8] group-hover:bg-[#1D4ED8] group-hover:text-white transition-all duration-200 shadow-2xs">
      <IconComp className="w-6 h-6 stroke-[1.9]" />
    </div>
  );
};

const CATEGORY_FILTERS = [
  'All',
  'Screen',
  'Battery',
  'Charging',
  'Body & Back',
  'Cameras',
  'Audio',
  'Connectivity',
  'Buttons',
  'Software',
  'Damaged Phone',
  'Water Damage',
  'Other Issues',
];

// =============================================================================
//                             PAGE 3 REPAIR OPTION HELPERS
// =============================================================================

export interface CartItem {
  id: string;
  service: string;
  issue: string;
  subIssue: string;
  issueAnswer: string;
  brand: string;
  model: string;
  partGrade?: string;
  price?: number | string;
  warranty?: string;
  repairTime?: string;
  bookingFee?: number | string;
  question?: string;
  selectedAnswer?: string;
}

export interface RepairOption {
  brand?: string;
  model?: string;
  service?: string;
  issue?: string;
  subIssue?: string;
  issueAnswer?: string;
  partGrade: string;
  price: number | string;
  warranty?: string;
  repairTime?: string;
  bookingFee?: number | string;
}

export interface PartGradeItem {
  id: string;
  name: string;
  price: string;
  warranty: string;
  repairTime: string;
  bookingFee?: string;
  image: string;
}

/**
 * Format raw API numeric prices into Indian Rupees standard display (e.g. 19800 -> ₹19,800).
 */
export const formatPrice = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '';
  const num = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return String(val);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Returns matching visual graphic for part grade options.
 */
const getPartGradeImage = (partGrade: string): string => {
  const lower = (partGrade || '').toLowerCase();
  if (lower.includes('oem') || lower.includes('original')) {
    return partGradeOemImg;
  }
  return partGradeCompatibleImg;
};

/**
 * Splits a dynamic string from PRICE_LIST with format "Question = Answer".
 * - Text before "=" is Question
 * - Text after "=" is Answer
 * If no "=" is present:
 * - Question is empty string
 * - Answer is the original string
 */
export const parseQuestionAnswer = (
  rawText: string
): { question: string; answer: string; raw: string } => {
  const str = String(rawText || '').trim();
  const eqIdx = str.indexOf('=');
  if (eqIdx !== -1) {
    const q = str.substring(0, eqIdx).trim();
    const a = str.substring(eqIdx + 1).trim();
    return {
      question: q,
      answer: a || str,
      raw: str,
    };
  }
  return {
    question: '',
    answer: str,
    raw: str,
  };
};

export interface QuestionGroup {
  question: string;
  items: { raw: string; answer: string }[];
}

/**
 * Groups dynamic options by their parsed question heading.
 * If multiple answers share the same question, they appear under that question.
 */
export const groupOptionsByQuestion = (
  rawItems: string[],
  defaultQuestion: string = ''
): QuestionGroup[] => {
  const groupsMap = new Map<string, { raw: string; answer: string }[]>();

  for (const item of rawItems) {
    if (!item) continue;
    const { question, answer, raw } = parseQuestionAnswer(item);
    const qKey = question || defaultQuestion;
    if (!groupsMap.has(qKey)) {
      groupsMap.set(qKey, []);
    }
    groupsMap.get(qKey)!.push({ raw, answer });
  }

  const result: QuestionGroup[] = [];
  groupsMap.forEach((items, question) => {
    result.push({ question, items });
  });
  return result;
};

// =============================================================================
//                             PAGE 4 TIME SLOTS DATA
// =============================================================================

const TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:00 PM - 03:00 PM',
  '03:00 PM - 05:00 PM',
  '05:00 PM - 07:00 PM',
];

export interface BookingFormProps {
  onSuccess?: (bookingSummary?: unknown) => void;
  onTrackRepair?: (bookingId: string) => void;
  onOpenSettings?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSuccess,
  onTrackRepair,
  onOpenSettings,
}) => {
  // Navigation Flow State (1: Device, 2: Service, 3: Part Grade, 4: Details)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Page 1 Live API State (PRICE_LIST as single source of truth)
  const [brands, setBrands] = useState<string[]>([]);
  const [isBrandsLoading, setIsBrandsLoading] = useState<boolean>(true);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [models, setModels] = useState<string[]>([]);
  const [isModelsLoading, setIsModelsLoading] = useState<boolean>(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [brandSearchQuery, setBrandSearchQuery] = useState<string>('');

  // Page 2 State (Live API Services from PRICE_LIST)
  const [services, setServices] = useState<string[]>([]);
  const [isServicesLoading, setIsServicesLoading] = useState<boolean>(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [serviceSearchQuery, setServiceSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [step2Completed, setStep2Completed] = useState<boolean>(false);

  // Multi-Service Repair Cart State
  const [repairCart, setRepairCart] = useState<CartItem[]>([]);
  const [activeQuestionService, setActiveQuestionService] = useState<string | null>(null);
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState<string>('');
  const [cartPartGrades, setCartPartGrades] = useState<Record<string, RepairOption[]>>({});
  const [isCartPartGradesLoading, setIsCartPartGradesLoading] = useState<boolean>(false);
  const [selectedCartPartGrades, setSelectedCartPartGrades] = useState<Record<string, RepairOption>>({});

  // Dynamic Diagnostic Modal State (PRICE_LIST: Issue -> Sub Issue -> Issue Answer)
  const [modalIssues, setModalIssues] = useState<string[]>([]);
  const [isModalIssuesLoading, setIsModalIssuesLoading] = useState<boolean>(false);
  const [modalIssuesError, setModalIssuesError] = useState<string | null>(null);
  const [selectedModalIssue, setSelectedModalIssue] = useState<string>('');

  const [modalSubIssues, setModalSubIssues] = useState<string[]>([]);
  const [modalSubIssueQuestion, setModalSubIssueQuestion] = useState<string>('');
  const [isModalSubIssuesLoading, setIsModalSubIssuesLoading] = useState<boolean>(false);
  const [modalSubIssuesError, setModalSubIssuesError] = useState<string | null>(null);
  const [selectedModalSubIssue, setSelectedModalSubIssue] = useState<string>('');
  const [isSubIssueModalOpen, setIsSubIssueModalOpen] = useState<boolean>(false);

  const [modalIssueAnswers, setModalIssueAnswers] = useState<string[]>([]);
  const [modalIssueAnswerQuestion, setModalIssueAnswerQuestion] = useState<string>('');
  const [isModalIssueAnswersLoading, setIsModalIssueAnswersLoading] = useState<boolean>(false);
  const [modalIssueAnswersError, setModalIssueAnswersError] = useState<string | null>(null);
  const [selectedModalIssueAnswer, setSelectedModalIssueAnswer] = useState<string>('');

  // Page 3 State (Live API Part Grades from PRICE_LIST)
  const [partGrades, setPartGrades] = useState<RepairOption[]>([]);
  const [isPartGradesLoading, setIsPartGradesLoading] = useState<boolean>(false);
  const [partGradesError, setPartGradesError] = useState<string | null>(null);
  const [selectedRepairOption, setSelectedRepairOption] = useState<RepairOption | null>(null);
  const [step3Completed, setStep3Completed] = useState<boolean>(false);

  // Page 4 State (Customer Details)
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM - 01:00 PM');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [locationError, setLocationError] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationDetected, setLocationDetected] = useState<boolean>(false);
  const [detectedCoords, setDetectedCoords] = useState<Coordinates | null>(null);

  // Real Booking Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingId: string;
    brand: string;
    model: string;
    service: string;
    partGrade: string;
    price?: number | string;
    warranty?: string;
    repairTime?: string;
    bookingFee?: number | string;
    preferredDate: string;
    preferredTime: string;
    customerName: string;
    phone: string;
    address: string;
    status: string;
    cartItems?: CartItem[];
  } | null>(null);

  // Calculate minimum selectable date (today)
  const todayISO = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // ---------------------------------------------------------------------------
  // LIVE API: Fetch Brands from Google Sheet PRICE_LIST on page load
  // ---------------------------------------------------------------------------
  const fetchBrands = useCallback(async () => {
    setIsBrandsLoading(true);
    setBrandsError(null);
    try {
      console.log('[ANYFIX API] Fetching active brands from PRICE_LIST...');
      const response = await getBrands();
      console.log('[ANYFIX API] getBrands raw response:', response);

      // 3. API response is parsed
      let parsedBrands: string[] = [];
      const isSuccess = Boolean(response && response.success);

      if (isSuccess && response) {
        const raw = response.data !== undefined ? response.data : (response as any).brands;
        if (Array.isArray(raw)) {
          parsedBrands = raw
            .map((item: any) => {
              if (typeof item === 'string') return item.trim();
              if (item && typeof item === 'object') {
                return String(item.brand || item.Brand || item.name || '').trim();
              }
              return String(item || '').trim();
            })
            .filter((b: string) => Boolean(b) && b !== '[object Object]');
        } else if (raw && typeof raw === 'object' && Array.isArray((raw as any).brands)) {
          parsedBrands = (raw as any).brands
            .map((b: any) => String(b || '').trim())
            .filter((b: string) => Boolean(b) && b !== '[object Object]');
        }
      }

      // 4. success === true → populate the existing Brand selector
      if (isSuccess && parsedBrands.length > 0) {
        console.log('[ANYFIX API] Brands received:', parsedBrands);
        setBrands(parsedBrands);
        setBrandsError(null);
      } else {
        // 5. success === false → show the existing error state
        const errorMsg =
          !isSuccess
            ? (response?.message || 'Failed to fetch brands from server.')
            : 'No brands found in Google Sheet PRICE_LIST.';
        console.warn('[ANYFIX API] Brand loading failed or returned 0 brands:', errorMsg);
        setBrands([]);
        setBrandsError(errorMsg);
      }
    } catch (err: any) {
      console.error('[ANYFIX API ERROR] Failed to load brands:', err);
      setBrands([]);
      setBrandsError(err?.message || 'Unable to load brands. Please check your connection and try again.');
    } finally {
      setIsBrandsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // ---------------------------------------------------------------------------
  // LIVE API: Fetch Services from Google Sheet PRICE_LIST for Brand + Model
  // ---------------------------------------------------------------------------
  const fetchServicesForDevice = useCallback(async (brand: string, model: string) => {
    if (!brand || !model) {
      setServices([]);
      return;
    }

    setIsServicesLoading(true);
    setServicesError(null);
    try {
      console.log(`[ANYFIX API] Fetching services for ${brand} ${model} from PRICE_LIST...`);
      const response = await getServices(brand, model);
      if (response && response.success && Array.isArray(response.data)) {
        console.log(`[ANYFIX API] Services for ${brand} ${model} received:`, response.data);
        setServices(response.data);
      } else {
        throw new Error(response?.message || `Failed to fetch services for ${brand} ${model}.`);
      }
    } catch (err: any) {
      console.error(`[ANYFIX API ERROR] Failed to load services:`, err);
      setServicesError(err?.message || 'Unable to load services for this device. Please try again.');
    } finally {
      setIsServicesLoading(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // LIVE API: Fetch Part Grades from Google Sheet PRICE_LIST for Brand + Model + Service
  // ---------------------------------------------------------------------------
  const fetchPartGradesForDeviceService = useCallback(
    async (brand: string, model: string, service: string) => {
      if (!brand || !model || !service) {
        setPartGrades([]);
        return;
      }

      setIsPartGradesLoading(true);
      setPartGradesError(null);
      try {
        console.log(
          `[ANYFIX API] Fetching part grades for ${brand} ${model} -> ${service} from PRICE_LIST...`
        );
        const response = await getPartGrades(brand, model, service);
        if (response && response.success && Array.isArray(response.data)) {
          console.log(
            `[ANYFIX API] Part grades for ${brand} ${model} -> ${service} received:`,
            response.data
          );
          setPartGrades(response.data);
        } else {
          throw new Error(
            response?.message || `Failed to fetch repair options for ${service}.`
          );
        }
      } catch (err: any) {
        console.error(`[ANYFIX API ERROR] Failed to load part grades:`, err);
        setPartGradesError(
          err?.message ||
            'Unable to load repair options for this service. Please try again.'
        );
      } finally {
        setIsPartGradesLoading(false);
      }
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Page 1 Handlers (Dynamic Brands & Models)
  // ---------------------------------------------------------------------------
  const handleSelectBrand = async (brand: string) => {
    if (selectedBrand === brand) return;

    setSelectedBrand(brand);
    // 1. Clear previously selected model
    setSelectedSeries('');
    // 2. Clear selected Service, Part Grade and repair details
    setSelectedServiceId('');
    setSelectedRepairOption(null);
    setPartGrades([]);
    setPartGradesError(null);
    setStep2Completed(false);
    setStep3Completed(false);
    setServices([]);
    setServicesError(null);
    setModels([]);
    setModelsError(null);

    // 3. Reset all multi-service cart and diagnostic states
    setRepairCart([]);
    setCartPartGrades({});
    setSelectedCartPartGrades({});
    setActiveQuestionService(null);
    setCurrentQuestionAnswer('');
    setSelectedModalIssue('');
    setModalIssues([]);
    setModalIssuesError(null);
    setSelectedModalSubIssue('');
    setIsSubIssueModalOpen(false);
    setModalSubIssues([]);
    setModalSubIssuesError(null);
    setSelectedModalIssueAnswer('');
    setModalIssueAnswers([]);
    setModalIssueAnswersError(null);

    // 4. Fetch models again for the newly selected brand
    setIsModelsLoading(true);
    try {
      console.log(`[ANYFIX API] Fetching models for ${brand} from PRICE_LIST...`);
      const response = await getModels(brand);
      if (response && response.success && Array.isArray(response.data)) {
        console.log(`[ANYFIX API] Models for ${brand} received:`, response.data);
        setModels(response.data);
      } else {
        throw new Error(response?.message || `Failed to fetch models for ${brand}.`);
      }
    } catch (err: any) {
      console.error(`[ANYFIX API ERROR] Failed to load models for ${brand}:`, err);
      setModelsError(err?.message || `Unable to load models for ${brand}. Please try again.`);
    } finally {
      setIsModelsLoading(false);
    }
  };

  const handleRetryFetchModels = () => {
    if (selectedBrand) {
      const b = selectedBrand;
      setSelectedBrand('');
      setTimeout(() => handleSelectBrand(b), 10);
    }
  };

  const handleSelectSeries = (series: string) => {
    setSelectedSeries(series);
    // Clear selected Service, Cart, Part Grade and repair details
    setSelectedServiceId('');
    setRepairCart([]);
    setActiveQuestionService(null);
    setCurrentQuestionAnswer('');
    setSelectedModalIssue('');
    setModalIssues([]);
    setModalIssuesError(null);
    setSelectedModalSubIssue('');
    setIsSubIssueModalOpen(false);
    setModalSubIssues([]);
    setModalSubIssuesError(null);
    setSelectedModalIssueAnswer('');
    setModalIssueAnswers([]);
    setModalIssueAnswersError(null);
    setCartPartGrades({});
    setSelectedCartPartGrades({});
    setSelectedRepairOption(null);
    setPartGrades([]);
    setPartGradesError(null);
    setStep2Completed(false);
    setStep3Completed(false);

    // Fetch services again for the newly selected model
    fetchServicesForDevice(selectedBrand, series);
  };

  const handleContinueFromStep1 = () => {
    if (!selectedBrand || !selectedSeries) return;
    if (services.length === 0 && !isServicesLoading && !servicesError) {
      fetchServicesForDevice(selectedBrand, selectedSeries);
    }
    setCurrentStep(2);
    setStep2Completed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredSeriesList = useMemo(() => {
    const q = brandSearchQuery.trim().toLowerCase();
    if (!q) return models;
    return models.filter((s) => s.toLowerCase().includes(q));
  }, [models, brandSearchQuery]);

  const filteredBrandsList = useMemo(() => {
    const q = brandSearchQuery.trim().toLowerCase();
    if (!q) return brands;
    const hasBrandMatch = brands.some((b) => b.toLowerCase().includes(q));
    if (hasBrandMatch) {
      return brands.filter((b) => b.toLowerCase().includes(q));
    }
    return brands;
  }, [brands, brandSearchQuery]);

  const isStep1ContinueEnabled = Boolean(selectedBrand && selectedSeries);

  // ---------------------------------------------------------------------------
  // Page 2 Dynamic Diagnostic Handlers (Issue -> Sub Issue -> Issue Answer)
  // ---------------------------------------------------------------------------

  // Fetch Part Grades for a Cart Item with its complete hierarchy
  const fetchPartGradesForCartItem = useCallback(
    async (item: CartItem) => {
      const { brand, model, service, issue, subIssue, issueAnswer } = item;
      if (!brand || !model || !service) return;
      try {
        setIsCartPartGradesLoading(true);
        console.log(`[ANYFIX API] Fetching part grades for ${brand} ${model} -> ${service} with hierarchy:`, {
          issue,
          subIssue,
          issueAnswer,
        });
        const response = await getPartGrades(brand, model, service, issue, subIssue, issueAnswer);
        if (response && response.success && Array.isArray(response.data)) {
          setCartPartGrades((prev) => ({
            ...prev,
            [service]: response.data,
          }));

          if (response.data.length > 0) {
            const firstOption = response.data[0];
            setSelectedCartPartGrades((prev) => {
              const current = prev[service];
              const stillValid = current && response.data.some((o: any) => o.partGrade === current.partGrade);
              return {
                ...prev,
                [service]: stillValid ? current : firstOption,
              };
            });

            // Single service compatibility
            setPartGrades(response.data);
            setSelectedRepairOption(firstOption);

            // Fetch exact repair option row to guarantee full fields
            try {
              const exactRes = await getRepairOption(
                brand,
                model,
                service,
                firstOption.partGrade,
                issue,
                subIssue,
                issueAnswer
              );
              if (exactRes && exactRes.success && exactRes.data) {
                setSelectedCartPartGrades((prev) => ({
                  ...prev,
                  [service]: exactRes.data,
                }));
                setSelectedRepairOption(exactRes.data);
              }
            } catch (err) {
              console.error(`[ANYFIX API] getRepairOption failed for ${service}:`, err);
            }
          }
        }
      } catch (err) {
        console.error(`[ANYFIX API ERROR] Failed to load part grades for ${service}:`, err);
      } finally {
        setIsCartPartGradesLoading(false);
      }
    },
    []
  );

  // 1. Fetch Issues for Brand + Model + Service
  const fetchIssuesForService = useCallback(
    async (
      brand: string,
      model: string,
      service: string,
      prefillIssue?: string,
      prefillSubIssue?: string,
      prefillAnswer?: string
    ) => {
      if (!brand || !model || !service) return;
      setIsModalIssuesLoading(true);
      setModalIssuesError(null);
      try {
        console.log(`[ANYFIX API] Fetching issues for ${brand} ${model} -> ${service}...`);
        const res = await getIssues(brand, model, service);
        if (res && res.success && Array.isArray(res.data)) {
          setModalIssues(res.data);
          if (prefillIssue && res.data.includes(prefillIssue)) {
            setSelectedModalIssue(prefillIssue);
            fetchSubIssuesForIssue(brand, model, service, prefillIssue, prefillSubIssue, prefillAnswer);
          } else if (res.data.length === 1) {
            const singleIssue = res.data[0];
            setSelectedModalIssue(singleIssue);
            fetchSubIssuesForIssue(brand, model, service, singleIssue, prefillSubIssue, prefillAnswer);
          }
        } else {
          throw new Error(res?.message || 'Failed to fetch issues.');
        }
      } catch (err: any) {
        console.error('[ANYFIX API ERROR] getIssues failed:', err);
        setModalIssuesError(err?.message || 'Unable to load issues. Please try again.');
        setModalIssues([]);
      } finally {
        setIsModalIssuesLoading(false);
      }
    },
    []
  );

  // 2. Fetch Sub Issues for Brand + Model + Service + Issue
  const fetchSubIssuesForIssue = useCallback(
    async (
      brand: string,
      model: string,
      service: string,
      issue: string,
      prefillSubIssue?: string,
      prefillAnswer?: string
    ) => {
      if (!brand || !model || !service || !issue) return;
      setIsModalSubIssuesLoading(true);
      setModalSubIssuesError(null);
      try {
        console.log(`[ANYFIX API] Fetching sub-issues for ${brand} ${model} -> ${service} -> ${issue}...`);
        const res = await getSubIssues(brand, model, service, issue);
        if (res && res.success && Array.isArray(res.data)) {
          const cleanList = res.data.filter(Boolean);
          setModalSubIssues(cleanList);
          if (cleanList.length > 0) {
            // Automatically open centered Sub Issue popup
            setIsSubIssueModalOpen(true);
            if (prefillSubIssue && cleanList.includes(prefillSubIssue)) {
              setSelectedModalSubIssue(prefillSubIssue);
              fetchIssueAnswersForSubIssue(brand, model, service, issue, prefillSubIssue, prefillAnswer);
            }
          } else {
            // No sub issue exists: do NOT open empty popup, continue to Issue Answer
            setIsSubIssueModalOpen(false);
            setSelectedModalSubIssue('');
            fetchIssueAnswersForSubIssue(brand, model, service, issue, '', prefillAnswer);
          }
        } else {
          throw new Error(res?.message || 'Failed to fetch sub-issues.');
        }
      } catch (err: any) {
        console.error('[ANYFIX API ERROR] getSubIssues failed:', err);
        setModalSubIssuesError(err?.message || 'Unable to load sub-issues.');
        setModalSubIssues([]);
        setIsSubIssueModalOpen(false);
      } finally {
        setIsModalSubIssuesLoading(false);
      }
    },
    []
  );

  // 3. Fetch Issue Answers for Brand + Model + Service + Issue + SubIssue
  const fetchIssueAnswersForSubIssue = useCallback(
    async (
      brand: string,
      model: string,
      service: string,
      issue: string,
      subIssue: string,
      prefillAnswer?: string
    ) => {
      if (!brand || !model || !service || !issue) return;
      setIsModalIssueAnswersLoading(true);
      setModalIssueAnswersError(null);
      try {
        console.log(
          `[ANYFIX API] Fetching answers for ${brand} ${model} -> ${service} -> ${issue} -> ${subIssue}...`
        );
        const res = await getIssueAnswers(brand, model, service, issue, subIssue);
        if (res && res.success && Array.isArray(res.data)) {
          const cleanList = res.data.filter(Boolean);
          setModalIssueAnswers(cleanList);
          if (prefillAnswer && cleanList.includes(prefillAnswer)) {
            setSelectedModalIssueAnswer(prefillAnswer);
          } else if (cleanList.length === 1) {
            setSelectedModalIssueAnswer(cleanList[0]);
          } else if (cleanList.length === 0) {
            setSelectedModalIssueAnswer('');
          }
        } else {
          throw new Error(res?.message || 'Failed to fetch answers.');
        }
      } catch (err: any) {
        console.error('[ANYFIX API ERROR] getIssueAnswers failed:', err);
        setModalIssueAnswersError(err?.message || 'Unable to load answers.');
        setModalIssueAnswers([]);
      } finally {
        setIsModalIssueAnswersLoading(false);
      }
    },
    []
  );

  // Modal Level Selection Handlers (with strict cascading reset)
  const handleSelectModalIssue = (issue: string) => {
    if (selectedModalIssue === issue) {
      if (modalSubIssues.length > 0) {
        setIsSubIssueModalOpen(true);
      }
      return;
    }
    setSelectedModalIssue(issue);
    setSelectedModalSubIssue('');
    setModalSubIssues([]);
    setModalSubIssuesError(null);
    setSelectedModalIssueAnswer('');
    setModalIssueAnswers([]);
    setModalIssueAnswersError(null);

    if (activeQuestionService) {
      fetchSubIssuesForIssue(selectedBrand, selectedSeries, activeQuestionService, issue);
    }
  };

  const handleSelectModalSubIssue = (subIssue: string) => {
    setSelectedModalSubIssue(subIssue);
    setSelectedModalIssueAnswer('');
    setModalIssueAnswers([]);
    setModalIssueAnswersError(null);

    // Close the popup after selection so user sees blue selected state
    setTimeout(() => {
      setIsSubIssueModalOpen(false);
    }, 150);

    if (activeQuestionService && selectedModalIssue) {
      fetchIssueAnswersForSubIssue(
        selectedBrand,
        selectedSeries,
        activeQuestionService,
        selectedModalIssue,
        subIssue
      );
    }
  };

  const handleSelectModalIssueAnswer = (answer: string) => {
    setSelectedModalIssueAnswer(answer);
  };

  // Open modal for a service (new or edit existing)
  const handleOpenServiceQuestion = (serviceName: string) => {
    const existing = repairCart.find((item) => item.service === serviceName);
    setActiveQuestionService(serviceName);

    setModalIssues([]);
    setModalIssuesError(null);
    setSelectedModalIssue('');
    setModalSubIssues([]);
    setModalSubIssuesError(null);
    setSelectedModalSubIssue('');
    setIsSubIssueModalOpen(false);
    setModalIssueAnswers([]);
    setModalIssueAnswersError(null);
    setSelectedModalIssueAnswer('');

    if (existing) {
      setSelectedModalIssue(existing.issue || '');
      setSelectedModalSubIssue(existing.subIssue || '');
      setSelectedModalIssueAnswer(existing.issueAnswer || '');
      fetchIssuesForService(
        selectedBrand,
        selectedSeries,
        serviceName,
        existing.issue,
        existing.subIssue,
        existing.issueAnswer
      );
    } else {
      fetchIssuesForService(selectedBrand, selectedSeries, serviceName);
    }
  };

  // Check if all active levels are answered
  const canAddServiceToCart = useMemo(() => {
    if (!activeQuestionService || isModalIssuesLoading || isModalSubIssuesLoading || isModalIssueAnswersLoading) {
      return false;
    }
    if (modalIssues.length > 0 && !selectedModalIssue) {
      return false;
    }
    if (modalSubIssues.length > 0 && !selectedModalSubIssue) {
      return false;
    }
    if (modalIssueAnswers.length > 0 && !selectedModalIssueAnswer) {
      return false;
    }
    if (modalIssues.length === 0 && !isModalIssuesLoading) {
      return false;
    }
    return true;
  }, [
    activeQuestionService,
    modalIssues,
    selectedModalIssue,
    modalSubIssues,
    selectedModalSubIssue,
    modalIssueAnswers,
    selectedModalIssueAnswer,
    isModalIssuesLoading,
    isModalSubIssuesLoading,
    isModalIssueAnswersLoading,
  ]);

  const handleSaveServiceToCart = () => {
    if (!activeQuestionService || !canAddServiceToCart) return;

    const cleanSubIssue = parseQuestionAnswer(selectedModalSubIssue).answer;
    const cleanIssueAnswer = parseQuestionAnswer(selectedModalIssueAnswer).answer;
    const formattedAnswer = [selectedModalIssue, cleanSubIssue, cleanIssueAnswer]
      .filter(Boolean)
      .join(' → ');

    const newCartItem: CartItem = {
      id: activeQuestionService,
      service: activeQuestionService,
      brand: selectedBrand,
      model: selectedSeries,
      issue: selectedModalIssue,
      subIssue: selectedModalSubIssue,
      issueAnswer: selectedModalIssueAnswer,
      question: selectedModalIssue,
      selectedAnswer: formattedAnswer,
    };

    setRepairCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.service === activeQuestionService);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newCartItem;
        return updated;
      }
      return [...prev, newCartItem];
    });

    // Reset old part grades cache for this service and fetch with the new hierarchy!
    setCartPartGrades((prev) => {
      const next = { ...prev };
      delete next[activeQuestionService];
      return next;
    });
    setSelectedCartPartGrades((prev) => {
      const next = { ...prev };
      delete next[activeQuestionService];
      return next;
    });

    fetchPartGradesForCartItem(newCartItem);
    setSelectedServiceId(activeQuestionService);

    setIsSubIssueModalOpen(false);
    setActiveQuestionService(null);
  };

  const handleRemoveFromCart = (serviceName: string) => {
    setRepairCart((prev) => prev.filter((item) => item.service !== serviceName));
    setSelectedCartPartGrades((prev) => {
      const next = { ...prev };
      delete next[serviceName];
      return next;
    });
    setCartPartGrades((prev) => {
      const next = { ...prev };
      delete next[serviceName];
      return next;
    });
    if (selectedServiceId === serviceName) {
      setSelectedServiceId('');
    }
    if (activeQuestionService === serviceName) {
      setIsSubIssueModalOpen(false);
      setActiveQuestionService(null);
    }
  };

  const handleContinueFromStep2 = () => {
    if (repairCart.length === 0) return;

    // Trigger part grades fetch for all cart items
    repairCart.forEach((item) => {
      if (!cartPartGrades[item.service] || cartPartGrades[item.service].length === 0) {
        fetchPartGradesForCartItem(item);
      }
    });

    if (repairCart.length > 0) {
      setSelectedServiceId(repairCart[0].service);
    }

    setCurrentStep(3);
    setStep3Completed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredServices = useMemo(() => {
    const q = serviceSearchQuery.trim().toLowerCase();
    return services.filter((serviceName) => {
      const meta = getServiceMetadata(serviceName);
      const matchesCategory =
        selectedCategory === 'All' ||
        meta.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !q ||
        serviceName.toLowerCase().includes(q) ||
        meta.description.toLowerCase().includes(q) ||
        meta.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [services, serviceSearchQuery, selectedCategory]);

  const selectedServiceObj = useMemo(() => {
    const primaryId = selectedServiceId || (repairCart[0]?.service ?? '');
    if (!primaryId) return null;
    const meta = getServiceMetadata(primaryId);
    return {
      id: primaryId,
      name: primaryId,
      category: meta.category,
      description: meta.description,
      image: meta.image,
    };
  }, [selectedServiceId, repairCart]);

  const totalCartPrice = useMemo(() => {
    if (repairCart.length === 0) return 0;
    return repairCart.reduce((sum, item) => {
      const selectedOption = selectedCartPartGrades[item.service];
      if (selectedOption?.price !== undefined) {
        const num =
          typeof selectedOption.price === 'number'
            ? selectedOption.price
            : Number(String(selectedOption.price).replace(/[^0-9.-]+/g, '')) || 0;
        return sum + num;
      }
      return sum;
    }, 0);
  }, [repairCart, selectedCartPartGrades]);

  // ---------------------------------------------------------------------------
  // Page 3 Handlers (Live Part Grades from PRICE_LIST)
  // ---------------------------------------------------------------------------
  const handleSelectPartGrade = async (option: RepairOption) => {
    setSelectedRepairOption(option);
    const primaryService = selectedServiceId || (repairCart[0]?.service ?? '');
    const cartItem = repairCart.find((i) => i.service === primaryService);
    if (primaryService) {
      setSelectedCartPartGrades((prev) => ({
        ...prev,
        [primaryService]: option,
      }));
    }
    setStep3Completed(false);

    if (cartItem) {
      try {
        const exact = await getRepairOption(
          selectedBrand,
          selectedSeries,
          cartItem.service,
          option.partGrade,
          cartItem.issue,
          cartItem.subIssue,
          cartItem.issueAnswer
        );
        if (exact && exact.success && exact.data) {
          setSelectedRepairOption(exact.data);
          setSelectedCartPartGrades((prev) => ({
            ...prev,
            [cartItem.service]: exact.data,
          }));
        }
      } catch (err) {
        console.error('[ANYFIX API] getRepairOption failed:', err);
      }
    }
  };

  const handleSelectCartPartGrade = async (serviceName: string, option: RepairOption) => {
    const cartItem = repairCart.find((i) => i.service === serviceName);
    setSelectedCartPartGrades((prev) => ({
      ...prev,
      [serviceName]: option,
    }));
    if (serviceName === selectedServiceId || repairCart.length === 1) {
      setSelectedRepairOption(option);
    }
    setStep3Completed(false);

    if (cartItem) {
      try {
        const exact = await getRepairOption(
          selectedBrand,
          selectedSeries,
          serviceName,
          option.partGrade,
          cartItem.issue,
          cartItem.subIssue,
          cartItem.issueAnswer
        );
        if (exact && exact.success && exact.data) {
          setSelectedCartPartGrades((prev) => ({
            ...prev,
            [serviceName]: exact.data,
          }));
          if (serviceName === selectedServiceId || repairCart.length === 1) {
            setSelectedRepairOption(exact.data);
          }
        }
      } catch (err) {
        console.error('[ANYFIX API] getRepairOption failed for cart item:', err);
      }
    }
  };

  const selectedPartGradeId = selectedRepairOption?.partGrade || '';

  const selectedPartGradeObj = useMemo(() => {
    if (!selectedRepairOption) return null;
    return {
      id: selectedRepairOption.partGrade,
      name: selectedRepairOption.partGrade,
      price: formatPrice(selectedRepairOption.price),
      warranty: selectedRepairOption.warranty,
      repairTime: selectedRepairOption.repairTime,
      bookingFee: selectedRepairOption.bookingFee ? String(selectedRepairOption.bookingFee) : undefined,
      image: getPartGradeImage(selectedRepairOption.partGrade),
    };
  }, [selectedRepairOption]);

  const isStep3ContinueEnabled = useMemo(() => {
    if (repairCart.length > 0) {
      return repairCart.every((item) => selectedCartPartGrades[item.service] !== undefined);
    }
    return Boolean(selectedRepairOption);
  }, [repairCart, selectedCartPartGrades, selectedRepairOption]);

  const handleContinueFromStep3 = () => {
    if (!isStep3ContinueEnabled) return;
    if (repairCart.length > 0 && !selectedRepairOption && repairCart[0]) {
      setSelectedRepairOption(selectedCartPartGrades[repairCart[0].service] || null);
    }
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------------------------------------------------------------------------
  // Page 4 Handlers & Validation
  // ---------------------------------------------------------------------------
  // Indian mobile validation: exactly 10 digits
  const cleanMobile = mobileNumber.replace(/\D/g, '');
  const isMobileValid = cleanMobile.length === 10;

  // Validation: Full Name, 10-digit mobile, Doorstep address, Preferred date, Time slot
  const isStep4ContinueEnabled = Boolean(
    fullName.trim() &&
      isMobileValid &&
      address.trim() &&
      preferredDate &&
      selectedTimeSlot
  );

  // Real Geolocation click handler directly invoking browser Geolocation API
  const handleUseCurrentLocation = () => {
    console.log('BUTTON CLICKED');

    if (isDetectingLocation) {
      console.log('GEOLOCATION REQUEST IGNORED: Already detecting location');
      return;
    }

    setLocationError('');
    setLocationStatus('');

    // 3. Before calling geolocation, verify navigator.geolocation is available
    if (!navigator.geolocation) {
      const msg = 'Location services are not available in this browser.';
      console.log('GEOLOCATION ERROR:', msg);
      setLocationError(msg);
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus('Requesting location permission...');
    console.log('GEOLOCATION REQUEST STARTED');

    // 1 & 5. Directly call navigator.geolocation.getCurrentPosition() with options
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingLocation(false);
        const { latitude, longitude, accuracy } = position.coords;
        console.log('GEOLOCATION SUCCESS:', {
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp,
        });

        setDetectedCoords({ latitude, longitude });
        setLocationDetected(true);
        setLocationError('');
        setLocationStatus('Location detected successfully.');
      },
      (error) => {
        setIsDetectingLocation(false);
        console.log('GEOLOCATION ERROR:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT,
        });

        let errorMsg = 'Unable to determine your location. Please try again.';

        // 7. Handle errors separately:
        if (error.code === 1) {
          errorMsg = 'Location permission was denied. Please allow location access and try again.';
        } else if (error.code === 2) {
          errorMsg = 'Unable to determine your location. Please try again.';
        } else if (error.code === 3) {
          errorMsg = 'Location request timed out. Please try again.';
        }

        setLocationError(errorMsg);
        setLocationStatus('');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmitBooking = async () => {
    if (!isStep4ContinueEnabled || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Multi-service cart summaries
    const servicesTitle =
      repairCart.length > 0
        ? repairCart.map((c) => c.service).join(' + ')
        : selectedServiceId;

    const partGradesTitle =
      repairCart.length > 0
        ? repairCart
            .map((c) => {
              const pg =
                selectedCartPartGrades[c.service]?.partGrade ||
                selectedRepairOption?.partGrade ||
                'Standard';
              return `${c.service}: ${pg}`;
            })
            .join(', ')
        : selectedRepairOption?.partGrade || '';

    const issuesDetailedNotes =
      repairCart.length > 0
        ? repairCart.map((c) => `[${c.service}: ${c.selectedAnswer}]`).join(' | ')
        : '';

    const combinedNotes = [issuesDetailedNotes, additionalNotes.trim()]
      .filter(Boolean)
      .join('\nNotes: ');

    const finalPrice = totalCartPrice > 0 ? totalCartPrice : (selectedRepairOption?.price ?? 0);

    const primaryCart = repairCart[0];
    const primaryService = primaryCart?.service || selectedServiceId;
    const primaryIssue = primaryCart?.issue || selectedRepairOption?.issue || primaryCart?.selectedAnswer || '';
    const primarySubIssue = primaryCart?.subIssue || selectedRepairOption?.subIssue || '';
    const primaryIssueAnswer = primaryCart?.issueAnswer || selectedRepairOption?.issueAnswer || primaryCart?.selectedAnswer || '';
    const primaryPartGrade =
      (primaryCart && selectedCartPartGrades[primaryCart.service]?.partGrade) ||
      selectedRepairOption?.partGrade ||
      primaryCart?.partGrade ||
      'Standard';

    const payload = {
      action: 'createBooking',
      customer: {
        name: fullName.trim(),
        phone: cleanMobile,
        email: '',
      },
      device: {
        brand: selectedBrand,
        model: selectedSeries,
      },
      repair: {
        service: primaryService,
        issue: primaryIssue,
        subIssue: primarySubIssue,
        issueAnswer: primaryIssueAnswer,
        partGrade: primaryPartGrade,
      },
      formattedAddress: address.trim(),
      landmark: landmark.trim(),
      preferredDate: preferredDate,
      preferredTime: selectedTimeSlot,
      notes: combinedNotes,
      price: finalPrice,
      warranty: selectedRepairOption?.warranty,
      repairTime: selectedRepairOption?.repairTime,
      bookingFee: selectedRepairOption?.bookingFee,
      cartItems: repairCart.length > 0 ? repairCart : undefined,
    };

    try {
      console.log('[ANYFIX API] Submitting real booking...', payload);

      const data = await createBooking(payload);
      console.log('[ANYFIX API] createBooking response received:', data);

      if (data && data.success === true) {
        const realBookingId = data.bookingId || data.data?.bookingId;
        if (!realBookingId) {
          throw new Error('Server succeeded but did not return a Booking ID.');
        }

        const backendStatus = data.data?.status || 'BOOKING CONFIRMED';

        setConfirmedBooking({
          bookingId: realBookingId,
          brand: selectedBrand,
          model: selectedSeries,
          service: servicesTitle,
          partGrade: partGradesTitle,
          price: finalPrice || (data.data?.price ?? selectedRepairOption?.price),
          warranty: data.data?.warranty || selectedRepairOption?.warranty || 'Up to 6 Months Warranty',
          repairTime: data.data?.repairTime || selectedRepairOption?.repairTime || '30-45 Mins',
          bookingFee: data.data?.bookingFee || selectedRepairOption?.bookingFee,
          preferredDate: preferredDate,
          preferredTime: selectedTimeSlot,
          customerName: fullName.trim(),
          phone: cleanMobile,
          address: address.trim(),
          status: backendStatus,
          cartItems: repairCart.length > 0 ? repairCart : undefined,
        });

        onSuccess?.({
          bookingId: realBookingId,
          status: backendStatus,
          device: `${selectedBrand} ${selectedSeries}`,
          service: servicesTitle,
          partGrade: partGradesTitle,
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(
          data?.message || data?.error || "We couldn't submit your booking right now. Please try again."
        );
      }
    } catch (err: any) {
      console.error('[ANYFIX API ERROR] createBooking failed:', err);
      setSubmitError(
        err?.message || "We couldn't submit your booking right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  //                       PREMIUM BOOKING CONFIRMATION SCREEN
  // =========================================================================
  if (confirmedBooking) {
    return (
      <div className="w-full bg-white text-[#111827] py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[680px] mx-auto animate-in fade-in duration-200">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
            {/* Success Icon & Confirmation Heading */}
            <div className="text-center mb-6 sm:mb-7">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3.5 shadow-2xs">
                <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.2]" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 tracking-wide uppercase mb-2">
                Booking Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                Thank you! Your booking has been received.
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                Our team will contact you shortly to confirm the repair and appointment details.
              </p>
            </div>

            {/* Real Booking ID Highlight Card */}
            <div className="bg-[#EFF6FF]/60 border border-blue-100 rounded-xl p-4 sm:p-5 mb-6 text-center">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Booking ID
              </span>
              <div className="text-xl sm:text-2xl font-mono font-black text-[#1D4ED8] tracking-tight select-all">
                {confirmedBooking.bookingId}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-[#1D4ED8]">
                  Status: {confirmedBooking.status}
                </span>
                {confirmedBooking.bookingFee && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Visit: {confirmedBooking.bookingFee}
                  </span>
                )}
              </div>
            </div>

            {/* Selected Booking Details Summary */}
            <div className="border border-slate-100 rounded-xl bg-slate-50/70 p-4 sm:p-5 mb-6 text-xs sm:text-sm space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                <span className="text-slate-500">Device</span>
                <span className="font-bold text-[#111827] text-right">
                  {confirmedBooking.brand} {confirmedBooking.model}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                <span className="text-slate-500">Service</span>
                <span className="font-bold text-[#111827] text-right">
                  {confirmedBooking.service}
                </span>
              </div>
              {confirmedBooking.cartItems && confirmedBooking.cartItems.length > 0 && (
                <div className="py-2 border-b border-slate-200/60 space-y-1.5">
                  <span className="text-slate-500 block text-xs">Diagnostic Issues:</span>
                  {confirmedBooking.cartItems.map((ci) => (
                    <div key={ci.service} className="text-xs text-slate-700 pl-2 border-l-2 border-[#1D4ED8]">
                      <strong className="text-[#0F172A]">{ci.service}:</strong> {ci.selectedAnswer}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                <span className="text-slate-500">Part Grade & Price</span>
                <span className="font-bold text-[#111827] text-right">
                  {confirmedBooking.partGrade}{' '}
                  {confirmedBooking.price ? `(${formatPrice(confirmedBooking.price)})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                <span className="text-slate-500">Preferred Date</span>
                <span className="font-bold text-[#111827] text-right">
                  {confirmedBooking.preferredDate}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                <span className="text-slate-500">Time Slot</span>
                <span className="font-bold text-[#111827] text-right">
                  {confirmedBooking.preferredTime}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                <span className="text-slate-500">Customer</span>
                <span className="font-bold text-[#111827] text-right">
                  {confirmedBooking.customerName} (+91 {confirmedBooking.phone})
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-slate-500 shrink-0 mr-3">Doorstep Address</span>
                <span className="font-medium text-[#111827] text-right leading-tight">
                  {confirmedBooking.address}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onTrackRepair) {
                    onTrackRepair(confirmedBooking.bookingId);
                  } else {
                    window.location.href = `/track-repair?bookingId=${encodeURIComponent(
                      confirmedBooking.bookingId
                    )}`;
                  }
                }}
                className="w-full sm:w-auto min-w-[180px] h-11 px-6 rounded-xl font-bold text-sm bg-[#1D4ED8] hover:bg-[#1E40AF] text-white flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>Track Repair</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmedBooking(null);
                  setCurrentStep(1);
                  setSelectedSeries('');
                  setSelectedServiceId('');
                  setSelectedRepairOption(null);
                  setFullName('');
                  setMobileNumber('');
                  setAddress('');
                  setLandmark('');
                  setPreferredDate('');
                  setAdditionalNotes('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto h-11 px-5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white border border-[#E5E7EB] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Book Another Repair
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-transparent text-[#111827] py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-[1100px] mx-auto">
        {/* Compact Top Feature / Image Carousel */}
        <BookingFeatureCarousel />

        {/* ========================================================================= */}
        {/*                               PAGE 1: DEVICE                              */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div>
            {/* Premium Hero Banner for "Select Your Device" with Glassmorphism */}
            <div className="glass-panel relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/80 bg-white/70 backdrop-blur-xl p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-[0_8px_32px_rgba(29,78,216,0.06)]">
              {/* Smartphone Visual on the Right with subtle tech waves & ambient lighting */}
              <DeviceHeroVisual />

              {/* Foreground Hero Content (Text & Search) */}
              <div className="relative z-20 max-w-lg sm:max-w-xl text-left">
                {/* Header & Supporting Text */}
                <div>
                  <h1 className="text-2xl sm:text-[28px] lg:text-[34px] font-extrabold text-[#0F172A] tracking-tight leading-tight">
                    Select Your Device
                  </h1>
                  <p className="mt-2 text-sm sm:text-[15px] lg:text-base text-slate-600 max-w-md font-normal leading-relaxed">
                    Choose your phone brand and model to get started.
                  </p>
                </div>

                {/* Search Field with Glass Input */}
                <div className="mt-5 sm:mt-6 w-full max-w-md">
                  <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1D4ED8] transition-colors pointer-events-none" />
                    <input
                      type="text"
                      value={brandSearchQuery}
                      onChange={(e) => setBrandSearchQuery(e.target.value)}
                      placeholder="Search your phone model"
                      className="glass-input w-full h-11 sm:h-12 pl-10 pr-9 rounded-xl text-sm text-[#0F172A] placeholder:text-slate-400 outline-none transition-all shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)]"
                    />
                    {brandSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setBrandSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Selection Container */}
            <div className="space-y-5 pb-24 sm:pb-28">
              {/* Brand Selection Cards */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-[13px] sm:text-sm font-bold uppercase tracking-wider text-slate-700">
                    Select Brand
                  </label>
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedBrand ? `${selectedBrand} Selected` : 'Tap to select'}
                  </span>
                </div>

                {isBrandsLoading ? (
                  /* Subtle Brand Loading Skeleton using existing design language */
                  <div className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-6 gap-2.5 sm:gap-3 pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-28 sm:w-auto h-18 sm:h-20 rounded-xl bg-slate-100/90 border border-slate-200/70 animate-pulse flex items-center justify-center p-2.5 select-none"
                      >
                        <div className="w-14 h-4 bg-slate-200/80 rounded" />
                      </div>
                    ))}
                  </div>
                ) : brandsError ? (
                  /* Clean User-Friendly Error State */
                  <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{brandsError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={fetchBrands}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  </div>
                ) : filteredBrandsList.length === 0 ? (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs sm:text-sm text-center">
                    No brands found matching "{brandSearchQuery}".
                  </div>
                ) : (
                  /* Live API Brands from Google Sheet PRICE_LIST */
                  <div className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-6 gap-2.5 sm:gap-3 pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {filteredBrandsList.map((brandName, idx) => {
                      const isSelected = selectedBrand === brandName;
                      const logoUrl = getBrandLogo(brandName);
                      return (
                        <div
                          key={`${brandName}-${idx}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`Select ${brandName}`}
                          aria-pressed={isSelected}
                          onClick={() => handleSelectBrand(brandName)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectBrand(brandName);
                            }
                          }}
                          className={`group relative flex-shrink-0 w-28 sm:w-auto h-18 sm:h-20 rounded-xl transition-all duration-300 flex items-center justify-center p-2.5 select-none cursor-pointer focus:outline-none ${
                            isSelected
                              ? 'border-2 border-[#1D4ED8] bg-[#EFF6FF]/80 backdrop-blur-md shadow-[0_0_0_1px_#1D4ED8,0_6px_20px_rgba(29,78,216,0.18)]'
                              : 'glass-card border border-white/80 bg-white/75 backdrop-blur-md hover:border-blue-400/50 hover:bg-white/95 hover:shadow-[0_8px_20px_rgba(29,78,216,0.1)] hover:-translate-y-1'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center shadow-2xs">
                              <Check className="w-2 h-2 stroke-[3]" />
                            </div>
                          )}
                          <div className="w-full h-full flex items-center justify-center p-1.5">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={`${brandName} logo`}
                                className="max-h-6 sm:max-h-7 w-auto max-w-[80%] object-contain select-none pointer-events-none transition-transform duration-150 group-hover:scale-105"
                                loading="eager"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentElement;
                                  if (parent && !parent.querySelector('.brand-text-fallback')) {
                                    const span = document.createElement('span');
                                    span.className = 'brand-text-fallback text-xs sm:text-sm font-bold text-[#111827] tracking-tight';
                                    span.textContent = brandName;
                                    parent.appendChild(span);
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-xs sm:text-sm font-bold text-[#111827] tracking-tight">
                                {brandName}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Series / Model Selection Pills */}
              {selectedBrand && (
                <div className="pt-3.5 border-t border-slate-100 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-[13px] sm:text-sm font-bold uppercase tracking-wider text-slate-700">
                      Select Model
                    </label>
                    {selectedSeries && (
                      <span className="text-xs text-[#1D4ED8] font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {selectedSeries}
                      </span>
                    )}
                  </div>

                  {isModelsLoading ? (
                    /* Subtle Model Loading Skeleton Pills */
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="h-9 sm:h-9.5 w-24 sm:w-28 rounded-full bg-slate-100/90 border border-slate-200/70 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : modelsError ? (
                    /* Clean Error State for Models */
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{modelsError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRetryFetchModels}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry</span>
                      </button>
                    </div>
                  ) : filteredSeriesList.length > 0 ? (
                    /* Live API Models from Google Sheet PRICE_LIST */
                    <div className="flex flex-wrap gap-2">
                      {filteredSeriesList.map((series, idx) => {
                        const isSelected = selectedSeries === series;
                        return (
                          <button
                            key={`${series}-${idx}`}
                            type="button"
                            onClick={() => handleSelectSeries(series)}
                            className={`h-9 sm:h-9.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 select-none cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'glass-btn-primary text-white shadow-2xs font-semibold'
                                : 'glass-pill border border-white/80 bg-white/75 backdrop-blur-md text-[#111827] hover:border-blue-300 hover:bg-white hover:text-[#1D4ED8]'
                            }`}
                          >
                            {series}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                      <p className="text-xs text-slate-500">
                        No models matching &ldquo;{brandSearchQuery}&rdquo; for {selectedBrand}.
                      </p>
                      <button
                        type="button"
                        onClick={() => setBrandSearchQuery('')}
                        className="mt-1.5 text-xs font-semibold text-[#1D4ED8] underline hover:no-underline"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Frozen Bottom Action Bar with Glassmorphism */}
              <div className="glass-nav fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-t border-white/70 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] py-3 sm:py-3.5 px-4 sm:px-6">
                <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="text-xs sm:text-[13px] text-slate-600 text-center sm:text-left">
                    {selectedBrand && selectedSeries ? (
                      <span className="inline-flex items-center gap-1.5 text-[#0F172A] font-semibold">
                        <Smartphone className="w-4 h-4 text-[#1D4ED8]" />
                        <span>
                          Selected: <strong className="text-[#1D4ED8]">{selectedBrand}</strong> • <strong className="text-[#0F172A]">{selectedSeries}</strong>
                        </span>
                      </span>
                    ) : selectedBrand ? (
                      <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span>Please select a model series to continue</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Select a brand and series to continue</span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!isStep1ContinueEnabled}
                    onClick={handleContinueFromStep1}
                    className={`w-full sm:w-auto min-w-[150px] h-11 px-7 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150 ${
                      isStep1ContinueEnabled
                        ? 'glass-btn-primary text-white cursor-pointer active:scale-[0.99]'
                        : 'bg-slate-100 text-slate-400 border border-[#E5E7EB] cursor-not-allowed'
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/*                               PAGE 2: SERVICE                             */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="animate-in fade-in duration-150 pb-28 sm:pb-32">
            {/* Section Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-[#111827] tracking-tight leading-tight">
                What does your phone need?
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#64748B] max-w-lg mx-auto">
                Select one or more services. Add each service to your repair cart after answering a few questions.
              </p>
            </div>

            {/* Centered Search Field */}
            <div className="mb-5 sm:mb-6 max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1D4ED8] transition-colors pointer-events-none" />
                <input
                  type="text"
                  value={serviceSearchQuery}
                  onChange={(e) => setServiceSearchQuery(e.target.value)}
                  placeholder="Search issues or services (e.g. screen, battery, camera)"
                  className="glass-input w-full h-11 sm:h-12 pl-11 pr-10 rounded-full text-sm text-[#111827] placeholder:text-slate-400 outline-none transition-all shadow-2xs"
                />
                {serviceSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setServiceSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Horizontally Scrollable Category Filter Chips (Frozen / Sticky with Icons) */}
            <div className="glass-nav sticky top-[72px] z-30 bg-white/85 backdrop-blur-xl py-2.5 sm:py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-y border-white/60 shadow-xs mb-6 sm:mb-8">
              <div className="max-w-[1100px] mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                {CATEGORY_FILTERS.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-200 select-none cursor-pointer shrink-0 active:scale-95 ${
                        isActive
                          ? 'glass-btn-primary text-white shadow-2xs'
                          : 'glass-pill border border-white/80 bg-white/75 backdrop-blur-md text-[#111827] hover:border-blue-300 hover:bg-white hover:text-[#1D4ED8]'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : ''}>
                        {renderCategoryIcon(cat)}
                      </span>
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compact Horizontal Service List View */}
            {isServicesLoading ? (
              /* Premium Service Loading Skeletons */
              <div className="flex flex-col gap-2.5 sm:gap-3 max-w-[960px] mx-auto">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 bg-white border border-slate-200/80 animate-pulse flex items-center gap-3 sm:gap-4 lg:gap-5 select-none"
                  >
                    <div className="w-[100px] sm:w-[135px] md:w-[150px] aspect-[16/9] rounded-lg sm:rounded-xl bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 w-44 bg-slate-200 rounded" />
                      <div className="h-3 w-64 bg-slate-100 rounded" />
                      <div className="h-3 w-36 bg-slate-100 rounded" />
                    </div>
                    <div className="flex flex-col items-end justify-between h-[65px] shrink-0">
                      <div className="w-5 h-5 rounded-full bg-slate-200" />
                      <div className="h-8 w-16 sm:w-20 bg-slate-100 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : servicesError ? (
              /* Clean Error State */
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs max-w-lg mx-auto">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{servicesError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchServicesForDevice(selectedBrand, selectedSeries)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            ) : services.length === 0 ? (
              /* Empty State */
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl max-w-lg mx-auto">
                <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-[#111827] mb-1">
                  No services available for this device.
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  We currently do not have repair services available for {selectedBrand} {selectedSeries}.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Select Another Device</span>
                </button>
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="flex flex-col gap-2.5 sm:gap-3 max-w-[960px] mx-auto">
                {filteredServices.map((serviceName, idx) => {
                  const cartItem = repairCart.find((i) => i.service === serviceName);
                  const isInCart = Boolean(cartItem);
                  const meta = getServiceMetadata(serviceName);

                  return (
                    <div
                      key={`${serviceName}-${idx}`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isInCart}
                      onClick={() => handleOpenServiceQuestion(serviceName)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenServiceQuestion(serviceName);
                        }
                      }}
                      className={`glass-card group relative rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 transition-all duration-300 select-none cursor-pointer flex items-center gap-3 sm:gap-4 lg:gap-5 text-left focus:outline-none ${
                        isInCart
                          ? 'border-2 border-[#1D4ED8] bg-[#EFF6FF]/85 backdrop-blur-md shadow-md ring-1 ring-[#1D4ED8]/10'
                          : 'border border-white/80 bg-white/75 backdrop-blur-md hover:border-blue-400/50 hover:bg-white/95 hover:shadow-[0_12px_30px_rgba(29,78,216,0.1)] hover:-translate-y-1'
                      }`}
                    >
                      {/* 16:9 Compact Thumbnail Image */}
                      <div className="w-[105px] sm:w-[140px] md:w-[155px] aspect-[16/9] rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        {meta.image ? (
                          <img
                            src={meta.image}
                            alt={serviceName}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          renderServiceIcon(meta.category, serviceName)
                        )}
                      </div>

                      {/* Middle Details Section */}
                      <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm sm:text-base font-bold text-[#111827] tracking-tight group-hover:text-[#1D4ED8] transition-colors truncate">
                            {serviceName}
                          </h3>
                        </div>

                        {/* Selected Diagnostic Issue Chip or Short Description */}
                        {isInCart && cartItem ? (
                          <div className="my-1 px-2.5 py-0.5 sm:py-1 rounded-md bg-white border border-blue-200 text-[11px] sm:text-xs text-[#1D4ED8] inline-flex items-center gap-1.5 max-w-full shadow-2xs">
                            <span className="truncate">
                              <strong className="text-[#0F172A]">Issue:</strong> {cartItem.selectedAnswer}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenServiceQuestion(serviceName);
                              }}
                              className="text-[10px] sm:text-[11px] text-[#1D4ED8] font-bold underline shrink-0 hover:no-underline cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-[#64748B] mb-1 line-clamp-1 leading-snug">
                            {meta.description}
                          </p>
                        )}

                        {/* Badges: Warranty Included • 30–45 Mins */}
                        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-[#64748B] flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[#1D4ED8]">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
                            <span>{meta.warranty || 'Warranty Included'}</span>
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center gap-1 text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{meta.repairTime || '30–45 Mins'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Selection Indicator & Action Buttons */}
                      <div className="flex flex-col items-end justify-between self-stretch shrink-0 gap-2 pl-1 sm:pl-2">
                        {/* Circle indicator: ○ or ✓ */}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isInCart
                              ? 'bg-[#1D4ED8] text-white shadow-2xs ring-2 ring-blue-100'
                              : 'border-2 border-slate-300 bg-white group-hover:border-[#1D4ED8]'
                          }`}
                        >
                          {isInCart ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1D4ED8]/30 transition-colors" />
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto">
                          {isInCart ? (
                            /* Selected Actions: [ ✓ Selected ] [ Remove ] */
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenServiceQuestion(serviceName);
                                }}
                                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg text-xs font-bold bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                                title="Click to view or edit issue"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span className="hidden xs:inline sm:inline">Selected</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromCart(serviceName);
                                }}
                                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                                title="Remove this service"
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                                <span className="hidden xs:inline sm:inline">Remove</span>
                              </button>
                            </div>
                          ) : (
                            /* Unselected Action: [ + Add ] */
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenServiceQuestion(serviceName);
                              }}
                              className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-lg text-xs font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200 hover:bg-[#1D4ED8] hover:text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1 group-hover:bg-[#1D4ED8] group-hover:text-white active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <p className="text-xs sm:text-sm text-slate-500">
                  No issues found matching &ldquo;{serviceSearchQuery}&rdquo; in {selectedCategory}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setServiceSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-2 text-xs font-semibold text-[#1D4ED8] underline hover:no-underline cursor-pointer"
                >
                  Reset search & filters
                </button>
              </div>
            )}

            {/* ============================================================= */}
            {/*         DYNAMIC DIAGNOSTIC MODAL (Issue -> Sub Issue -> Answer) */}
            {/* ============================================================= */}
            {activeQuestionService && (
              <div
                className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
                onClick={() => setActiveQuestionService(null)}
              >
                <div
                  className="glass-panel relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/60 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-2xs flex items-center justify-center">
                        {getServiceMetadata(activeQuestionService).image ? (
                          <img
                            src={getServiceMetadata(activeQuestionService).image}
                            alt={activeQuestionService}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[#1D4ED8]">
                            {renderCategoryIcon(getServiceMetadata(activeQuestionService).category) || <Wrench className="w-4 h-4" />}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight">
                          {activeQuestionService}
                        </h3>
                        <p className="text-xs text-[#64748B]">
                          For {selectedBrand} {selectedSeries}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveQuestionService(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body: Progressive Diagnostic Questions from PRICE_LIST */}
                  <div className="p-5 sm:p-6 space-y-5 max-h-[68vh] overflow-y-auto">
                    {/* LEVEL 1: ISSUE SELECTION */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white text-[11px] font-bold flex items-center justify-center">
                            1
                          </span>
                          <span>What issue are you facing with {activeQuestionService}?</span>
                        </label>
                        {selectedModalIssue && (
                          <span className="text-[11px] font-semibold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                            Selected
                          </span>
                        )}
                      </div>

                      {isModalIssuesLoading ? (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-500">
                          <Loader2 className="w-4 h-4 animate-spin text-[#1D4ED8]" />
                          <span>Loading available issues from PRICE_LIST...</span>
                        </div>
                      ) : modalIssuesError ? (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                          <span>{modalIssuesError}</span>
                          <button
                            type="button"
                            onClick={() =>
                              fetchIssuesForService(
                                selectedBrand,
                                selectedSeries,
                                activeQuestionService
                              )
                            }
                            className="text-xs font-bold text-amber-700 underline cursor-pointer"
                          >
                            Retry
                          </button>
                        </div>
                      ) : modalIssues.length === 0 ? (
                        <div className="p-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                          No issues found for this service in PRICE_LIST.
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {modalIssues.map((issueName, idx) => {
                            const isSelected = selectedModalIssue === issueName;
                            return (
                              <button
                                key={`${issueName}-${idx}`}
                                type="button"
                                onClick={() => handleSelectModalIssue(issueName)}
                                className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                                  isSelected
                                    ? 'border-2 border-[#1D4ED8] bg-[#EFF6FF] text-[#0F172A] font-semibold shadow-2xs'
                                    : 'border-[#E5E7EB] bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <span className="flex-1 leading-snug">{issueName}</span>
                                <div
                                  className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                                    isSelected
                                      ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* LEVEL 2: SUB ISSUE SELECTION */}
                    {selectedModalIssue && (
                      <div className="pt-2 border-t border-slate-100 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white text-[11px] font-bold flex items-center justify-center">
                              2
                            </span>
                            <span>Specify sub-issue or symptom:</span>
                          </label>
                          {selectedModalSubIssue && (
                            <span className="text-[11px] font-semibold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </div>

                        {isModalSubIssuesLoading ? (
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <Loader2 className="w-4 h-4 animate-spin text-[#1D4ED8]" />
                            <span>Loading sub-issues...</span>
                          </div>
                        ) : modalSubIssuesError ? (
                          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                            <span>{modalSubIssuesError}</span>
                            <button
                              type="button"
                              onClick={() =>
                                fetchSubIssuesForIssue(
                                  selectedBrand,
                                  selectedSeries,
                                  activeQuestionService,
                                  selectedModalIssue
                                )
                              }
                              className="text-xs font-bold text-amber-700 underline cursor-pointer"
                            >
                              Retry
                            </button>
                          </div>
                        ) : modalSubIssues.length === 0 ? (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>No additional sub-issue needed for this selection.</span>
                          </div>
                        ) : selectedModalSubIssue ? (
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setIsSubIssueModalOpen(true)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsSubIssueModalOpen(true);
                              }
                            }}
                            className="p-3 rounded-xl border border-blue-200 bg-[#EFF6FF] text-[#0F172A] text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer hover:bg-blue-100/70 transition-colors shadow-2xs group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                              <span className="truncate">
                                {parseQuestionAnswer(selectedModalSubIssue).answer}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-[#1D4ED8] group-hover:underline shrink-0 ml-2">
                              Change
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsSubIssueModalOpen(true)}
                            className="w-full text-left p-3 rounded-xl border border-dashed border-[#CBD5E1] bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <span>Choose Sub Issue...</span>
                            <span className="text-xs font-bold text-[#1D4ED8]">Select</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* LEVEL 3: ISSUE ANSWER SELECTION (DYNAMIC QUESTION + ANSWER DISPLAY) */}
                    {(selectedModalSubIssue || (selectedModalIssue && modalSubIssues.length === 0)) && (
                      <div className="pt-2 border-t border-slate-100 animate-in fade-in duration-150">
                        {isModalIssueAnswersLoading ? (
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <Loader2 className="w-4 h-4 animate-spin text-[#1D4ED8]" />
                            <span>Loading options...</span>
                          </div>
                        ) : modalIssueAnswersError ? (
                          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                            <span>{modalIssueAnswersError}</span>
                            <button
                              type="button"
                              onClick={() =>
                                fetchIssueAnswersForSubIssue(
                                  selectedBrand,
                                  selectedSeries,
                                  activeQuestionService,
                                  selectedModalIssue,
                                  selectedModalSubIssue
                                )
                              }
                              className="text-xs font-bold text-amber-700 underline cursor-pointer"
                            >
                              Retry
                            </button>
                          </div>
                        ) : modalIssueAnswers.length === 0 ? (
                          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Selection complete. Ready to add to repair cart.</span>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {groupOptionsByQuestion(
                              modalIssueAnswers,
                              modalIssueAnswerQuestion || 'Exact condition / answer:'
                            ).map((group, gIdx) => (
                                <div key={`ans-group-${gIdx}`} className="space-y-2">
                                  {/* Dynamic Question Label */}
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                                      <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                        {gIdx + 3}
                                      </span>
                                      <span>{group.question || 'Exact condition / answer:'}</span>
                                    </label>
                                    {selectedModalIssueAnswer &&
                                      group.items.some((it) => it.raw === selectedModalIssueAnswer) && (
                                        <span className="text-[11px] font-semibold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                                          Selected
                                        </span>
                                      )}
                                  </div>

                                  {/* Matching Answer Options */}
                                  <div className="space-y-1.5">
                                    {group.items.map((item, idx) => {
                                      const isSelected = selectedModalIssueAnswer === item.raw;
                                      return (
                                        <button
                                          key={`${item.raw}-${idx}`}
                                          type="button"
                                          onClick={() => handleSelectModalIssueAnswer(item.raw)}
                                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                                            isSelected
                                              ? 'border-2 border-[#1D4ED8] bg-[#EFF6FF] text-[#0F172A] font-semibold shadow-2xs'
                                              : 'border-[#E5E7EB] bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                          }`}
                                        >
                                          <span className="flex-1 leading-snug">{item.answer}</span>
                                          <div
                                            className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                                              isSelected
                                                ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                                                : 'border-slate-300 bg-white'
                                            }`}
                                          >
                                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="px-5 sm:px-6 py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-2.5">
                    <div>
                      {repairCart.some((i) => i.service === activeQuestionService) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(activeQuestionService)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove from Cart</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveQuestionService(null)}
                        className="h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={!canAddServiceToCart}
                        onClick={handleSaveServiceToCart}
                        className={`h-10 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs ${
                          canAddServiceToCart
                            ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white cursor-pointer active:scale-95'
                            : 'bg-slate-100 text-slate-400 border border-[#E5E7EB] cursor-not-allowed'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>
                          {repairCart.some((i) => i.service === activeQuestionService)
                            ? 'Update Cart'
                            : 'Add to Repair Cart'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/*                         SUB ISSUE POPUP / MODAL                          */}
            {/* ========================================================================= */}
            {activeQuestionService && isSubIssueModalOpen && modalSubIssues.length > 0 && (
              <div
                className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
                onClick={() => setIsSubIssueModalOpen(false)}
              >
                <div
                  className="relative w-full max-w-[540px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="px-5 sm:px-6 py-4 sm:py-4.5 border-b border-slate-100 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
                        {(() => {
                          const groups = groupOptionsByQuestion(modalSubIssues, modalSubIssueQuestion);
                          return groups.length === 1 && groups[0].question
                            ? groups[0].question
                            : 'Select Sub Issue';
                        })()}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Choose the option that best matches your problem.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSubIssueModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sub Issues Content (Grouped by Question if multiple questions) */}
                  <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                    {groupOptionsByQuestion(modalSubIssues, modalSubIssueQuestion || 'Options').map((group, gIdx) => {
                      const allGroups = groupOptionsByQuestion(modalSubIssues, modalSubIssueQuestion);
                      const showGroupHeading = allGroups.length > 1 && Boolean(group.question);
                      return (
                        <div key={`sub-group-${gIdx}`} className="space-y-2">
                          {showGroupHeading && (
                            <h4 className="text-xs sm:text-[13px] font-bold text-[#0F172A] px-1">
                              {group.question}
                            </h4>
                          )}
                          <div className="space-y-2">
                            {group.items.map((item, idx) => {
                              const isSelected = selectedModalSubIssue === item.raw;
                              return (
                                <button
                                  key={`${item.raw}-${idx}`}
                                  type="button"
                                  onClick={() => handleSelectModalSubIssue(item.raw)}
                                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                                    isSelected
                                      ? 'border-2 border-[#1D4ED8] bg-[#EFF6FF] text-[#0F172A] font-bold shadow-2xs ring-1 ring-[#1D4ED8]/20'
                                      : 'border-[#E5E7EB] bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/80'
                                  }`}
                                >
                                  <span className="flex-1 leading-snug">{item.answer}</span>
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                                      isSelected
                                        ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-2xs'
                                        : 'border-slate-300 bg-white'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Frozen Bottom Action Bar with Glassmorphism */}
            <div className="glass-nav fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-t border-white/70 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] py-3 sm:py-3.5 px-4 sm:px-6">
              <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="glass-btn-secondary h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl border border-slate-200/80 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                  <div className="text-left">
                    {repairCart.length > 0 ? (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="glass-pill-blue inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                            {repairCart.length} {repairCart.length === 1 ? 'Service Added' : 'Services Added'}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#111827] truncate max-w-[170px] sm:max-w-xs md:max-w-md">
                          {repairCart.map((c) => c.service).join(' + ')}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Select one or more services to add to repair cart
                      </p>
                    )}
                  </div>
                </div>

                {/* Continue Button to Step 3 */}
                <button
                  type="button"
                  disabled={repairCart.length === 0}
                  onClick={handleContinueFromStep2}
                  className={`h-10 sm:h-11 px-5 sm:px-7 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-150 shadow-sm ${
                    repairCart.length > 0
                      ? 'glass-btn-primary text-white cursor-pointer active:scale-[0.99]'
                      : 'bg-slate-100 text-slate-400 border border-[#E5E7EB] cursor-not-allowed'
                  }`}
                >
                  <span>
                    {repairCart.length > 0
                      ? `Continue (${repairCart.length})`
                      : 'Continue'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/*                               PAGE 3: PART GRADE                          */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="animate-in fade-in duration-150">
            {/* Selected Device + Service Compact Summary */}
            <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-center gap-2 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-100 text-slate-700 shadow-2xs">
                <Smartphone className="w-3 h-3 text-[#1D4ED8]" />
                <span className="font-semibold text-[#111827]">
                  {selectedBrand} · {selectedSeries || 'iPhone 15 Pro Max'}
                </span>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-100 text-slate-700 shadow-2xs">
                <Wrench className="w-3 h-3 text-[#1D4ED8]" />
                <span className="font-semibold text-[#111827]">
                  {repairCart.length > 1
                    ? `${repairCart.length} Services in Cart`
                    : selectedServiceObj?.name || 'Screen / Display Replacement'}
                </span>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Page Header */}
            <div className="text-center mb-5 sm:mb-6">
              <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#111827] tracking-tight leading-tight">
                Choose Your Part Grade
              </h1>
              <p className="mt-1.5 text-sm sm:text-[15px] text-slate-500 max-w-md mx-auto">
                {repairCart.length > 1
                  ? 'Select the preferred part quality for each of your repair services.'
                  : 'Select the part option that works best for your device.'}
              </p>
            </div>

            {/* Part Grade Selection (Dynamic for all cart items) */}
            {repairCart.length > 0 ? (
              <div className="space-y-6">
                {repairCart.map((cartItem, serviceIdx) => {
                  const options =
                    cartPartGrades[cartItem.service] && cartPartGrades[cartItem.service].length > 0
                      ? cartPartGrades[cartItem.service]
                      : [];
                  const selectedOption = selectedCartPartGrades[cartItem.service];
                  const isLoadingForService = isCartPartGradesLoading && options.length === 0;

                  return (
                    <div
                      key={cartItem.service}
                      className="glass-card rounded-2xl border border-white/80 bg-white/75 backdrop-blur-md p-4 sm:p-5 shadow-xs"
                    >
                      {/* Service Item Header */}
                      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center shadow-2xs">
                            {serviceIdx + 1}
                          </span>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                              {cartItem.service}
                            </h3>
                            <p className="text-xs text-[#64748B]">
                              Reported Issue: <strong className="text-[#0F172A]">{cartItem.selectedAnswer}</strong>
                            </p>
                          </div>
                        </div>
                        {selectedOption && (
                          <span className="text-xs font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-1 rounded-lg border border-blue-100 shadow-2xs">
                            {formatPrice(selectedOption.price)}
                          </span>
                        )}
                      </div>

                      {/* Part Grade Options for this service */}
                      {isLoadingForService ? (
                        <div className="space-y-2 py-1">
                          {[1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-full rounded-xl p-3 bg-slate-50 border border-slate-200/60 animate-pulse flex items-center justify-between gap-3"
                            >
                              <div className="w-12 h-12 rounded-lg bg-slate-200/80 shrink-0" />
                              <div className="flex-1 space-y-1.5">
                                <div className="h-3.5 w-28 bg-slate-200/80 rounded" />
                                <div className="h-4 w-20 bg-slate-200/80 rounded" />
                              </div>
                              <div className="w-5 h-5 rounded-full bg-slate-200/80 shrink-0" />
                            </div>
                          ))}
                        </div>
                      ) : options.length === 0 ? (
                        <div className="p-4 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                          <p className="text-xs text-slate-500">
                            No part grade options found for this issue in PRICE_LIST.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {options.map((option, optIdx) => {
                            const isSelected =
                              selectedOption === option ||
                              (selectedOption?.partGrade === option.partGrade &&
                                selectedOption?.price === option.price);
                            const imageSrc = getPartGradeImage(option.partGrade);
                            const displayPrice = formatPrice(option.price);

                            return (
                              <div
                                key={`${option.partGrade}-${optIdx}`}
                                role="button"
                                tabIndex={0}
                                aria-pressed={isSelected}
                                onClick={() => handleSelectCartPartGrade(cartItem.service, option)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleSelectCartPartGrade(cartItem.service, option);
                                  }
                                }}
                                className={`group relative w-full rounded-xl p-3 sm:p-3.5 transition-all duration-200 select-none cursor-pointer flex items-center justify-between gap-3 focus:outline-none ${
                                  isSelected
                                    ? 'border-2 border-[#1D4ED8] bg-[#EFF6FF]/75 backdrop-blur-md shadow-xs ring-1 ring-[#1D4ED8]/20'
                                    : 'glass-card border border-white/80 bg-white/70 backdrop-blur-md hover:border-blue-400/50 hover:bg-white hover:shadow-2xs hover:-translate-y-0.5'
                                }`}
                              >
                                <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] border border-blue-100/60 p-1.5 flex items-center justify-center shrink-0">
                                  <img
                                    src={imageSrc}
                                    alt={option.partGrade}
                                    className="w-full h-full object-contain pointer-events-none"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs sm:text-sm font-bold text-[#111827]">
                                      {option.partGrade}
                                    </h4>
                                    {option.bookingFee && (
                                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                        {option.bookingFee}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm sm:text-base font-black text-[#111827] mt-0.5">
                                    {displayPrice}
                                  </div>
                                  <div className="mt-1 flex items-center gap-3 text-[11px] text-[#64748B]">
                                    {option.warranty && (
                                      <span className="flex items-center gap-1 text-[#1D4ED8]">
                                        <ShieldCheck className="w-3 h-3 text-[#1D4ED8]" />
                                        {option.warranty}
                                      </span>
                                    )}
                                    {option.repairTime && (
                                      <span className="flex items-center gap-1 text-slate-500">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        {option.repairTime}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                      isSelected
                                        ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-2xs'
                                        : 'border-slate-300 bg-white group-hover:border-slate-400'
                                    }`}
                                  >
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Combined Price Summary Card */}
                <div className="rounded-2xl border border-blue-200 bg-[#EFF6FF]/70 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
                      {repairCart.length === 1
                        ? 'Total Estimated Repair Cost'
                        : `Total Estimated Repair Cost (${repairCart.length} services)`}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mt-0.5">
                      {formatPrice(totalCartPrice)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Includes genuine parts, doorstep visit, and verified warranty.
                    </p>
                  </div>
                  <div className="text-left sm:text-right text-xs text-slate-600 font-medium">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      Doorstep Service Included
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty Cart State */
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl max-w-lg mx-auto">
                <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-[#111827] mb-1">
                  No repair services selected.
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Please go back to Step 02 and add at least one service to your repair cart.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose Services</span>
                </button>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="pt-4 sm:pt-5 border-t border-slate-100 mt-5 sm:mt-6 flex items-center justify-between gap-3">
              {/* Back to Step 2 */}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="glass-btn-secondary h-11 px-5 rounded-xl border border-slate-200/80 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {/* Continue Button to Step 4 */}
              <button
                type="button"
                disabled={!isStep3ContinueEnabled}
                onClick={handleContinueFromStep3}
                className={`h-11 px-6 sm:px-7 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-150 ${
                  isStep3ContinueEnabled
                    ? 'glass-btn-primary text-white cursor-pointer active:scale-[0.99]'
                    : 'bg-slate-100 text-slate-400 border border-[#E5E7EB] cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Temporary Local Step 3 Completion Confirmation */}
            {step3Completed && selectedPartGradeObj && (
              <div className="mt-5 p-4 rounded-xl bg-[#EFF6FF] border border-blue-200 text-[#111827] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-150">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">
                      {selectedPartGradeObj.name} Grade Selected ({selectedPartGradeObj.price})
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      For {selectedBrand} {selectedSeries || 'iPhone 15 Pro Max'} · {selectedServiceObj?.name || 'Screen / Display Replacement'}. Step 3 complete.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] px-3.5 py-1.5 rounded-lg transition-colors shrink-0 shadow-2xs"
                >
                  <span>Go to Step 4</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/*                               PAGE 4: DETAILS                             */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="animate-in fade-in duration-150">
            {/* Selected Device + Service + Part Grade Compact Summary */}
            <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-100 text-slate-700 shadow-2xs">
                <Smartphone className="w-3 h-3 text-[#1D4ED8]" />
                <span className="font-semibold text-[#111827]">
                  {selectedBrand} · {selectedSeries || 'iPhone 15 Pro Max'}
                </span>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-100 text-slate-700 shadow-2xs">
                <Wrench className="w-3 h-3 text-[#1D4ED8]" />
                <span className="font-semibold text-[#111827]">
                  {repairCart.length > 1
                    ? `${repairCart.length} Services (${repairCart.map((c) => c.service).join(', ')})`
                    : selectedServiceObj?.name || 'Screen / Display Replacement'}
                </span>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-100 text-slate-700 shadow-2xs">
                <ShieldCheck className="w-3 h-3 text-[#1D4ED8]" />
                <span className="font-semibold text-[#111827]">
                  {repairCart.length > 1
                    ? `Total: ${formatPrice(totalCartPrice)}`
                    : `${selectedPartGradeObj?.name || 'OEM'} (${selectedPartGradeObj?.price || '₹36,999'})`}
                </span>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Page Header */}
            <div className="text-center mb-5 sm:mb-6">
              <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#111827] tracking-tight leading-tight">
                Tell us where we should come
              </h1>
              <p className="mt-1.5 text-sm sm:text-[15px] text-slate-500 max-w-md mx-auto">
                Enter your details so our technician can reach you.
              </p>
            </div>

            {/* Form Container (Desktop 2-column, Mobile stacked in exact required order) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {/* LEFT COLUMN (Desktop) / Ordered Elements (Mobile) */}
              <div className="space-y-3.5 sm:space-y-4 flex flex-col">
                {/* 1. Full Name * */}
                <div className="order-1">
                  <label className="block text-[13px] font-bold text-[#111827] mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="glass-input w-full h-11 px-3.5 rounded-xl text-sm text-[#111827] placeholder:text-slate-400 outline-none transition-all duration-150 shadow-2xs"
                  />
                </div>

                {/* 2. Mobile Number * */}
                <div className="order-2">
                  <label className="block text-[13px] font-bold text-[#111827] mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-500 border-r border-slate-300 pr-2 pointer-events-none select-none">
                      <span className="text-sm leading-none">🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter your 10-digit mobile number"
                      className="glass-input w-full h-11 pl-20 pr-3.5 rounded-xl text-sm text-[#111827] placeholder:text-slate-400 outline-none transition-all duration-150 shadow-2xs tracking-wide"
                    />
                  </div>
                  {mobileNumber.length > 0 && !isMobileValid && (
                    <p className="mt-1 text-[11px] text-amber-600 font-medium">
                      Please enter a valid 10-digit mobile number ({mobileNumber.length}/10 digits)
                    </p>
                  )}
                </div>

                {/* 5. Preferred Date * */}
                <div className="order-6 lg:order-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[13px] font-bold text-[#111827]">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Available every day</span>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      min={todayISO}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="glass-input w-full h-11 px-3.5 rounded-xl text-sm text-[#111827] outline-none transition-all duration-150 shadow-2xs cursor-pointer"
                    />
                  </div>
                </div>

                {/* 6. Time Slot * (Selectable cards, NOT dropdown) */}
                <div className="order-7 lg:order-4">
                  <label className="block text-[13px] font-bold text-[#111827] mb-1.5">
                    Time Slot <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {TIME_SLOTS.map((slot, idx) => {
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <div
                          key={`${slot}-${idx}`}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isSelected}
                          onClick={() => setSelectedTimeSlot(slot)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedTimeSlot(slot);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs sm:text-[13px] font-semibold transition-all duration-200 select-none cursor-pointer flex items-center justify-between focus:outline-none ${
                            isSelected
                              ? 'border-2 border-[#1D4ED8] bg-[#EFF6FF]/80 backdrop-blur-md text-[#1D4ED8] shadow-xs font-bold'
                              : 'glass-pill border border-white/80 bg-white/75 backdrop-blur-md text-slate-700 hover:border-blue-300 hover:bg-white'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[#1D4ED8]' : 'text-slate-400'}`} />
                            {slot}
                          </span>
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${
                              isSelected
                                ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 7. Additional Notes (Optional) */}
                <div className="order-8 lg:order-5">
                  <label className="block text-[13px] font-bold text-[#111827] mb-1">
                    Additional Notes <span className="text-xs font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Anything else we should know? (optional)"
                    className="glass-input w-full p-2.5 sm:p-3 rounded-xl text-sm text-[#111827] placeholder:text-slate-400 outline-none transition-all duration-150 shadow-2xs resize-none"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN (Desktop) / Location & Address Elements */}
              <div className="space-y-3.5 sm:space-y-4 flex flex-col">
                {/* Location Section: Compact Map Container */}
                <div className="order-3 lg:order-1">
                  <label className="block text-[13px] font-bold text-[#111827] mb-1">
                    Location Area
                  </label>
                  {detectedCoords ? (
                    <div className="relative w-full h-32 sm:h-36 rounded-xl border border-[#E5E7EB] overflow-hidden shadow-2xs">
                      {/* Live street-level map centered on detected user coordinates */}
                      <iframe
                        className="w-full h-full border-0 pointer-events-auto"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${detectedCoords.longitude - 0.005}%2C${detectedCoords.latitude - 0.003}%2C${detectedCoords.longitude + 0.005}%2C${detectedCoords.latitude + 0.003}&layer=mapnik&marker=${detectedCoords.latitude}%2C${detectedCoords.longitude}`}
                        title="Detected Location Map"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-blue-100 shadow-2xs text-[10px] font-bold text-[#111827] flex items-center gap-1.5 pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Location Centered</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-32 sm:h-36 rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-[#EFF6FF] via-white to-slate-50 overflow-hidden shadow-2xs flex flex-col items-center justify-center p-3 select-none">
                      {/* Minimal map grid lines vector texture */}
                      <svg
                        className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                      >
                        <defs>
                          <pattern id="mapGrid" width="36" height="36" patternUnits="userSpaceOnUse">
                            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#93C5FD" strokeWidth="1" strokeDasharray="2 3" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#mapGrid)" />
                        {/* Stylized road network */}
                        <path d="M -20 70 Q 120 30 240 80 T 500 60" fill="none" stroke="#CBD5E1" strokeWidth="5" />
                        <path d="M 180 -10 Q 200 70 220 180" fill="none" stroke="#CBD5E1" strokeWidth="4" />
                        <path d="M -20 70 Q 120 30 240 80 T 500 60" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
                        <path d="M 180 -10 Q 200 70 220 180" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                      </svg>

                      {/* Glowing Pin Marker */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="relative flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[#1D4ED8]/15 animate-ping absolute" />
                          <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center shadow-md ring-3 ring-[#EFF6FF]">
                            <MapPin className="w-4 h-4 fill-white stroke-[#1D4ED8]" />
                          </div>
                        </div>
                        <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-blue-100 shadow-2xs text-[10px] font-bold text-[#111827] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Current Location Area</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* "Use My Current Location" Button */}
                <div className="order-4 lg:order-2">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isDetectingLocation}
                    className={`w-full h-10 sm:h-10.5 px-3.5 rounded-xl border font-bold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-[0.99] ${
                      isDetectingLocation
                        ? 'border-blue-200 bg-blue-50 text-blue-400 cursor-not-allowed'
                        : locationDetected
                        ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70 text-emerald-700'
                        : 'border-blue-200 bg-[#EFF6FF] hover:bg-blue-100/70 text-[#1D4ED8]'
                    }`}
                  >
                    {isDetectingLocation ? (
                      <>
                        <Navigation className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                        <span>Detecting location...</span>
                      </>
                    ) : locationDetected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                        <span>Location detected</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5 text-[#1D4ED8]" />
                        <span>Use My Current Location</span>
                      </>
                    )}
                  </button>

                  {/* Inline messages */}
                  {locationError && (
                    <p className="mt-1 text-xs text-amber-800 font-medium bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 animate-in fade-in duration-150">
                      {locationError}
                    </p>
                  )}

                  {!locationError && locationStatus && (
                    <p className="mt-1 text-xs text-blue-700 font-medium bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100/70 animate-in fade-in duration-150">
                      {locationStatus}
                    </p>
                  )}
                </div>

                {/* 3. Doorstep Address * */}
                <div className="order-5 lg:order-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[13px] font-bold text-[#111827]">
                      Doorstep Address <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Always editable</span>
                  </div>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    className="glass-input w-full p-2.5 sm:p-3 rounded-xl text-sm text-[#111827] placeholder:text-slate-400 outline-none transition-all duration-150 shadow-2xs resize-none"
                  />
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    House/Flat no., Building, Street, Area, City, PIN code
                  </p>
                </div>

                {/* 4. Landmark (Optional) */}
                <div className="order-6 lg:order-4">
                  <label className="block text-[13px] font-bold text-[#111827] mb-1">
                    Landmark <span className="text-xs font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Nearby landmark (optional)"
                    className="glass-input w-full h-11 px-3.5 rounded-xl text-sm text-[#111827] placeholder:text-slate-400 outline-none transition-all duration-150 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit Error Display */}
            {submitError && (
              <div className="mt-4 p-4 rounded-xl bg-red-50/90 backdrop-blur-md border border-red-200 text-red-700 flex items-start gap-2.5 text-xs sm:text-sm animate-in fade-in shadow-2xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{submitError}</p>
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="pt-4 sm:pt-5 border-t border-slate-100 mt-5 sm:mt-6 flex items-center justify-between gap-3">
              {/* Back to Step 3 */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setCurrentStep(3)}
                className="glass-btn-secondary h-11 px-5 rounded-xl border border-slate-200/80 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {/* Submit Booking Button */}
              <button
                type="button"
                disabled={!isStep4ContinueEnabled || isSubmitting}
                onClick={handleSubmitBooking}
                className={`h-11 px-6 sm:px-8 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-150 ${
                  isStep4ContinueEnabled && !isSubmitting
                    ? 'glass-btn-primary text-white cursor-pointer active:scale-[0.99]'
                    : 'bg-slate-100 text-slate-400 border border-[#E5E7EB] cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting Booking...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
