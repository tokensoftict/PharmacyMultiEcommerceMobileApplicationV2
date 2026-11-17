/**
 * Seasonal theme configuration: types, defensive normalisation and helpers.
 * The Laravel backend is the single source of truth – nothing here hardcodes a campaign.
 * Pure TypeScript (no React / native imports) so it is trivially unit-testable.
 */

export type Intensity = 'low' | 'medium' | 'high';
export type Speed = 'slow' | 'normal' | 'fast';
export type Alignment = 'left' | 'center' | 'right';
export type TextStyleName = 'normal' | 'bold' | 'italic' | 'script';

export interface SeasonalConfig {
    enabled: boolean;
    theme: string | null;
    id?: number | null;
    campaign_name: string | null;
    starts_at: string | null;
    ends_at: string | null;

    show_santa_hat: boolean;
    logo_decoration: string | null;

    show_snowfall: boolean;
    snowfall_intensity: Intensity;
    snowfall_speed: Speed;
    snowfall_opacity: number;

    show_decorations: boolean;
    show_christmas_lights: boolean;
    show_sparkles: boolean;
    show_ornaments: boolean;
    decoration_intensity: Intensity;
    lights_intensity: Intensity;

    show_greeting: boolean;
    greeting_message: string | null;
    greeting_subtitle: string | null;
    greeting_alignment: Alignment;
    greeting_text_style: TextStyleName;
    greeting_background_color: string | null;
    greeting_text_color: string | null;

    show_seasonal_banner: boolean;
    banner_image: string | null;
    banner_title: string | null;
    banner_subtitle: string | null;
    banner_link: string | null;

    show_gold_accents: boolean;
    show_fireworks: boolean;
    show_confetti: boolean;
    show_gold_particles: boolean;
    fireworks_intensity: Intensity;
    celebration_message: string | null;
    show_countdown: boolean;
    countdown_target_date: string | null;
    countdown_message: string | null;

    primary_festive_color: string | null;
    secondary_festive_color: string | null;
    background_effect_opacity: number;

    /** Future effects can ship flags here without an app release for the data itself. */
    extra_effects: Record<string, boolean | number>;
}

/** The "normal app" configuration – every effect off. */
export const DISABLED_CONFIG: SeasonalConfig = Object.freeze({
    enabled: false,
    theme: null,
    id: null,
    campaign_name: null,
    starts_at: null,
    ends_at: null,
    show_santa_hat: false,
    logo_decoration: null,
    show_snowfall: false,
    snowfall_intensity: 'medium',
    snowfall_speed: 'normal',
    snowfall_opacity: 0.5,
    show_decorations: false,
    show_christmas_lights: false,
    show_sparkles: false,
    show_ornaments: false,
    decoration_intensity: 'medium',
    lights_intensity: 'medium',
    show_greeting: false,
    greeting_message: null,
    greeting_subtitle: null,
    greeting_alignment: 'center',
    greeting_text_style: 'normal',
    greeting_background_color: null,
    greeting_text_color: null,
    show_seasonal_banner: false,
    banner_image: null,
    banner_title: null,
    banner_subtitle: null,
    banner_link: null,
    show_gold_accents: false,
    show_fireworks: false,
    show_confetti: false,
    show_gold_particles: false,
    fireworks_intensity: 'low',
    celebration_message: null,
    show_countdown: false,
    countdown_target_date: null,
    countdown_message: null,
    primary_festive_color: null,
    secondary_festive_color: null,
    background_effect_opacity: 1,
    extra_effects: {},
}) as SeasonalConfig;

const INTENSITIES: Intensity[] = ['low', 'medium', 'high'];
const SPEEDS: Speed[] = ['slow', 'normal', 'fast'];
const ALIGNMENTS: Alignment[] = ['left', 'center', 'right'];
const TEXT_STYLES: TextStyleName[] = ['normal', 'bold', 'italic', 'script'];
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const bool = (v: unknown): boolean => v === true || v === 1 || v === '1' || v === 'true';
const str = (v: unknown, max = 300): string | null =>
    typeof v === 'string' && v.trim() !== '' ? v.trim().slice(0, max) : null;
const oneOf = <T extends string>(v: unknown, allowed: T[], fallback: T): T =>
    allowed.includes(v as T) ? (v as T) : fallback;
const unit = (v: unknown, fallback: number): number => {
    const n = typeof v === 'number' ? v : parseFloat(String(v));
    return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : fallback;
};
const color = (v: unknown): string | null => (typeof v === 'string' && HEX.test(v) ? v : null);
const isoDate = (v: unknown): string | null => {
    const s = str(v, 40);
    return s && !Number.isNaN(Date.parse(s)) ? s : null;
};

/**
 * Turns any backend/cached payload into a safe SeasonalConfig.
 * Anything missing, malformed or `enabled:false` yields the disabled (normal) configuration.
 */
export function normalizeSeasonalConfig(raw: any): SeasonalConfig {
    if (!raw || typeof raw !== 'object' || !bool(raw.enabled)) {
        return DISABLED_CONFIG;
    }

    const extras: Record<string, boolean | number> = {};
    if (raw.extra_effects && typeof raw.extra_effects === 'object') {
        Object.keys(raw.extra_effects).forEach((k) => {
            const v = raw.extra_effects[k];
            if (/^[a-z0-9_]{1,40}$/.test(k) && (typeof v === 'boolean' || typeof v === 'number')) {
                extras[k] = v;
            }
        });
    }

    const countdownTarget = isoDate(raw.countdown_target_date);

    return {
        enabled: true,
        theme: str(raw.theme, 40) ?? 'custom',
        id: typeof raw.id === 'number' ? raw.id : null,
        campaign_name: str(raw.campaign_name, 120),
        starts_at: isoDate(raw.starts_at),
        ends_at: isoDate(raw.ends_at),

        show_santa_hat: bool(raw.show_santa_hat),
        logo_decoration: str(raw.logo_decoration, 40),

        show_snowfall: bool(raw.show_snowfall),
        snowfall_intensity: oneOf(raw.snowfall_intensity, INTENSITIES, 'medium'),
        snowfall_speed: oneOf(raw.snowfall_speed, SPEEDS, 'normal'),
        snowfall_opacity: unit(raw.snowfall_opacity, 0.5),

        show_decorations: bool(raw.show_decorations),
        show_christmas_lights: bool(raw.show_christmas_lights),
        show_sparkles: bool(raw.show_sparkles),
        show_ornaments: bool(raw.show_ornaments),
        decoration_intensity: oneOf(raw.decoration_intensity, INTENSITIES, 'medium'),
        lights_intensity: oneOf(raw.lights_intensity, INTENSITIES, 'medium'),

        show_greeting: bool(raw.show_greeting),
        greeting_message: str(raw.greeting_message, 160),
        greeting_subtitle: str(raw.greeting_subtitle, 240),
        greeting_alignment: oneOf(raw.greeting_alignment, ALIGNMENTS, 'center'),
        greeting_text_style: oneOf(raw.greeting_text_style, TEXT_STYLES, 'normal'),
        greeting_background_color: color(raw.greeting_background_color),
        greeting_text_color: color(raw.greeting_text_color),

        show_seasonal_banner: bool(raw.show_seasonal_banner),
        banner_image: typeof raw.banner_image === 'string' && /^https?:\/\//i.test(raw.banner_image) ? raw.banner_image : null,
        banner_title: str(raw.banner_title, 120),
        banner_subtitle: str(raw.banner_subtitle, 240),
        banner_link: str(raw.banner_link, 255),

        show_gold_accents: bool(raw.show_gold_accents),
        show_fireworks: bool(raw.show_fireworks),
        show_confetti: bool(raw.show_confetti),
        show_gold_particles: bool(raw.show_gold_particles),
        fireworks_intensity: oneOf(raw.fireworks_intensity, INTENSITIES, 'low'),
        celebration_message: str(raw.celebration_message, 240),
        show_countdown: bool(raw.show_countdown) && countdownTarget !== null,
        countdown_target_date: countdownTarget,
        countdown_message: str(raw.countdown_message, 160),

        primary_festive_color: color(raw.primary_festive_color),
        secondary_festive_color: color(raw.secondary_festive_color),
        background_effect_opacity: unit(raw.background_effect_opacity, 1),

        extra_effects: extras,
    };
}

/**
 * Local expiry guard so a cached campaign disappears on time even when offline.
 * `skewMs` = serverTime - deviceTime, learned from the last successful fetch.
 */
export function isConfigLive(config: SeasonalConfig, nowMs: number = Date.now(), skewMs = 0): boolean {
    if (!config.enabled) return false;
    const now = nowMs + skewMs;
    if (config.starts_at && now < Date.parse(config.starts_at)) return false;
    if (config.ends_at && now > Date.parse(config.ends_at)) return false;
    return true;
}

export interface CountdownParts {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
    done: boolean;
}

export function computeCountdown(targetIso: string | null, nowMs: number = Date.now(), skewMs = 0): CountdownParts {
    const target = targetIso ? Date.parse(targetIso) : NaN;
    const diff = Number.isFinite(target) ? target - (nowMs + skewMs) : 0;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, done: true };
    const s = Math.floor(diff / 1000);
    return {
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
        totalMs: diff,
        done: false,
    };
}

// ── Tunables derived from admin settings ────────────────────────────────────

export const SNOW_COUNT: Record<Intensity, number> = { low: 12, medium: 22, high: 34 };
export const SNOW_SPEED_FACTOR: Record<Speed, number> = { slow: 1.6, normal: 1, fast: 0.65 }; // multiplies duration
export const FIREWORK_GAP_MS: Record<Intensity, [number, number]> = {
    low: [9000, 15000],
    medium: [6000, 10000],
    high: [3000, 6000],
};
export const FIREWORK_PARTICLES: Record<Intensity, number> = { low: 12, medium: 18, high: 24 };
export const LIGHTS_BLINK_MS: Record<Intensity, number> = { low: 1800, medium: 1100, high: 650 };

