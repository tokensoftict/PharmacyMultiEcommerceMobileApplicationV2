// app/campaign/CampaignService.ts
import EnvironmentRequest from '@/network/internet/EnvironmentRequest';
import Environment from '@/shared/utils/Environment';
import { CampaignEventType, CampaignPayload } from './CampaignTypes';

export class CampaignService {
  /**
   * Fetch eligible in-app campaigns from mystore backend.
   */
  public async getEligibleCampaigns(
    trigger: string = 'APP_OPEN',
    extraContext: Record<string, any> = {}
  ): Promise<CampaignPayload[]> {
    if (!Environment.isLogin()) {
      console.log('[CampaignService] [SKIPPED] User is not logged in. Skipping campaign check for:', trigger);
      return [];
    }

    const storeType = Environment.getEnvironment();
    // User must select a store before campaign is fetched/shown
    if (!storeType) {
      console.log('[CampaignService] [SKIPPED] No store environment selected. Skipping campaign check for:', trigger);
      return [];
    }

    try {
      const environmentRequest = new EnvironmentRequest().getRequest();

      const queryParams = new URLSearchParams({
        trigger,
        store_type: storeType,
        cart_total: String(extraContext.cart_total ?? 0),
        cart_item_count: String(extraContext.cart_item_count ?? 0),
      }).toString();

      const endpoint = `campaign/eligible?${queryParams}`;

      console.log('[CampaignService] [REQUEST] Fetching eligible campaigns:', {
        endpoint,
        trigger,
        storeType,
        extraContext,
        isLogin: Environment.isLogin(),
      });

      const response = await environmentRequest.get(endpoint);
      const data = response?.data;

      console.log('[CampaignService] [RESPONSE] Eligible campaigns received:', {
        status: response?.status,
        data,
        eligibleCount: Array.isArray(data?.data) ? data.data.length : 0,
      });

      if (data?.status === true && Array.isArray(data.data)) {
        return data.data as CampaignPayload[];
      }
      return [];
    } catch (error) {
      console.error('[CampaignService] [ERROR] Failed to fetch eligible campaigns:', error);
      return [];
    }
  }

  /**
   * Record a user interaction (impression, clicked, dismissed, converted, push_opened) with the backend.
   */
  public async recordInteraction(
    campaignId: number,
    eventType: CampaignEventType,
    channel: 'in_app' | 'push' = 'in_app',
    metadata: Record<string, any> = {}
  ): Promise<boolean> {
    if (!Environment.isLogin()) return false;

    try {
      const environmentRequest = new EnvironmentRequest().getRequest();
      const response = await environmentRequest.post('campaign/interaction', {
        campaign_id: campaignId,
        event_type: eventType,
        channel,
        metadata,
      });

      return response?.data?.status === true;
    } catch (error) {
      console.warn('[CampaignService] Failed to log campaign interaction:', error);
      return false;
    }
  }
}

export default new CampaignService();
