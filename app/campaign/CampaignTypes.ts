// app/campaign/CampaignTypes.ts

export type CampaignDisplayType = 'modal' | 'fullscreen' | 'bottom_sheet' | 'banner';

export type CampaignActionType =
  | 'none'
  | 'open_product'
  | 'open_category'
  | 'open_cart'
  | 'open_checkout'
  | 'open_order'
  | 'open_store'
  | 'open_url'
  | 'open_deep_link'
  | 'apply_coupon';

export type CampaignTriggerEvent =
  | 'APP_OPEN'
  | 'APP_FOREGROUND'
  | 'SESSION_STARTED'
  | 'LOGIN'
  | 'SIGNUP'
  | 'HOME_OPENED'
  | 'PRODUCT_VIEWED'
  | 'CATEGORY_VIEWED'
  | 'SEARCH_PERFORMED'
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'CART_UPDATED'
  | 'CART_ABANDONED'
  | 'CHECKOUT_STARTED'
  | 'ORDER_PLACED'
  | 'ORDER_CANCELLED'
  | 'ORDER_COMPLETED'
  | 'PAYMENT_STARTED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'ADD_TO_WISHLIST'
  | 'CUSTOM';

export interface CampaignPayload {
  id: number;
  slug: string;
  title: string | null;
  message: string | null;
  image: string | null;
  cta_text: string | null;
  display_type: CampaignDisplayType;
  action_type: CampaignActionType;
  action_data: Record<string, any>;
  trigger_event: string;
}

export type CampaignEventType =
  | 'impression'
  | 'dismissed'
  | 'clicked'
  | 'converted'
  | 'push_opened';

export interface CampaignContextType {
  triggerEvent: (event: CampaignTriggerEvent, extraContext?: Record<string, any>) => Promise<void>;
  dismissActiveCampaign: () => void;
  activeCampaign: CampaignPayload | null;
}
