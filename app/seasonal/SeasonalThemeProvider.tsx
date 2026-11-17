import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, AppStateStatus } from 'react-native';
import { useSelector } from 'react-redux';
import { DISABLED_CONFIG, isConfigLive, SeasonalConfig } from './seasonalConfig';
import { fetchSeasonalSnapshot, loadCachedSnapshot, SeasonalSnapshot } from './seasonalService';

/** Don't hit the API more than once per this window when the app returns to the foreground. */
const MIN_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
/** setTimeout safety cap – re-evaluates the schedule at least this often. */
const MAX_TIMER_MS = 6 * 60 * 60 * 1000;

export interface SeasonalThemeContextValue {
    /** The live configuration; `DISABLED_CONFIG` whenever no campaign should show. */
    config: SeasonalConfig;
    /** True when any campaign is live. */
    active: boolean;
    /** serverTime - deviceTime (ms). */
    skewMs: number;
    /** App is in the foreground – animated effects pause when false. */
    appActive: boolean;
    /** OS "reduce motion" accessibility setting. Animated effects must not run when true. */
    reduceMotion: boolean;
    refresh: () => Promise<void>;
}

const defaultValue: SeasonalThemeContextValue = {
    config: DISABLED_CONFIG,
    active: false,
    skewMs: 0,
    appActive: true,
    reduceMotion: false,
    refresh: async () => {},
};

const SeasonalThemeContext = createContext<SeasonalThemeContextValue>(defaultValue);

export const SeasonalThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [snapshot, setSnapshot] = useState<SeasonalSnapshot | null>(null);
    const [tick, setTick] = useState(0); // bumps when a schedule boundary passes
    const [appActive, setAppActive] = useState(AppState.currentState === 'active');
    const [reduceMotion, setReduceMotion] = useState(false);
    const lastFetchRef = useRef(0);
    const inFlightRef = useRef(false);
    const mountedRef = useRef(true);

    // Watch current authenticated user ID so logging in/out immediately refreshes user-targeted campaigns.
    const currentUserId: number | null = useSelector((state: any) => {
        const auth = state?.systemReducer?.auth;
        if (!auth?.loginStatus) return null;
        const id = auth?.data?.id ?? auth?.data?.user?.id;
        return typeof id === 'number' && id > 0 ? id : null;
    });

    const refresh = useCallback(async () => {
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        try {
            const fresh = await fetchSeasonalSnapshot();
            if (fresh && mountedRef.current) {
                lastFetchRef.current = Date.now();
                setSnapshot(fresh);
            }
        } finally {
            inFlightRef.current = false;
        }
    }, []);

    // Launch & user change: load cached config for this user first, then refresh from backend.
    useEffect(() => {
        mountedRef.current = true;
        setSnapshot(null);
        loadCachedSnapshot(currentUserId).then((cached) => {
            if (cached && mountedRef.current) {
                setSnapshot((current) => current ?? cached);
            }
        });
        refresh();
        return () => {
            mountedRef.current = false;
        };
    }, [currentUserId, refresh]);

    // Foreground / background handling.
    useEffect(() => {
        const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
            const isActive = state === 'active';
            setAppActive(isActive);
            if (isActive && Date.now() - lastFetchRef.current > MIN_REFRESH_INTERVAL_MS) {
                refresh();
            }
        });
        return () => sub.remove();
    }, [refresh]);

    // Reduced motion.
    useEffect(() => {
        let cancelled = false;
        AccessibilityInfo.isReduceMotionEnabled()
            .then((v) => !cancelled && setReduceMotion(v))
            .catch(() => {});
        const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
        return () => {
            cancelled = true;
            sub.remove();
        };
    }, []);

    const skewMs = snapshot?.skewMs ?? 0;

    // Expire / start campaigns on time even without a network round-trip.
    useEffect(() => {
        const cfg = snapshot?.config;
        if (!cfg?.enabled) return;
        const now = Date.now() + skewMs;
        const boundaries = [cfg.starts_at, cfg.ends_at]
            .map((s) => (s ? Date.parse(s) : NaN))
            .filter((t) => Number.isFinite(t) && t > now);
        if (boundaries.length === 0) return;
        const wait = Math.min(Math.min(...boundaries) - now + 250, MAX_TIMER_MS);
        const id = setTimeout(() => setTick((t) => t + 1), wait);
        return () => clearTimeout(id);
    }, [snapshot, skewMs, tick]);

    const value = useMemo<SeasonalThemeContextValue>(() => {
        const cfg = snapshot?.config ?? DISABLED_CONFIG;
        const live = isConfigLive(cfg, Date.now(), skewMs);
        return {
            config: live ? cfg : DISABLED_CONFIG,
            active: live,
            skewMs,
            appActive,
            reduceMotion,
            refresh,
        };
        // `tick` forces re-evaluation of the schedule.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapshot, skewMs, appActive, reduceMotion, refresh, tick]);

    return <SeasonalThemeContext.Provider value={value}>{children}</SeasonalThemeContext.Provider>;
};

/** Safe outside the provider: returns the disabled (normal appearance) configuration. */
export const useSeasonalTheme = (): SeasonalThemeContextValue => useContext(SeasonalThemeContext);

/** True when animated effects may run right now. */
export const useAnimationsAllowed = (): boolean => {
    const { active, appActive, reduceMotion } = useSeasonalTheme();
    return active && appActive && !reduceMotion;
};
