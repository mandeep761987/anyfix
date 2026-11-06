/**
 * ANYFIX — Single API Service Layer
 * Shared engine interfaces connecting directly to Google Apps Script Web App.
 * Pure live data architecture: Brand and Model fetched dynamically from Google Sheet.
 */

import { env, normalizeGoogleScriptUrl } from '../config/env';
import type {
  ApiResponse,
  BookingPublicTracking,
  UpdateBookingStatusPayload,
  BookingStatusRecord,
  BookingStatus,
  PartTypeDetail,
  PartTypesResponseData,
  CreateBookingPayload,
  BookingSubmissionResult,
} from '../types/anyfix';

import { API_BASE_URL } from '../services/anyfixApi';
export { API_BASE_URL };

console.log('[ANYFIX] API_BASE_URL:', API_BASE_URL);

/**
 * Diagnostic test function for checking Google Apps Script connectivity
 * Performs direct GET request to test browser -> Apps Script connection
 */
export async function testAnyfixApiConnection() {
  try {
    const url = `${API_BASE_URL}?action=getBrands`;

    console.log('[ANYFIX TEST] Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });

    console.log('[ANYFIX TEST] HTTP status:', response.status);
    console.log('[ANYFIX TEST] Response URL:', response.url);

    const text = await response.text();

    console.log('[ANYFIX TEST] Raw response:', text);

    let json;

    try {
      json = JSON.parse(text);
    } catch {
      throw new Error('ANYFIX API returned non-JSON response: ' + text);
    }

    console.log('[ANYFIX TEST] JSON:', json);

    return json;
  } catch (error) {
    console.warn('[ANYFIX TEST] Connection check notice:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Execute a GET request to the Google Apps Script Web App
 * Uses simple browser fetch without custom headers as required:
 * const response = await fetch(url, { method: "GET", redirect: "follow" });
 * const data = await response.json();
 */
async function fetchGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: Failed to reach Google Apps Script`,
        message: `HTTP ${response.status}: Failed to reach Google Apps Script`,
      };
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      // In case server returned text error or HTML
      const text = await response.text();
      let cleanErr = text;
      if (text.includes('ReferenceError') || text.includes('TypeError') || text.includes('Error')) {
        const match =
          text.match(/(?:ReferenceError|TypeError|Error):[^\n<]+/i) ||
          text.match(/<div[^>]*class="errorMessage"[^>]*>([\s\S]*?)<\/div>/i) ||
          text.match(/<div[^>]*>([^<]*(?:ReferenceError|TypeError)[^<]*)<\/div>/i);
        if (match) {
          cleanErr = match[0].replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').trim();
        }
      }
      return {
        success: false,
        error: cleanErr,
        message: cleanErr,
      };
    }

    if (data && typeof data === 'object') {
      if (data.success === true) {
        return data as ApiResponse<T>;
      }
      if (data.success === false) {
        return {
          success: false,
          error: data.message || data.error || 'Action failed on server',
          message: data.message || data.error || 'Action failed on server',
        };
      }
      if (data.error || data.message) {
        return {
          success: false,
          error: String(data.message || data.error),
          message: String(data.message || data.error),
        };
      }
      if (data.status === 'success' && 'data' in data) {
        return {
          success: true,
          data: data.data as T,
        };
      }
      return {
        success: true,
        data: (data.data !== undefined ? data.data : data) as T,
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error: any) {
    console.warn('[ANYFIX API NOTICE]', {
      name: error?.name,
      message: error?.message,
    });
    return {
      success: false,
      error:
        error?.message === 'Failed to fetch'
          ? 'Unable to connect to Google Apps Script. Please verify the Web App deployment and script configuration.'
          : error?.message || 'Failed to fetch',
      message:
        error?.message === 'Failed to fetch'
          ? 'Unable to connect to Google Apps Script. Please verify the Web App deployment and script configuration.'
          : error?.message || 'Failed to fetch',
    };
  }
}

/**
 * Execute a POST request to the Google Apps Script Web App
 */
async function fetchPost<T>(
  action: string,
  payload: Record<string, unknown>
): Promise<ApiResponse<T>> {
  const apiUrl = normalizeGoogleScriptUrl(env.getApiUrl());

  if (!apiUrl || apiUrl.trim().length === 0) {
    return {
      success: false,
      error: 'Google Apps Script Web App URL is not configured.',
    };
  }

  try {
    const bodyData = {
      action,
      ...payload,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(bodyData),
      redirect: 'follow',
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: Request failed on server.`,
      };
    }

    const json = await response.json();

    if (json && typeof json === 'object') {
      if (json.success === true) {
        return json as ApiResponse<T>;
      }
      if (json.success === false) {
        return {
          success: false,
          error: json.error || 'Server rejected request',
        };
      }
      if (json.error) {
        return {
          success: false,
          error: String(json.error),
        };
      }
      if (json.status === 'success' && 'data' in json) {
        return {
          success: true,
          data: json.data as T,
        };
      }
      return {
        success: true,
        data: json as T,
      };
    }

    return {
      success: true,
      data: json as T,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network failure contacting API.';
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                          Live Google Sheet Endpoints                        */
/* -------------------------------------------------------------------------- */

/**
 * Fetch all unique Brands from Google Sheet (PRICE_LIST sheet, Active = Yes)
 * Endpoint: GET ?action=getBrands
 */
export async function getBrands(): Promise<ApiResponse<string[]>> {
  const url = `${API_BASE_URL}?action=getBrands`;
  const res = await fetchGet<unknown>(url);

  if (!res.success) {
    return {
      success: false,
      error: res.error || 'Failed to fetch brands from Google Sheet.',
      message: res.message || res.error || 'Failed to fetch brands from Google Sheet.',
    };
  }

  const raw = res.data;
  let items: unknown[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.brands)) items = obj.brands;
    else if (Array.isArray(obj.data)) items = obj.data;
  }

  const resultBrands: string[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    let brandName = '';
    if (typeof item === 'string') {
      brandName = item.trim();
    } else if (item && typeof item === 'object') {
      const rec = item as Record<string, unknown>;
      // Only keep Active rows if active flag is present
      if (rec.active !== undefined && rec.active !== null) {
        const act = String(rec.active).trim().toLowerCase();
        if (act !== 'true' && act !== 'yes' && act !== '1') {
          continue;
        }
      }
      brandName = String(rec.Brand ?? rec.brand ?? rec.BRAND ?? rec.name ?? '').trim();
    }

    if (
      brandName &&
      brandName !== '[object Object]' &&
      brandName.toLowerCase() !== 'brand' &&
      brandName.toLowerCase() !== 'null' &&
      brandName.toLowerCase() !== 'undefined'
    ) {
      const lower = brandName.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        resultBrands.push(brandName);
      }
    }
  }

  if (resultBrands.length > 0) {
    return { success: true, data: resultBrands };
  }

  return {
    success: false,
    error: 'No active brands returned from Google Sheet.',
  };
}

/**
 * Fetch all Models for a specific Brand from Google Sheet (PRICE_LIST sheet, Active = Yes)
 * Endpoint: GET ?action=getModels&brand=<encoded brand>
 */
export async function getModels(brand: string): Promise<ApiResponse<string[]>> {
  const selectedBrand = String(brand || '').trim();
  if (!selectedBrand) {
    return { success: true, data: [] };
  }

  const url = `${API_BASE_URL}?action=getModels&brand=${encodeURIComponent(selectedBrand)}`;
  const res = await fetchGet<unknown>(url);

  if (!res.success) {
    return {
      success: false,
      error: res.error || `Failed to fetch models for ${selectedBrand}`,
      message: res.message || res.error,
    };
  }

  const raw = res.data;
  let items: unknown[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.models)) items = obj.models;
    else if (Array.isArray(obj.data)) items = obj.data;
  }

  const resultModels: string[] = [];
  const seen = new Set<string>();
  const normSelected = selectedBrand.toLowerCase().replace(/\s+/g, '');

  for (const item of items) {
    if (!item) continue;

    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (
        !trimmed ||
        trimmed === '[object Object]' ||
        trimmed.toLowerCase() === 'model' ||
        trimmed.toLowerCase() === 'null' ||
        trimmed.toLowerCase() === 'undefined'
      ) {
        continue;
      }
      const lower = trimmed.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        resultModels.push(trimmed);
      }
      continue;
    }

    if (typeof item === 'object') {
      const rec = item as Record<string, unknown>;
      // Respect Active = Yes
      if (rec.active !== undefined && rec.active !== null) {
        const act = String(rec.active).trim().toLowerCase();
        if (act !== 'true' && act !== 'yes' && act !== '1') {
          continue;
        }
      }

      // Check matching brand if present
      const rowBrand = String(rec.Brand ?? rec.brand ?? rec.BRAND ?? '').trim().toLowerCase().replace(/\s+/g, '');
      if (rowBrand && rowBrand !== normSelected) {
        continue;
      }

      const modelName = String(rec.Model ?? rec.model ?? rec.MODEL ?? rec.device ?? '').trim();
      if (
        !modelName ||
        modelName === '[object Object]' ||
        modelName.toLowerCase() === 'model' ||
        modelName.toLowerCase() === 'null' ||
        modelName.toLowerCase() === 'undefined'
      ) {
        continue;
      }

      const lower = modelName.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        resultModels.push(modelName);
      }
    }
  }

  if (resultModels.length > 0) {
    return { success: true, data: resultModels };
  }

  return {
    success: false,
    error: `No active models found for ${selectedBrand} in Google Sheet.`,
  };
}

/**
 * Fetch repair services for a brand and model from Google Sheet (Active = Yes)
 * Endpoint: GET ?action=getServices&brand=<encoded brand>&model=<encoded model>
 */
export async function getServices(brand: string, model: string): Promise<ApiResponse<string[]>> {
  const normBrand = String(brand || '').trim();
  const normModel = String(model || '').trim();

  if (!normBrand || !normModel) {
    return { success: true, data: [] };
  }

  const url = `${API_BASE_URL}?action=getServices&brand=${encodeURIComponent(normBrand)}&model=${encodeURIComponent(normModel)}`;
  const res = await fetchGet<unknown>(url);

  if (!res.success) {
    return {
      success: false,
      error: res.error || `Failed to fetch services for ${normModel}`,
      message: res.message || res.error,
    };
  }

  const raw = res.data;
  let items: unknown[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.services)) items = obj.services;
    else if (Array.isArray(obj.data)) items = obj.data;
  }

  const resultServices: string[] = [];
  const seen = new Set<string>();
  const bLower = normBrand.toLowerCase().replace(/\s+/g, '');
  const mLower = normModel.toLowerCase().replace(/\s+/g, '');

  for (const item of items) {
    if (!item) continue;

    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (!trimmed || trimmed.toLowerCase() === 'service' || seen.has(trimmed.toLowerCase())) continue;
      seen.add(trimmed.toLowerCase());
      resultServices.push(trimmed);
      continue;
    }

    if (typeof item === 'object') {
      const rec = item as Record<string, unknown>;
      // Check Active = Yes
      if (rec.active !== undefined && rec.active !== null) {
        const act = String(rec.active).trim().toLowerCase();
        if (act !== 'true' && act !== 'yes' && act !== '1') continue;
      }

      const rowBrand = String(rec.Brand ?? rec.brand ?? '').trim().toLowerCase().replace(/\s+/g, '');
      const rowModel = String(rec.Model ?? rec.model ?? '').trim().toLowerCase().replace(/\s+/g, '');

      if (rowBrand && rowBrand !== bLower) continue;
      if (rowModel && rowModel !== mLower) continue;

      const s = String(rec.Service ?? rec.service ?? rec.repair ?? '').trim();
      if (!s || s.toLowerCase() === 'service' || seen.has(s.toLowerCase())) continue;
      seen.add(s.toLowerCase());
      resultServices.push(s);
    }
  }

  if (resultServices.length > 0) {
    return { success: true, data: resultServices };
  }

  return {
    success: false,
    error: `No active services found for ${normModel} in Google Sheet.`,
  };
}

/**
 * Fetch part types / grades for brand, model, and service from Google Sheet
 * Endpoint: GET ?action=getPartGrades&brand=<encoded brand>&model=<encoded model>&service=<encoded service>
 */
export async function getPartGrades(
  brand: string,
  model: string,
  service: string
): Promise<ApiResponse<PartTypesResponseData>> {
  const normBrand = String(brand || '').trim();
  const normModel = String(model || '').trim();
  const normService = String(service || '').trim();

  if (!normBrand || !normModel || !normService) {
    return { success: true, data: { partTypes: [], details: [] } };
  }

  const url = `${API_BASE_URL}?action=getPartGrades&brand=${encodeURIComponent(normBrand)}&model=${encodeURIComponent(normModel)}&service=${encodeURIComponent(normService)}`;
  let res = await fetchGet<unknown>(url);

  // Fallback if backend router has getPartTypes
  if (!res.success) {
    const fallbackUrl = `${API_BASE_URL}?action=getPartTypes&brand=${encodeURIComponent(normBrand)}&model=${encodeURIComponent(normModel)}&service=${encodeURIComponent(normService)}`;
    res = await fetchGet<unknown>(fallbackUrl);
  }

  if (!res.success) {
    return {
      success: false,
      error: res.error || 'Failed to fetch part grades from Google Sheet.',
      message: res.message || res.error,
    };
  }

  const raw = res.data;
  let items: unknown[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.data)) items = obj.data;
    else if (Array.isArray(obj.details)) items = obj.details;
    else if (Array.isArray(obj.partTypes)) items = obj.partTypes;
    else if (Array.isArray(obj.grades)) items = obj.grades;
  }

  const resultTypes: string[] = [];
  const detailsList: PartTypeDetail[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    if (!item) continue;
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (!trimmed || seen.has(trimmed.toLowerCase())) continue;
      seen.add(trimmed.toLowerCase());
      resultTypes.push(trimmed);
      detailsList.push({
        partType: trimmed,
        partGrade: trimmed,
        price: 0,
        warranty: '',
        repairTime: '',
        bookingFee: 0,
      });
      continue;
    }

    if (typeof item === 'object') {
      const rec = item as Record<string, unknown>;
      const pt = String(
        rec.partGrade ?? rec.PartGrade ?? rec.partType ?? rec.grade ?? rec.type ?? ''
      ).trim();

      if (!pt || seen.has(pt.toLowerCase())) continue;
      seen.add(pt.toLowerCase());
      resultTypes.push(pt);

      detailsList.push({
        partType: pt,
        partGrade: pt,
        price: Number(rec.price ?? rec.Price ?? rec.cost ?? 0),
        warranty: String(rec.warranty ?? rec.Warranty ?? '').trim(),
        repairTime: String(rec.repairTime ?? rec.RepairTime ?? rec.time ?? '').trim(),
        bookingFee: Number(rec.bookingFee ?? rec.BookingFee ?? 0),
      });
    }
  }

  if (resultTypes.length > 0) {
    return {
      success: true,
      data: {
        partTypes: resultTypes,
        details: detailsList,
      },
    };
  }

  return {
    success: false,
    error: `No part grades found for ${normService} in Google Sheet.`,
  };
}

export const getPartTypes = getPartGrades;

/**
 * Fetch exact repair option for Brand + Model + Service + Part Grade from PRICE_LIST
 * Endpoint: GET ?action=getRepairOption&brand=<encoded brand>&model=<encoded model>&service=<encoded service>&partGrade=<encoded partGrade>
 */
export async function getRepairOption(
  brand: string,
  model: string,
  service: string,
  partGrade: string
): Promise<ApiResponse<PartTypeDetail>> {
  const normBrand = String(brand || '').trim();
  const normModel = String(model || '').trim();
  const normService = String(service || '').trim();
  const normGrade = String(partGrade || '').trim();

  const url = `${API_BASE_URL}?action=getRepairOption&brand=${encodeURIComponent(normBrand)}&model=${encodeURIComponent(normModel)}&service=${encodeURIComponent(normService)}&partGrade=${encodeURIComponent(normGrade)}`;
  return fetchGet<PartTypeDetail>(url);
}

/**
 * Fetch full active catalogue to compute live model counts per brand
 * Endpoint: GET ?action=getCatalogue
 */
export async function getCatalogue(): Promise<ApiResponse<Array<{ brand: string; model: string; active?: boolean }>>> {
  const url = `${API_BASE_URL}?action=getCatalogue`;
  const res = await fetchGet<unknown>(url);
  if (!res.success || !res.data) {
    return { success: false, error: res.error || 'Failed to fetch catalogue.' };
  }

  let items: unknown[] = [];
  if (Array.isArray(res.data)) {
    items = res.data;
  } else if (res.data && typeof res.data === 'object') {
    const obj = res.data as Record<string, unknown>;
    if (Array.isArray(obj.data)) items = obj.data;
    else if (Array.isArray(obj.items)) items = obj.items;
  }

  const rows: Array<{ brand: string; model: string; active?: boolean }> = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const brand = String(rec.brand || rec.Brand || '').trim();
    const model = String(rec.model || rec.Model || '').trim();
    if (brand && model) {
      rows.push({
        brand,
        model,
        active: rec.active !== undefined ? Boolean(rec.active) : true,
      });
    }
  }

  return { success: true, data: rows };
}

/* -------------------------------------------------------------------------- */
/*                                Order Tracking                              */
/* -------------------------------------------------------------------------- */

/**
 * Track an existing repair booking by Booking ID
 * Endpoint: GET ?action=getBooking&bookingId={bookingId}
 */
export async function getBooking(bookingId: string): Promise<ApiResponse<BookingPublicTracking | null>> {
  const cleanId = String(bookingId || '').trim();
  const url = `${API_BASE_URL}?action=getBookingStatus&bookingId=${encodeURIComponent(cleanId)}`;
  const res = await fetchGet<Record<string, unknown>>(url);
  
  if (res.success && res.data) {
    const raw = res.data as Record<string, unknown>;
    const rawHistory = (raw.statusHistory || raw.history || []) as Array<Record<string, unknown>>;
    const statusHistory =
      Array.isArray(rawHistory) && rawHistory.length > 0
        ? rawHistory.map((h) => ({
            status: (String(h.status || '') as BookingStatus),
            timestamp: String(h.timestamp || h.updatedAt || new Date().toISOString()),
            note: h.note ? String(h.note) : undefined,
          }))
        : [];

    const normalized: BookingPublicTracking = {
      bookingId: String(raw.bookingId || raw.id || cleanId),
      createdAt: String(raw.createdAt || new Date().toISOString()),
      brand: String(raw.brand || (raw.device as Record<string, string>)?.brand || ''),
      model: String(raw.model || (raw.device as Record<string, string>)?.model || ''),
      service: String(raw.service || (raw.repair as Record<string, string>)?.service || ''),
      partGrade: String(raw.partGrade || (raw.repair as Record<string, string>)?.partGrade || ''),
      quotedPrice: Number(raw.quotedPrice ?? raw.price ?? 0),
      warranty: String(raw.warranty || '6 Months'),
      repairTime: String(raw.repairTime || raw.time || '30 mins'),
      city: String(raw.city || 'Delhi NCR'),
      customerName: raw.customerName ? String(raw.customerName) : undefined,
      phone: raw.phone ? String(raw.phone) : undefined,
      address: raw.address ? String(raw.address) : (raw.doorstepAddress ? String(raw.doorstepAddress) : undefined),
      landmark: raw.landmark ? String(raw.landmark) : undefined,
      notes: raw.notes ? String(raw.notes) : undefined,
      preferredDate: raw.preferredDate ? String(raw.preferredDate) : undefined,
      preferredTime: raw.preferredTime ? String(raw.preferredTime) : undefined,
      currentStatus: (String(raw.currentStatus || raw.status || '') as BookingStatus),
      statusHistory,
    };

    return {
      success: true,
      data: normalized,
    };
  }

  return {
    success: false,
    error: res.error || `No booking found for ID ${cleanId}`,
  };
}

/**
 * Create a new repair booking
 * Single Source of Truth: BOOKINGS Google Sheet.
 * Generates sequential ID (AFX-YYYYMMDD-0001) directly from Column A of the sheet.
 * Endpoint: POST with exact payload
 */
/**
 * Create a new repair booking
 * Single Source of Truth: BOOKINGS Google Sheet.
 * Generates sequential ID (AFX-YYYYMMDD-0001) directly from Column A of the sheet.
 * Endpoint: POST to API_BASE_URL (action inside JSON body only)
 */
export async function createBooking(
  payload: CreateBookingPayload
): Promise<ApiResponse<BookingSubmissionResult>> {
  const apiUrl = normalizeGoogleScriptUrl(env.getApiUrl()) || API_BASE_URL;

  // Build exact payload specified in API contract
  const requestPayload = {
    action: 'createBooking',
    customer: {
      name: (payload.customerName || '').trim(),
      phone: (payload.phone || '').trim(),
    },
    device: {
      brand: (payload.brand || '').trim(),
      model: (payload.model || '').trim(),
    },
    repair: {
      service: (payload.service || '').trim(),
      partGrade: (payload.partGrade || '').trim(),
    },
    formattedAddress: (payload.formattedAddress || payload.address || '').trim(),
    landmark: (payload.landmark || '').trim(),
    preferredDate: (payload.preferredDate || '').trim(),
    preferredTime: (payload.preferredTime || '').trim(),
    notes: (payload.notes || '').trim(),
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(requestPayload),
      redirect: 'follow',
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Unable to connect to booking service. Please try again.',
        message: 'Unable to connect to booking service. Please try again.',
      };
    }

    const text = await response.text();
    let result: any;
    try {
      result = JSON.parse(text);
    } catch {
      return {
        success: false,
        error: 'Unable to connect to booking service. Please try again.',
        message: 'Unable to connect to booking service. Please try again.',
      };
    }

    if (result && result.success === true) {
      const data = result.data || {};
      const realBookingId = String(
        result.bookingId ||
        data.bookingId ||
        ''
      ).trim();

      if (!realBookingId) {
        return {
          success: false,
          error: result.message || result.error || 'Unable to connect to booking service. Please try again.',
          message: result.message || result.error || 'Unable to connect to booking service. Please try again.',
        };
      }

      const submissionResult: BookingSubmissionResult = {
        bookingId: realBookingId,
        status: String(data.status || 'PENDING'),
        createdAt: String(data.createdAt || new Date().toISOString()),
        customerName: payload.customerName,
        phone: payload.phone,
        brand: payload.brand,
        model: payload.model,
        service: payload.service,
        partGrade: payload.partGrade,
        price: Number(data.price ?? payload.quotedPrice ?? 0),
        warranty: String(data.warranty || payload.warranty || '6 Months'),
        repairTime: String(data.repairTime || payload.repairTime || '40 mins'),
        address: (payload.formattedAddress || payload.address || '').trim(),
        preferredDate: payload.preferredDate,
        preferredTime: payload.preferredTime,
      };

      // Cache locally for instant Track Repair lookup
      if (typeof window !== 'undefined' && window.localStorage && realBookingId) {
        try {
          const cache = JSON.parse(window.localStorage.getItem('anyfix_bookings_cache') || '{}');
          cache[realBookingId.toUpperCase()] = {
            ...submissionResult,
            quotedPrice: submissionResult.price,
            currentStatus: submissionResult.status,
            statusHistory: [
              {
                status: submissionResult.status as BookingStatus,
                timestamp: submissionResult.createdAt,
                note: 'Booking registered and pending technician assignment',
              },
            ],
          };
          window.localStorage.setItem('anyfix_bookings_cache', JSON.stringify(cache));
        } catch {
          // Ignore cache errors
        }
      }

      return {
        success: true,
        bookingId: realBookingId,
        data: submissionResult,
      };
    }

    // result.success !== true: show backend error without generating fake booking
    return {
      success: false,
      error:
        (result && (result.message || result.error)) ||
        'Unable to connect to booking service. Please try again.',
      message:
        (result && (result.message || result.error)) ||
        'Unable to connect to booking service. Please try again.',
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: 'Unable to connect to booking service. Please try again.',
      message: 'Unable to connect to booking service. Please try again.',
    };
  }
}

/**
 * Update booking status
 * Endpoint: POST ?action=updateBookingStatus
 */
export async function updateBookingStatus(
  payload: UpdateBookingStatusPayload
): Promise<ApiResponse<BookingStatusRecord>> {
  return fetchPost<BookingStatusRecord>('updateBookingStatus', payload as unknown as Record<string, unknown>);
}

export const anyfixApi = {
  getBrands,
  getModels,
  getServices,
  getPartGrades,
  getPartTypes,
  getRepairOption,
  getCatalogue,
  getBooking,
  createBooking,
  updateBookingStatus,
};

export default anyfixApi;
