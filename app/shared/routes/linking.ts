import { LinkingOptions, getStateFromPath as defaultGetStateFromPath } from '@react-navigation/native';
import { RootStackParamList } from './stack';
import Environment from '@/shared/utils/Environment';

/**
 * React Navigation Deep Linking Configuration
 *
 * Supported URL Patterns:
 *   - https://share.generaldrugcentre.com/wholesales/p/:slug
 *   - https://share.generaldrugcentre.com/retail/p/:slug
 *   - https://referral.generaldrugcentre.com/ref/:code  → createAccount (only if NOT logged in)
 *   - psgdc://wholesales/p/:slug
 *   - psgdc://retail/p/:slug
 *   - psgdc://ref/:code  → createAccount (only if NOT logged in)
 */
export const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [
        'https://share.generaldrugcentre.com',
        'http://share.generaldrugcentre.com',
        'https://referral.generaldrugcentre.com',
        'http://referral.generaldrugcentre.com',
        'psgdc://',
    ],
    config: {
        screens: {
            // Product deep links
            detailProduct: {
                path: ':department/p/:slug',
                parse: {
                    department: (department: string) => {
                        const clean = department.toLowerCase().trim();
                        return clean === 'wholesales' ? 'wholesales' : 'retail';
                    },
                    slug: (slug: string) => slug.toLowerCase().trim(),
                },
                stringify: {
                    department: (department: string) => department,
                    slug: (slug: string) => slug,
                },
            },
            // Referral deep links → open signup with referral code pre-filled
            createAccount: {
                path: 'ref/:referralCode',
                parse: {
                    referralCode: (code: string) => code.toUpperCase().trim(),
                },
                stringify: {
                    referralCode: (code: string) => code,
                },
            },
        },
    },

    // Guard: only allow referral deep links to navigate to createAccount
    // if the user is NOT logged in. Logged-in users should not be redirected
    // to the signup screen.
    getStateFromPath: (path, options) => {
        // Check if this is a referral link and the user is already logged in
        if (path.includes('/ref/') && Environment.isLogin()) {
            // Return undefined → React Navigation ignores this link
            return undefined;
        }
        // Otherwise, let React Navigation handle it normally
        return defaultGetStateFromPath(path, options);
    },
};

export default linking;
