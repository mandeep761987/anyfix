/**
 * Environment configuration for ANYFIX application.
 * Defines access to the single Google Apps Script Web App endpoint.
 */

import { API_BASE_URL } from '../services/anyfixApi';

const DEFAULT_ANYFIX_API_URL = API_BASE_URL;

const STORAGE_KEY = 'anyfix_api_url_override';

/**
 * Normalizes any Google Apps Script input (full URL, script ID, or partial URL)
 * into a valid, absolute Web App endpoint URL.
 */
export function normalizeGoogleScriptUrl(raw: string | undefined | null): string {
  if (!raw) return DEFAULT_ANYFIX_API_URL;
  let trimmed = String(raw).trim();
  if (!trimmed) return DEFAULT_ANYFIX_API_URL;

  // Remove quotes if present
  trimmed = trimmed.replace(/^["']|["']$/g, '').trim();

  // If already a valid absolute HTTP/HTTPS URL
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    if (trimmed.includes('script.google.com/macros/s/') && !trimmed.endsWith('/exec')) {
      return trimmed.endsWith('/') ? `${trimmed}exec` : `${trimmed}/exec`;
    }
    return trimmed;
  }

  // If starts with script.google.com
  if (trimmed.startsWith('script.google.com')) {
    const full = `https://${trimmed}`;
    if (!full.endsWith('/exec')) {
      return full.endsWith('/') ? `${full}exec` : `${full}/exec`;
    }
    return full;
  }

  // If it is just the deployment ID (e.g. AKfycbz2MJBkXWqUgKbq0dnMeiG1hviQAfcjnMzjtjvs-9Vlrp2gexV2-uZPESBlR8hxBgpIRg)
  const cleanId = trimmed.replace(/\/exec$/, '').replace(/^\/+|\/+$/g, '');
  return `https://script.google.com/macros/s/${cleanId}/exec`;
}

export const env = {
  /**
   * Get the active Google Apps Script Web App deployment endpoint.
   * Prioritizes localStorage override, VITE_ANYFIX_API_URL, or the official default Web App URL.
   */
  getApiUrl: (): string => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored.trim().length > 0) {
        return normalizeGoogleScriptUrl(stored);
      }
    } catch {
      // Ignore localStorage errors (e.g. sandboxed iframe)
    }
    const envUrl = import.meta.env.VITE_ANYFIX_API_URL as string | undefined;
    if (envUrl && envUrl.trim().length > 0) {
      return normalizeGoogleScriptUrl(envUrl);
    }
    return DEFAULT_ANYFIX_API_URL;
  },

  /**
   * Save a custom API URL to localStorage for live testing in preview.
   */
  setApiUrl: (url: string): void => {
    try {
      if (url && url.trim()) {
        const normalized = normalizeGoogleScriptUrl(url.trim());
        localStorage.setItem(STORAGE_KEY, normalized);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  },

  /**
   * Check if the backend API URL is configured.
   */
  isApiConfigured: (): boolean => {
    const url = env.getApiUrl();
    return Boolean(url && url.trim().length > 0);
  },
};


