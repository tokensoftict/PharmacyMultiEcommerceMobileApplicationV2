import {
    computeCountdown,
    DISABLED_CONFIG,
    isConfigLive,
    normalizeSeasonalConfig,
} from '../app/seasonal/seasonalConfig';

describe('seasonalConfig', () => {
    it('returns DISABLED_CONFIG for null, invalid or disabled payloads', () => {
        expect(normalizeSeasonalConfig(null)).toBe(DISABLED_CONFIG);
        expect(normalizeSeasonalConfig(undefined)).toBe(DISABLED_CONFIG);
        expect(normalizeSeasonalConfig({ enabled: false, theme: 'christmas' })).toBe(DISABLED_CONFIG);
    });

    it('normalizes and sanitizes a Christmas payload', () => {
        const cfg = normalizeSeasonalConfig({
            enabled: true,
            theme: 'christmas',
            campaign_name: '  Christmas Celebration 2026 ',
            show_santa_hat: true,
            show_snowfall: 1,
            snowfall_intensity: 'invalid_value',
            snowfall_speed: 'fast',
            snowfall_opacity: 1.8, // clamped to 1
            show_greeting: true,
            greeting_message: 'Merry Christmas!',
            greeting_background_color: '#C62828',
            greeting_text_color: 'not-a-color',
            banner_image: 'javascript:alert(1)',
            extra_effects: { valid_flag: true, 'Bad Key': true },
        });

        expect(cfg.enabled).toBe(true);
        expect(cfg.theme).toBe('christmas');
        expect(cfg.campaign_name).toBe('Christmas Celebration 2026');
        expect(cfg.show_santa_hat).toBe(true);
        expect(cfg.show_snowfall).toBe(true);
        expect(cfg.snowfall_intensity).toBe('medium');
        expect(cfg.snowfall_speed).toBe('fast');
        expect(cfg.snowfall_opacity).toBe(1);
        expect(cfg.greeting_background_color).toBe('#C62828');
        expect(cfg.greeting_text_color).toBeNull();
        expect(cfg.banner_image).toBeNull();
        expect(cfg.extra_effects).toEqual({ valid_flag: true });
    });

    it('evaluates schedule activation and expiration with server clock skew', () => {
        const cfg = normalizeSeasonalConfig({
            enabled: true,
            theme: 'christmas',
            starts_at: '2026-12-01T00:00:00Z',
            ends_at: '2026-12-25T23:59:59Z',
        });

        const before = Date.parse('2026-11-30T23:59:59Z');
        const during = Date.parse('2026-12-10T12:00:00Z');
        const after = Date.parse('2026-12-26T00:00:01Z');

        expect(isConfigLive(cfg, before)).toBe(false);
        expect(isConfigLive(cfg, during)).toBe(true);
        expect(isConfigLive(cfg, after)).toBe(false);

        // With +10s skew, 5s before start becomes 5s after start
        expect(isConfigLive(cfg, Date.parse('2026-11-30T23:59:55Z'), 10_000)).toBe(true);
    });

    it('computes New Year countdown accurately and stops at zero', () => {
        const target = '2027-01-01T00:00:00Z';
        const now = Date.parse('2026-12-30T22:29:30Z'); // 1d 1h 30m 30s before
        const parts = computeCountdown(target, now);

        expect(parts).toEqual({
            days: 1,
            hours: 1,
            minutes: 30,
            seconds: 30,
            totalMs: 91830000,
            done: false,
        });

        const past = computeCountdown(target, Date.parse('2027-01-01T00:00:01Z'));
        expect(past.done).toBe(true);
        expect(past.seconds).toBe(0);
    });
});

