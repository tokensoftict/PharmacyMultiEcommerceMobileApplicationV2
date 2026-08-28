import Request from '../../network/internet/request.tsx';
import { Share } from 'react-native';

const REFERRAL_BASE_URL = 'https://referral.generaldrugcentre.com/ref/';

/**
 * ReferralApiService
 *
 * API calls for the referral system.
 *
 * URL Architecture
 * ────────────────
 * User shares:         https://referral.generaldrugcentre.com/ref/{code}
 * Server redirects to: https://psgdc.godetour.link/PrdRthERNv/ref/{code}
 * Detour handles the deferred install + deep link resolution.
 */
export default class ReferralApiService {
  private request: Request;

  constructor() {
    this.request = new Request();
  }

  /**
   * Fetch or generate the authenticated user's referral code and URL.
   * GET /api/account/referral-code
   */
  getReferralCode(): Promise<{ referral_code: string; referral_url: string }> {
    return this.request.get('referral-code').then((response: any) => {
      if (response?.data?.status === true) {
        return response.data.data as { referral_code: string; referral_url: string };
      }
      throw new Error('Failed to fetch referral code');
    });
  }

  /**
   * Fetch referral stats for the authenticated user.
   * GET /api/account/referrals/me
   */
  getMyReferrals(): Promise<any> {
    return this.request.get('referrals/me').then((response: any) => {
      if (response?.data?.status === true) {
        return response.data.data;
      }
      throw new Error('Failed to fetch referral stats');
    });
  }

  /**
   * Build the referral URL to display and share.
   * The user-facing shareable URL is always referral.generaldrugcentre.com.
   * The server-side redirect to psgdc.godetour.link handles app install flow.
   */
  static buildReferralUrl(code: string): string {
    return REFERRAL_BASE_URL + code;
  }

  /**
   * Open the native share sheet with the referral link.
   */
  static async shareReferralLink(code: string): Promise<void> {
    const url = ReferralApiService.buildReferralUrl(code);
    try {
      await Share.share({
        message: `Join me on General Drug Centre! Use my referral code ${code} to get started.\n\n${url}`,
        url,
        title: 'Refer & Earn — General Drug Centre',
      });
    } catch (e) {
      console.warn('[ReferralApiService] Share error:', e);
    }
  }
}
