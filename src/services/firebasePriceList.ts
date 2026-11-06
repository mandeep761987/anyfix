/**
 * ANYFIX — Firebase Realtime Database PRICE_LIST Service
 * 
 * Fetches dynamic catalogue data from Firebase Realtime Database:
 * Database: anyfix-f5837
 * Path: /priceList
 * 
 * Synchronized pipeline: Google Sheet (MASTER) -> Apps Script -> Firebase -> Website
 */

export interface FirebasePriceListItem {
  active?: string;
  bookingFee?: string | number;
  brand?: string;
  issue?: string;
  issueAnswer?: string;
  model?: string;
  partCost?: string | number;
  partGrade?: string;
  price?: number | string;
  repairTime?: string;
  rowNumber?: number;
  service?: string;
  specification?: string;
  subIssue?: string;
  warranty?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

const FIREBASE_PRICE_LIST_ENDPOINT =
  'https://anyfix-f5837-default-rtdb.asia-southeast1.firebasedatabase.app/priceList.json';

// In-memory cache to guarantee zero-latency response for UI hierarchy dropdowns & filters
let cachedRecords: FirebasePriceListItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute fresh cache
let activeFetchPromise: Promise<FirebasePriceListItem[]> | null = null;

/**
 * Fetch all active records from Firebase Realtime Database (/priceList).
 * Filters strictly by active === "Yes".
 */
export async function fetchFirebasePriceList(forceRefresh = false): Promise<FirebasePriceListItem[]> {
  const now = Date.now();
  if (!forceRefresh && cachedRecords && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedRecords;
  }

  if (activeFetchPromise && !forceRefresh) {
    return activeFetchPromise;
  }

  activeFetchPromise = (async () => {
    try {
      const response = await fetch(FIREBASE_PRICE_LIST_ENDPOINT, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Firebase RTDB responded with status ${response.status}`);
      }

      const json = await response.json();
      if (!json) {
        cachedRecords = [];
        cacheTimestamp = Date.now();
        return [];
      }

      // Firebase RTDB stores collections as either arrays or keyed objects
      const rawItems: any[] = Array.isArray(json) ? json.filter(Boolean) : Object.values(json);

      // Filter strictly by active === "Yes" (case-insensitive trim)
      const activeItems: FirebasePriceListItem[] = rawItems
        .filter((item) => {
          if (!item || typeof item !== 'object') return false;
          const activeVal = String(item.active || '').trim().toLowerCase();
          return activeVal === 'yes';
        })
        .map((item) => ({
          active: 'Yes',
          bookingFee: item.bookingFee ?? '',
          brand: String(item.brand || '').trim(),
          issue: String(item.issue || '').trim(),
          issueAnswer: String(item.issueAnswer || '').trim(),
          model: String(item.model || '').trim(),
          partCost: item.partCost ?? '',
          partGrade: String(item.partGrade || '').trim(),
          price: item.price !== undefined && item.price !== null ? item.price : '',
          repairTime: String(item.repairTime || '').trim(),
          rowNumber: typeof item.rowNumber === 'number' ? item.rowNumber : undefined,
          service: String(item.service || '').trim(),
          specification: String(item.specification || '').trim(),
          subIssue: String(item.subIssue || '').trim(),
          warranty: String(item.warranty || '').trim(),
        }));

      cachedRecords = activeItems;
      cacheTimestamp = Date.now();
      return activeItems;
    } catch (err: any) {
      console.error('[ANYFIX FIREBASE] Failed to fetch /priceList:', err);
      // If we have previous cache, return it on network blips
      if (cachedRecords && cachedRecords.length > 0) {
        console.warn('[ANYFIX FIREBASE] Using existing in-memory cache due to network error');
        return cachedRecords;
      }
      throw err;
    } finally {
      activeFetchPromise = null;
    }
  })();

  return activeFetchPromise;
}

/**
 * Fetch available device brands from Firebase Realtime Database.
 */
export async function getBrandsFromFirebase(): Promise<ApiResponse<string[]>> {
  try {
    const records = await fetchFirebasePriceList();
    if (!records || records.length === 0) {
      return { success: false, message: 'No active price list items found in Firebase.', data: [] };
    }

    const brandSet = new Set<string>();
    records.forEach((r) => {
      if (r.brand) brandSet.add(r.brand);
    });

    const brands = Array.from(brandSet).sort((a, b) => a.localeCompare(b));
    return { success: true, data: brands };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to fetch brands from Firebase Realtime Database.',
      data: [],
    };
  }
}

/**
 * Fetch available models for a specific brand from Firebase Realtime Database.
 */
export async function getModelsFromFirebase(brand: string): Promise<ApiResponse<string[]>> {
  try {
    const records = await fetchFirebasePriceList();
    const targetBrand = (brand || '').trim().toLowerCase();

    const modelSet = new Set<string>();
    records.forEach((r) => {
      if (r.brand && r.brand.toLowerCase() === targetBrand && r.model) {
        modelSet.add(r.model);
      }
    });

    const models = Array.from(modelSet).sort((a, b) => a.localeCompare(b));
    return { success: true, data: models };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || `Failed to fetch models for ${brand} from Firebase.`,
      data: [],
    };
  }
}

/**
 * Fetch available repair services for a brand and model from Firebase Realtime Database.
 */
export async function getServicesFromFirebase(brand: string, model: string): Promise<ApiResponse<string[]>> {
  try {
    const records = await fetchFirebasePriceList();
    const targetBrand = (brand || '').trim().toLowerCase();
    const targetModel = (model || '').trim().toLowerCase();

    const serviceSet = new Set<string>();
    records.forEach((r) => {
      if (
        r.brand &&
        r.brand.toLowerCase() === targetBrand &&
        r.model &&
        r.model.toLowerCase() === targetModel &&
        r.service
      ) {
        serviceSet.add(r.service);
      }
    });

    const services = Array.from(serviceSet);
    return { success: true, data: services };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || `Failed to fetch services for ${brand} ${model} from Firebase.`,
      data: [],
    };
  }
}

/**
 * Fetch available issues for a brand, model, and service from Firebase Realtime Database.
 */
export async function getIssuesFromFirebase(
  brand: string,
  model: string,
  service: string
): Promise<ApiResponse<string[]>> {
  try {
    const records = await fetchFirebasePriceList();
    const targetBrand = (brand || '').trim().toLowerCase();
    const targetModel = (model || '').trim().toLowerCase();
    const targetService = (service || '').trim().toLowerCase();

    const issueSet = new Set<string>();
    records.forEach((r) => {
      if (
        r.brand &&
        r.brand.toLowerCase() === targetBrand &&
        r.model &&
        r.model.toLowerCase() === targetModel &&
        r.service &&
        r.service.toLowerCase() === targetService &&
        r.issue
      ) {
        issueSet.add(r.issue);
      }
    });

    const issues = Array.from(issueSet);
    return { success: true, data: issues };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || `Failed to fetch issues for ${service} from Firebase.`,
      data: [],
    };
  }
}

/**
 * Fetch available sub-issues for a brand, model, service, and issue from Firebase Realtime Database.
 */
export async function getSubIssuesFromFirebase(
  brand: string,
  model: string,
  service: string,
  issue: string
): Promise<ApiResponse<string[]>> {
  try {
    const records = await fetchFirebasePriceList();
    const targetBrand = (brand || '').trim().toLowerCase();
    const targetModel = (model || '').trim().toLowerCase();
    const targetService = (service || '').trim().toLowerCase();
    const targetIssue = (issue || '').trim().toLowerCase();

    const subIssueSet = new Set<string>();
    records.forEach((r) => {
      if (
        r.brand &&
        r.brand.toLowerCase() === targetBrand &&
        r.model &&
        r.model.toLowerCase() === targetModel &&
        r.service &&
        r.service.toLowerCase() === targetService &&
        r.issue &&
        r.issue.toLowerCase() === targetIssue &&
        r.subIssue
      ) {
        subIssueSet.add(r.subIssue);
      }
    });

    const subIssues = Array.from(subIssueSet);
    return { success: true, data: subIssues };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || `Failed to fetch sub-issues from Firebase.`,
      data: [],
    };
  }
}

/**
 * Fetch available issue answers for a brand, model, service, issue, and subIssue from Firebase Realtime Database.
 */
export async function getIssueAnswersFromFirebase(
  brand: string,
  model: string,
  service: string,
  issue: string,
  subIssue: string
): Promise<ApiResponse<string[]>> {
  try {
    const records = await fetchFirebasePriceList();
    const targetBrand = (brand || '').trim().toLowerCase();
    const targetModel = (model || '').trim().toLowerCase();
    const targetService = (service || '').trim().toLowerCase();
    const targetIssue = (issue || '').trim().toLowerCase();
    const targetSubIssue = (subIssue || '').trim().toLowerCase();

    const answerSet = new Set<string>();
    records.forEach((r) => {
      if (
        r.brand &&
        r.brand.toLowerCase() === targetBrand &&
        r.model &&
        r.model.toLowerCase() === targetModel &&
        r.service &&
        r.service.toLowerCase() === targetService &&
        r.issue &&
        r.issue.toLowerCase() === targetIssue &&
        (r.subIssue || '').toLowerCase() === targetSubIssue &&
        r.issueAnswer
      ) {
        answerSet.add(r.issueAnswer);
      }
    });

    const answers = Array.from(answerSet);
    return { success: true, data: answers };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || `Failed to fetch issue answers from Firebase.`,
      data: [],
    };
  }
}

/**
 * Fetch available part grades for a specific hierarchy from Firebase Realtime Database.
 */
export async function getPartGradesFromFirebase(
  brand: string,
  model: string,
  service: string,
  issue?: string,
  subIssue?: string,
  issueAnswer?: string
): Promise<ApiResponse<any[]>> {
  try {
    const records = await fetchFirebasePriceList();
    const targetBrand = (brand || '').trim().toLowerCase();
    const targetModel = (model || '').trim().toLowerCase();
    const targetService = (service || '').trim().toLowerCase();
    const targetIssue = issue ? issue.trim().toLowerCase() : '';
    const targetSubIssue = subIssue ? subIssue.trim().toLowerCase() : '';
    const targetAnswer = issueAnswer ? issueAnswer.trim().toLowerCase() : '';

    // Step 1: Base match on Brand + Model + Service
    let matches = records.filter(
      (r) =>
        r.brand &&
        r.brand.toLowerCase() === targetBrand &&
        r.model &&
        r.model.toLowerCase() === targetModel &&
        r.service &&
        r.service.toLowerCase() === targetService
    );

    // Step 2: Progressively narrow by issue if provided
    if (targetIssue) {
      const withIssue = matches.filter((r) => (r.issue || '').toLowerCase() === targetIssue);
      if (withIssue.length > 0) matches = withIssue;
    }

    // Step 3: Narrow by subIssue if provided
    if (targetSubIssue) {
      const withSub = matches.filter((r) => (r.subIssue || '').toLowerCase() === targetSubIssue);
      if (withSub.length > 0) matches = withSub;
    }

    // Step 4: Narrow by issueAnswer if provided
    if (targetAnswer) {
      const withAnswer = matches.filter((r) => (r.issueAnswer || '').toLowerCase() === targetAnswer);
      if (withAnswer.length > 0) matches = withAnswer;
    }

    // Deduplicate by partGrade: keep unique options for the user
    const gradeMap: Record<string, any> = {};
    matches.forEach((item) => {
      const gradeName = (item.partGrade || '').trim();
      if (!gradeName) return;
      const key = gradeName.toLowerCase();
      if (!gradeMap[key]) {
        gradeMap[key] = {
          partGrade: gradeName,
          price: item.price,
          warranty: item.warranty || 'Warranty Included',
          repairTime: item.repairTime || '30–45 Mins',
          bookingFee: item.bookingFee ?? '',
          specification: item.specification || '',
          brand: item.brand,
          model: item.model,
          service: item.service,
          issue: item.issue,
          subIssue: item.subIssue,
          issueAnswer: item.issueAnswer,
          rowNumber: item.rowNumber,
        };
      }
    });

    const list = Object.values(gradeMap);
    return { success: true, data: list };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to fetch part grades from Firebase.',
      data: [],
    };
  }
}

/**
 * Fetch exact repair price, warranty, repair time, and booking fee for a selected configuration from Firebase Realtime Database.
 */
export async function getRepairOptionFromFirebase(
  brand: string,
  model: string,
  service: string,
  partGrade: string,
  issue?: string,
  subIssue?: string,
  issueAnswer?: string
): Promise<ApiResponse<any>> {
  try {
    const records = await fetchFirebasePriceList();
    const targetBrand = (brand || '').trim().toLowerCase();
    const targetModel = (model || '').trim().toLowerCase();
    const targetService = (service || '').trim().toLowerCase();
    const targetGrade = (partGrade || '').trim().toLowerCase();
    const targetIssue = issue ? issue.trim().toLowerCase() : '';
    const targetSubIssue = subIssue ? subIssue.trim().toLowerCase() : '';
    const targetAnswer = issueAnswer ? issueAnswer.trim().toLowerCase() : '';

    // Step 1: Find rows matching Brand + Model + Service + PartGrade
    const baseMatches = records.filter(
      (r) =>
        r.brand &&
        r.brand.toLowerCase() === targetBrand &&
        r.model &&
        r.model.toLowerCase() === targetModel &&
        r.service &&
        r.service.toLowerCase() === targetService &&
        r.partGrade &&
        r.partGrade.toLowerCase() === targetGrade
    );

    if (baseMatches.length === 0) {
      return {
        success: false,
        message: `No matching repair option found for ${brand} ${model} -> ${service} (${partGrade}).`,
      };
    }

    // Step 2: Score best match based on diagnostic answers
    let bestMatch = baseMatches[0];
    let highestScore = -1;

    for (const row of baseMatches) {
      let score = 0;
      const rowIssue = (row.issue || '').toLowerCase();
      const rowSub = (row.subIssue || '').toLowerCase();
      const rowAns = (row.issueAnswer || '').toLowerCase();

      if (targetIssue && rowIssue === targetIssue) score += 4;
      if (targetSubIssue && rowSub === targetSubIssue) score += 2;
      if (targetAnswer && rowAns === targetAnswer) score += 1;

      if (score > highestScore) {
        highestScore = score;
        bestMatch = row;
      }
    }

    return {
      success: true,
      data: {
        brand: bestMatch.brand,
        model: bestMatch.model,
        service: bestMatch.service,
        partGrade: bestMatch.partGrade,
        price: bestMatch.price,
        warranty: bestMatch.warranty || 'Warranty Included',
        repairTime: bestMatch.repairTime || '30–45 Mins',
        bookingFee: bestMatch.bookingFee ?? '',
        specification: bestMatch.specification || '',
        rowNumber: bestMatch.rowNumber,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to calculate repair option from Firebase.',
    };
  }
}
