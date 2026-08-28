import { Share, Platform } from 'react-native';

export interface ProductShareOptions {
    name: string;
    seo?: string;
    slug?: string;
    department?: 'wholesales' | 'retail' | string;
    price?: string | number;
}

/**
 * Resolve the share URL for a product.
 * If the API response already returned a full SEO URL, it is used directly.
 */
export function getProductShareUrl(options: { seo?: string; department?: string; slug?: string }): string {
    const candidate = (options.seo || options.slug || '').trim();

    // 1. If it's already a full absolute HTTP/HTTPS URL, return it directly
    if (candidate.startsWith('http://') || candidate.startsWith('https://')) {
        return candidate;
    }

    // 2. If it starts with '//share.generaldrugcentre.com'
    if (candidate.startsWith('//')) {
        return `https:${candidate}`;
    }

    // 3. If it contains the domain without protocol
    if (candidate.startsWith('share.generaldrugcentre.com')) {
        return `https://${candidate}`;
    }

    // 4. Extract pure slug (strip any leading "/retail/p/", "/wholesales/p/", "/p/", or slashes)
    const cleanSlug = candidate
        .replace(/^https?:\/\/[^/]+/i, '')
        .replace(/^.*\/p\//i, '')
        .replace(/^\/+/, '')
        .trim();

    const dept = options.department === 'wholesales' ? 'wholesales' : 'retail';
    return `https://share.generaldrugcentre.com/${dept}/p/${cleanSlug}`;
}

/**
 * Trigger the native OS sharing sheet for a product.
 */
export async function shareProduct(options: ProductShareOptions): Promise<boolean> {
    try {
        const shareUrl = getProductShareUrl({
            seo: options.seo,
            department: options.department,
            slug: options.slug,
        });

        const message = `Check out ${options.name} on PS General Drugs Centre:\n${shareUrl}`;

        const result = await Share.share(
            Platform.select({
                ios: {
                    message: message,
                    url: shareUrl,
                },
                default: {
                    title: `${options.name} | PS General Drugs Centre`,
                    message: message,
                },
            })
        );

        return result.action === Share.sharedAction;
    } catch (error) {
        console.warn('Error sharing product:', error);
        return false;
    }
}

export default {
    getProductShareUrl,
    shareProduct,
};
