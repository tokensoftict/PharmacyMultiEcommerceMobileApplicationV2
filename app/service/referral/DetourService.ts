import { Dimensions, PixelRatio, Platform, Linking } from 'react-native';
import ReferralStorage from './ReferralStorage';

/**
 * DetourService — Deferred & Direct Referral Deep Linking
 *
 * Detour App ID  : 5d4bb267-2391-425b-84fc-74f743098589
 * Detour API Key : 7a49c76181d89861d600b440e28a4788f88b1800b81c81663350ead690de411b
 *
 * REFERRAL LINK FLOW
 * ──────────────────
 * 1. Referrer shares:   http://referral.generaldrugcentre.com/ref/{code}
 *    └─ Server redirects to: https://psgdc.godetour.link/PrdRthERNv/ref/{code}
 * 2. Direct link (App installed) → Opened via Linking universal/app link.
 * 3. Deferred link (App freshly installed) → Detour matching API resolves the link.
 * 4. Extracted referral code is saved to ReferralStorage for registration.
 */

const DETOUR_APP_ID = '5d4bb267-2391-425b-84fc-74f743098589';
const DETOUR_API_KEY = '7a49c76181d89861d600b440e28a4788f88b1800b81c81663350ead690de411b';
const DETOUR_API_URL = 'https://godetour.dev/api/link/match-link';
const DETOUR_LINK_PREFIX = 'psgdc.godetour.link';

/**
 * Extracts referral code from URL/path
 * Matches: /ref/GDC1234567 or detour://.../ref/GDC1234567
 */
function extractReferralCode(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/ref\/([A-Z0-9]{8,12})/i);
  return match ? match[1].toUpperCase() : null;
}

function isReferralUrl(url: string): boolean {
  if (!url) return false;
  return url.includes(DETOUR_LINK_PREFIX) || url.includes('/ref/');
}

/**
 * Match deferred deep link against Detour API with timeout
 */
async function fetchDeferredLink(): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const { width, height } = Dimensions.get('screen');
    const body = {
      platform: Platform.OS,
      systemVersion: String(Platform.Version),
      screenWidth: width,
      screenHeight: height,
      scale: PixelRatio.get(),
      locale: [{ languageTag: 'en-US' }],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      userAgent: 'PSGDC-App',
      timestamp: Date.now(),
    };

    const response = await fetch(DETOUR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DETOUR_API_KEY}`,
        'X-App-ID': DETOUR_APP_ID,
        'X-SDK': 'react-native@2.3.1',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data?.link || data?.route || null;
    }
  } catch (e) {
    // Timeout or network error — non-blocking
  } finally {
    clearTimeout(timeoutId);
  }

  return null;
}

const DetourService = {
  /**
   * Initialise referral link detection.
   * Safe to call on startup — runs with timeout protection and will never hang.
   */
  initialize: async (): Promise<void> => {
    try {
      // 1. Check direct initial URL (e.g. app opened directly from a referral link)
      const directUrl = await Promise.race([
        Linking.getInitialURL(),
        new Promise<null>((res) => setTimeout(() => res(null), 1000)),
      ]);

      if (directUrl && isReferralUrl(directUrl)) {
        const code = extractReferralCode(directUrl);
        if (code) {
          await ReferralStorage.set(code);
          console.log('[DetourService] Direct referral code stored:', code);
          return;
        }
      }

      // 2. Check deferred link via Detour API
      const deferredLink = await fetchDeferredLink();
      if (deferredLink && isReferralUrl(deferredLink)) {
        const code = extractReferralCode(deferredLink);
        if (code) {
          await ReferralStorage.set(code);
          console.log('[DetourService] Deferred referral code stored:', code);
        }
      }

      // 3. Listen for live incoming referral links while the app is active
      Linking.addEventListener('url', async ({ url }) => {
        if (url && isReferralUrl(url)) {
          const code = extractReferralCode(url);
          if (code) {
            await ReferralStorage.set(code);
            console.log('[DetourService] Live referral code stored:', code);
          }
        }
      });
    } catch (e) {
      console.warn('[DetourService] Init warning:', e);
    }
  },
};

export default DetourService;

