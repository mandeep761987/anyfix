/**
 * Isolated Location & Reverse-Geocoding Utility
 * 
 * Provides browser geolocation extraction and human-readable reverse geocoding.
 * Kept isolated so it can be swapped with Google Maps, Mapbox, or other providers
 * during backend/API integration without touching UI components.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationResult {
  coords: Coordinates;
  address?: string;
  error?: string;
}

/**
 * Reverse-geocodes latitude and longitude into a human-readable street address.
 * Uses standard HTTPS reverse-geocoding service with a safe timeout and fallback.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      latitude
    )}&lon=${encodeURIComponent(longitude)}&zoom=18&addressdetails=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.address) {
      const addr = data.address;
      const parts: string[] = [];

      // Building / House
      const place = addr.building || addr.house_number || addr.amenity || addr.shop;
      if (place) parts.push(place);

      // Road / Street
      const road = addr.road || addr.street || addr.pedestrian || addr.footway;
      if (road) parts.push(road);

      // Area / Suburb / Locality
      const area = addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict;
      if (area && !parts.includes(area)) parts.push(area);

      // City / Town
      const city = addr.city || addr.town || addr.village || addr.county;
      if (city && !parts.includes(city)) parts.push(city);

      // State
      const state = addr.state;
      if (state && !parts.includes(state)) parts.push(state);

      // Postcode
      const postcode = addr.postcode;
      if (postcode) parts.push(postcode);

      // Country
      const country = addr.country;
      if (country && !parts.includes(country)) parts.push(country);

      if (parts.length > 0) {
        return parts.join(', ');
      }
    }

    if (data && data.display_name) {
      return data.display_name;
    }

    return '';
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    console.warn('[LocationService] Reverse geocoding warning:', err);
    return '';
  }
}

/**
 * Executes browser navigator.geolocation.getCurrentPosition with high accuracy.
 */
export function getCurrentBrowserLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GEOLOCATION_UNSUPPORTED'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
