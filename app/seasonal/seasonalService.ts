import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPERMARKET_URL } from '@env';
import { store } from '@/redux/store/store';
import { normalizeSeasonalConfig, SeasonalConfig } from './seasonalConfig';

const CACHE_KEY_PREFIX = '@seasonal_theme_v1';
const REQUEST_TIMEOUT_MS = 8000;

export interface SeasonalSnapshot {
    config: SeasonalConfig;
    /** serverTime - deviceTime in ms, for accurate countdowns / expiry despite a wrong device clock. */
    skewMs: number;
    savedAt: number;
}

export interface SeasonalUserAuth {
    userId: number | null;
    token: string | null;
}

/**
 * Extracts the currently authenticated user's ID and Sanctum token from the Redux store.
 */
export function getCurrentSeasonalUser(): SeasonalUserAuth {
    try {
        const auth = store.getState()?.systemReducer?.auth;
        if (!auth?.loginStatus) {
            return { userId: null, token: null };
        }
        const rawId = auth?.data?.id ?? auth?.data?.user?.id;
        const userId = typeof rawId === 'number' && rawId > 0 ? rawId : null;
        const token =
            typeof auth?.data?.token?.access_token === 'string' && auth.data.token.access_token
                ? auth.data.token.access_token
                : null;
        return { userId, token };
    } catch {
        return { userId: null, token: null };
    }
}

function cacheKeyFor(userId: number | null): string {
    return `${CACHE_KEY_PREFIX}:u:${userId ?? 'guest'}`;
}

/**
 * The seasonal endpoint is public and lives at `<origin>/api/app/seasonal-theme`,
 * while the app's configured base URLs look like `https://host/api/v1/`.
 * The origin is derived from the existing env config – nothing new to configure.
 */
export function seasonalEndpoint(baseUrl: string | undefined = SUPERMARKET_URL): string | null {
    const match = /^(https?:\/\/[^/]+)/i.exec(baseUrl ?? '');
    return match ? `${match[1]}/api/app/seasonal-theme` : null;
}

export async function loadCachedSnapshot(userId: number | null = getCurrentSeasonalUser().userId): Promise<SeasonalSnapshot | null> {
    try {
        const raw = await AsyncStorage.getItem(cacheKeyFor(userId));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return {
            config: normalizeSeasonalConfig(parsed?.data),
            skewMs: Number.isFinite(parsed?.skewMs) ? parsed.skewMs : 0,
            savedAt: Number(parsed?.savedAt) || 0,
        };
    } catch {
        return null;
    }
}

/**
 * Fetches the live configuration for the current user (or guest). Resolves `null` on any failure
 * (offline, 5xx, bad payload) so callers keep whatever they already have.
 */
export async function fetchSeasonalSnapshot(): Promise<SeasonalSnapshot | null> {
    const url = seasonalEndpoint();
    if (!url) return null;

    const { userId, token } = getCurrentSeasonalUser();

    try {
        const deviceBefore = Date.now();
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await axios.get(url, {
            timeout: REQUEST_TIMEOUT_MS,
            headers,
            params: userId ? { user_id: userId } : undefined,
        });
        const body = res?.data;
        if (!body || (body.status !== true && body.success !== true) || typeof body.data !== 'object') {
            return null;
        }

        const serverMs = Date.parse(body.server_time);
        const deviceMid = (deviceBefore + Date.now()) / 2;
        const skewMs = Number.isFinite(serverMs) ? Math.round(serverMs - deviceMid) : 0;
        const snapshot: SeasonalSnapshot = {
            config: normalizeSeasonalConfig(body.data),
            skewMs,
            savedAt: Date.now(),
        };

        // Persist per-user so switching accounts or logging out never leaks a user-specific theme.
        AsyncStorage.setItem(
            cacheKeyFor(userId),
            JSON.stringify({ data: body.data, skewMs, savedAt: snapshot.savedAt }),
        ).catch(() => {});
        return snapshot;
    } catch {
        return null;
    }
}
