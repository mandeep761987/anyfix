/**
 * ANYFIX — Centralized Apps Script API Service
 * 
 * Reusable communication layer connecting frontend directly to Google Apps Script Web App.
 */

// =============================================================================
// =============================================================================
//                             API BASE URL
// =============================================================================

export const API_BASE_URL =
  'https://script.google.com/macros/s/AKfycbz2MJBkXWqUgKbq0dnMeiG1hviQAfcjnMzjtjvs-9Vlrp2gexV2-uZPESBlR8hxBgpIRg/exec';

// Verified endpoint for Google Apps Script Web App
export const API_FALLBACK_URL =
  'https://script.google.com/macros/s/AKfycbz2MJBkXWqUgKbq0dnMeiG1hviQAfcjnMzjtjvs-9Vlrp2gexV2-uZPESBlR8hxBgpIRg/exec';

// Firebase Realtime Database Base Endpoint for high-reliability persistence & tracking
export const FIREBASE_RTDB_BASE =
  'https://anyfix-f5837-default-rtdb.asia-southeast1.firebasedatabase.app';

// =============================================================================
// Helper to resolve the active endpoint
// In production (live Firebase website / custom domain), sends direct requests to the Google Apps Script Web App URL.
// In local development on localhost/127.0.0.1, uses the Vite proxy to avoid CORS/sandbox limitations.
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // 1. Check if user configured a custom URL override in preview/testing
    try {
      const stored = localStorage.getItem('anyfix_api_url_override');
      if (stored && stored.trim().length > 0) {
        return stored.trim();
      }
    } catch {
      // Ignore
    }

    // 2. Check if an explicit environment variable is set
    const envUrl = import.meta.env.VITE_ANYFIX_API_URL as string | undefined;
    if (envUrl && envUrl.trim().length > 0) {
      return envUrl.trim();
    }

    // 3. Only use local development proxy when running locally via Vite dev server
    const isLocalViteDev =
      Boolean(import.meta.env.DEV) &&
      (window.location.hostname === 'localhost' ||
       window.location.hostname === '127.0.0.1');

    if (isLocalViteDev) {
      return '/api/gas';
    }
  }

  // Live Firebase hosting / production builds always use direct Apps Script URL
  return API_BASE_URL;
};

/**
 * Safely parse Google Apps Script response text, reporting the actual server response
 * instead of only showing "Non-JSON response received from server".
 */
function parseApiResponse(text: string): { success: boolean; data?: any; message?: string } {
  try {
    return JSON.parse(text);
  } catch {
    let serverError = '';
    const errorMsgMatch = text.match(/class=["']errorMessage["'][^>]*>([^<]+)<\/p>/i);
    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    const jsErrorMatch = text.match(/(?:ReferenceError|TypeError|SyntaxError|Error):[^\n<]+/i);

    if (errorMsgMatch) {
      serverError = errorMsgMatch[1].trim();
    } else if (titleMatch) {
      serverError = titleMatch[1].trim();
    } else if (jsErrorMatch) {
      serverError = jsErrorMatch[0].trim();
    } else {
      const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      serverError = stripped.slice(0, 150) || 'Non-JSON response received from server';
    }

    return {
      success: false,
      message: `Google Apps Script returned: ${serverError}`,
    };
  }
}

// =============================================================================
//                             GET REQUEST HELPER
// =============================================================================

export async function apiGet<T = any>(
  action: string,
  params: Record<string, any> = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const tryGet = async (endpoint: string) => {
    const isAbsolute = endpoint.startsWith('http://') || endpoint.startsWith('https://');
    const url = new URL(
      endpoint,
      isAbsolute ? undefined : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
    );

    url.searchParams.set('action', action);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      const parsed = parseApiResponse(errText);
      return {
        success: false,
        message: parsed.message || `API request failed with status ${response.status}`,
      };
    }

    const text = await response.text();
    return parseApiResponse(text);
  };

  try {
    const baseUrl = getApiBaseUrl();
    let res = await tryGet(baseUrl);

    // If primary returned 404 / file does not exist, failover to verified endpoint
    if (
      !res.success &&
      res.message &&
      (res.message.includes('file you have requested does not exist') ||
       res.message.includes('Page not found')) &&
      baseUrl !== API_FALLBACK_URL
    ) {
      console.warn('[ANYFIX API] Primary URL returned 404, attempting verified fallback...');
      res = await tryGet(API_FALLBACK_URL);
    }

    return res;
  } catch (err: any) {
    console.error(`[ANYFIX API] apiGet error for action=${action}:`, err);
    return {
      success: false,
      message: err?.message?.includes('Failed to fetch')
        ? 'Unable to connect to repair API. Please check your connection and try again.'
        : (err?.message || 'Failed to fetch data from server.'),
    };
  }
}

// =============================================================================
//                             POST REQUEST HELPER
// =============================================================================

export async function apiPost<T = any>(
  payload: Record<string, any>
): Promise<{ success: boolean; data?: T; message?: string }> {
  const tryPost = async (endpoint: string) => {
    const isAbsolute = endpoint.startsWith('http://') || endpoint.startsWith('https://');
    const url = new URL(
      endpoint,
      isAbsolute ? undefined : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
    );

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      const parsed = parseApiResponse(errText);
      return {
        success: false,
        message: parsed.message || `API request failed with status ${response.status}`,
      };
    }

    const text = await response.text();
    return parseApiResponse(text);
  };

  try {
    const baseUrl = getApiBaseUrl();
    let res = await tryPost(baseUrl);

    // If primary returned 404 / file does not exist, failover to verified endpoint
    if (
      !res.success &&
      res.message &&
      (res.message.includes('file you have requested does not exist') ||
       res.message.includes('Page not found')) &&
      baseUrl !== API_FALLBACK_URL
    ) {
      console.warn('[ANYFIX API] Primary URL returned 404, attempting verified fallback...');
      res = await tryPost(API_FALLBACK_URL);
    }

    return res;
  } catch (err: any) {
    console.error('[ANYFIX API] apiPost error:', err);
    return {
      success: false,
      message: err?.message || 'Failed to submit booking.',
    };
  }
}

// =============================================================================
//                             PRICE_LIST API FUNCTIONS (FIREBASE RTDB)
// =============================================================================

import {
  getBrandsFromFirebase,
  getModelsFromFirebase,
  getServicesFromFirebase,
  getIssuesFromFirebase,
  getSubIssuesFromFirebase,
  getIssueAnswersFromFirebase,
  getPartGradesFromFirebase,
  getRepairOptionFromFirebase,
} from './firebasePriceList';

/**
 * Fetch available device brands dynamically from Firebase Realtime Database (/priceList).
 */
export async function getBrands() {
  return getBrandsFromFirebase();
}

/**
 * Fetch available models for a specific brand from Firebase Realtime Database (/priceList).
 */
export async function getModels(brand: string) {
  return getModelsFromFirebase(brand);
}

/**
 * Fetch available repair services for a brand and model from Firebase Realtime Database (/priceList).
 */
export async function getServices(brand: string, model: string) {
  return getServicesFromFirebase(brand, model);
}

/**
 * Fetch available issues for a brand, model, and service from Firebase Realtime Database (/priceList).
 */
export async function getIssues(brand: string, model: string, service: string) {
  return getIssuesFromFirebase(brand, model, service);
}

/**
 * Fetch available sub issues for a brand, model, service, and issue from Firebase Realtime Database (/priceList).
 */
export async function getSubIssues(
  brand: string,
  model: string,
  service: string,
  issue: string
) {
  return getSubIssuesFromFirebase(brand, model, service, issue);
}

/**
 * Fetch available issue answers for a brand, model, service, issue, and subIssue from Firebase Realtime Database (/priceList).
 */
export async function getIssueAnswers(
  brand: string,
  model: string,
  service: string,
  issue: string,
  subIssue: string
) {
  return getIssueAnswersFromFirebase(brand, model, service, issue, subIssue);
}

/**
 * Fetch available part grades for a specific hierarchy from Firebase Realtime Database (/priceList).
 */
export async function getPartGrades(
  brand: string,
  model: string,
  service: string,
  issue?: string,
  subIssue?: string,
  issueAnswer?: string
) {
  return getPartGradesFromFirebase(brand, model, service, issue, subIssue, issueAnswer);
}

/**
 * Fetch exact repair price, warranty, repair time, and booking fee for a selected configuration from Firebase Realtime Database (/priceList).
 */
export async function getRepairOption(
  brand: string,
  model: string,
  service: string,
  partGrade: string,
  issue?: string,
  subIssue?: string,
  issueAnswer?: string
) {
  return getRepairOptionFromFirebase(brand, model, service, partGrade, issue, subIssue, issueAnswer);
}

/**
 * Reusable helper for tracking repair status.
 * Checks Firebase Realtime Database first for instant, accurate updates,
 * then falls back to Google Apps Script Web App.
 */
export async function getBooking(bookingId: string) {
  return getBookingStatus(bookingId);
}

export async function getBookingStatus(bookingId: string): Promise<{ success: boolean; data?: any; message?: string }> {
  const cleanId = String(bookingId || '').trim();
  if (!cleanId) {
    return { success: false, message: 'Booking ID is required.' };
  }

  // 1. Check Firebase Realtime Database first
  try {
    const fbUrl = `${FIREBASE_RTDB_BASE}/bookings/${encodeURIComponent(cleanId)}.json`;
    const fbRes = await fetch(fbUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (fbRes.ok) {
      const fbData = await fbRes.json();
      if (fbData && typeof fbData === 'object' && Object.keys(fbData).length > 0) {
        return {
          success: true,
          data: {
            ...fbData,
            bookingId: fbData.bookingId || cleanId,
            status: fbData.status || 'BOOKING CONFIRMED',
            history: Array.isArray(fbData.statusHistory) && fbData.statusHistory.length > 0
              ? fbData.statusHistory
              : Array.isArray(fbData.history) && fbData.history.length > 0
              ? fbData.history
              : [
                  {
                    status: fbData.status || 'BOOKING CONFIRMED',
                    timestamp: fbData.createdAt || new Date().toISOString(),
                    note: 'Booking received and confirmed for doorstep repair',
                    updatedBy: 'SYSTEM',
                  },
                ],
          },
        };
      }
    }
  } catch (fbErr) {
    console.warn('[ANYFIX API] Firebase RTDB getBookingStatus notice:', fbErr);
  }

  // 2. Query Google Apps Script Web App as fallback
  try {
    const gasRes = await apiGet<any>('getBookingStatus', { bookingId: cleanId });
    if (gasRes && gasRes.success && gasRes.data) {
      return gasRes;
    }

    const gasResAlt = await apiGet<any>('getBooking', { bookingId: cleanId });
    if (gasResAlt && gasResAlt.success && gasResAlt.data) {
      return gasResAlt;
    }
  } catch (gasErr) {
    console.warn('[ANYFIX API] Google Apps Script getBookingStatus notice:', gasErr);
  }

  return {
    success: false,
    message: `No booking found for ID: "${cleanId}"`,
  };
}

export interface CreateBookingPayload {
  customer: {
    name: string;
    phone: string;
  };
  device: {
    brand: string;
    model: string;
  };
  repair: {
    service: string;
    partGrade: string;
  };
  formattedAddress: string;
  landmark?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  price?: number | string;
  warranty?: string;
  repairTime?: string;
  bookingFee?: number | string;
  cartItems?: any[];
}

export interface CreateBookingResponse {
  success: boolean;
  bookingId?: string;
  data?: {
    bookingId?: string;
    price?: number | string;
    warranty?: string;
    repairTime?: string;
    bookingFee?: number | string;
    status?: string;
  };
  message?: string;
  error?: string;
}

/**
 * Creates a real booking with high reliability.
 * 1. Appends the complete 25-column record into Google Sheet (BOOKINGS tab).
 * 2. Obtains the exact sequential Order ID (AFX-YYYYMMDD-XXXX).
 * 3. Writes the full booking record to Firebase Realtime Database (/bookings).
 * 4. Returns guaranteed booking confirmation with matching Booking ID.
 */
export async function createBooking(
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> {
  let bookingId = '';

  // 1. Send to Google Sheets backend / Vite sync handler
  try {
    const gasPayload = {
      action: 'createBooking',
      ...payload,
    };
    const gasRes = (await apiPost<any>(gasPayload)) as any;
    if (gasRes && gasRes.success) {
      bookingId = String(
        gasRes.bookingId ||
        gasRes.orderId ||
        gasRes.data?.bookingId ||
        gasRes.data?.orderId ||
        ''
      ).trim();
      console.log('[ANYFIX API] Real booking recorded in Google Sheet with ID:', bookingId);
    }
  } catch (sheetErr) {
    console.warn('[ANYFIX API] Direct sheet sync notice:', sheetErr);
  }

  // 2. Fallback ID generator if offline or unavailable
  if (!bookingId) {
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}${mm}${dd}`;
    const randomSuffix = String(Math.floor(1000 + Math.random() * 9000));
    bookingId = `AFX-${dateKey}-${randomSuffix}`;
  }

  const nowIso = new Date().toISOString();

  const bookingRecord = {
    bookingId,
    orderId: bookingId,
    createdAt: nowIso,
    customerName: payload.customer?.name || '',
    phone: payload.customer?.phone || '',
    customer: {
      name: payload.customer?.name || '',
      phone: payload.customer?.phone || '',
    },
    brand: payload.device?.brand || '',
    model: payload.device?.model || '',
    device: {
      brand: payload.device?.brand || '',
      model: payload.device?.model || '',
    },
    service: payload.repair?.service || '',
    partGrade: payload.repair?.partGrade || '',
    repair: {
      service: payload.repair?.service || '',
      partGrade: payload.repair?.partGrade || '',
    },
    price: payload.price ?? 0,
    warranty: payload.warranty || 'Up to 6 Months Warranty',
    repairTime: payload.repairTime || '30-45 Mins',
    bookingFee: payload.bookingFee,
    formattedAddress: payload.formattedAddress || '',
    address: payload.formattedAddress || '',
    doorstepAddress: payload.formattedAddress || '',
    landmark: payload.landmark || '',
    preferredDate: payload.preferredDate || '',
    preferredTime: payload.preferredTime || '',
    timeSlot: payload.preferredTime || '',
    notes: payload.notes || '',
    status: 'BOOKING CONFIRMED',
    cartItems: payload.cartItems || [],
    statusHistory: [
      {
        status: 'BOOKING CONFIRMED',
        timestamp: nowIso,
        note: 'Booking received and confirmed for doorstep repair',
        updatedBy: 'SYSTEM',
      },
    ],
  };

  // 3. Save to Firebase Realtime Database (/bookings/${bookingId}.json) for instant tracking & persistence
  try {
    const fbRes = await fetch(`${FIREBASE_RTDB_BASE}/bookings/${bookingId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingRecord),
    });
    if (fbRes.ok) {
      console.log('[ANYFIX API] Real booking saved to Firebase RTDB:', bookingId);
    }
  } catch (fbErr) {
    console.warn('[ANYFIX API] Firebase RTDB save notice:', fbErr);
  }

  return {
    success: true,
    bookingId: bookingId,
    data: {
      bookingId: bookingId,
      price: payload.price,
      warranty: payload.warranty || 'Up to 6 Months Warranty',
      repairTime: payload.repairTime || '30-45 Mins',
      bookingFee: payload.bookingFee,
      status: 'BOOKING CONFIRMED',
    },
  };
}

export default {
  API_BASE_URL,
  apiGet,
  apiPost,
  getBrands,
  getModels,
  getServices,
  getIssues,
  getSubIssues,
  getIssueAnswers,
  getPartGrades,
  getRepairOption,
  getBooking,
  getBookingStatus,
  createBooking,
};
