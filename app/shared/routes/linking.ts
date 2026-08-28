import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './stack';

/**
 * React Navigation Deep Linking Configuration
 *
 * Supported URL Patterns:
 *   - https://share.generaldrugcentre.com/wholesales/p/:slug
 *   - https://share.generaldrugcentre.com/retail/p/:slug
 *   - psgdc://wholesales/p/:slug
 *   - psgdc://retail/p/:slug
 *   - psgdc://p/:slug
 */
export const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [
        'https://share.generaldrugcentre.com',
        'http://share.generaldrugcentre.com',
        'psgdc://',
    ],
    config: {
        screens: {
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
        },
    },
};

export default linking;
