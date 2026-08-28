// app/campaign/CampaignActionHandler.ts
import { Linking } from 'react-native';
import * as NavigationService from '@/shared/utils/NavigationService';
import { CampaignActionType } from './CampaignTypes';

/**
 * CampaignActionHandler
 *
 * Centralized action handler for all campaign CTA clicks (both in-app popups and push notifications).
 * Does not duplicate navigation logic — delegates directly to NavigationService or React Native Linking.
 */
export class CampaignActionHandler {
  public static executeAction(actionType: CampaignActionType, actionData: Record<string, any> = {}): void {
    if (!actionType || actionType === 'none') return;

    try {
      switch (actionType) {
        case 'open_product': {
          const productId = actionData.product_id || actionData.id || actionData.stock_id;
          if (productId) {
            NavigationService.navigate('detailProduct', { productId });
          } else {
            NavigationService.navigate('productList', { endpoint: 'stock/list', title: 'Products', id: 0 });
          }
          break;
        }

        case 'open_category': {
          const categoryId = actionData.category_id || actionData.id;
          const categoryName = actionData.category_name || actionData.name || 'Products';
          if (categoryId) {
            NavigationService.navigate('productList', {
              id: categoryId,
              title: categoryName,
              endpoint: `category/${categoryId}/stock/list`,
            });
          } else {
            NavigationService.navigate('productList', { endpoint: 'stock/list', title: 'Products', id: 0 });
          }
          break;
        }

        case 'open_cart': {
          NavigationService.navigate('supermarket'); // or supermarket cart tab
          break;
        }

        case 'open_checkout': {
          NavigationService.navigate('checkout');
          break;
        }

        case 'open_order': {
          const orderId = actionData.order_id || actionData.id;
          if (orderId) {
            NavigationService.navigate('showOrder', { id: orderId } as any);
          } else {
            NavigationService.navigate('orders');
          }
          break;
        }

        case 'open_store': {
          NavigationService.navigate('mainMenu');
          break;
        }

        case 'open_url':
        case 'open_deep_link': {
          const url = actionData.url || actionData.link || actionData.deep_link;
          if (url) {
            Linking.canOpenURL(url).then((supported) => {
              if (supported) {
                Linking.openURL(url);
              }
            });
          }
          break;
        }

        case 'apply_coupon': {
          const couponCode = actionData.coupon_code || actionData.code;
          if (couponCode) {
            NavigationService.navigate('checkout');
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.warn('[CampaignActionHandler] Failed to execute action:', actionType, error);
    }
  }
}
