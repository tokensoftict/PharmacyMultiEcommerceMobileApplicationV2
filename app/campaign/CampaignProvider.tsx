// app/campaign/CampaignProvider.tsx
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import CampaignService from './CampaignService';
import CampaignEventBus from './CampaignEventBus';
import Environment from '@/shared/utils/Environment';
import { CampaignActionHandler } from './CampaignActionHandler';
import { CampaignModal } from './CampaignModal';
import { CampaignContextType, CampaignPayload, CampaignTriggerEvent } from './CampaignTypes';

const CampaignContext = createContext<CampaignContextType>({
  triggerEvent: async () => {},
  dismissActiveCampaign: () => {},
  activeCampaign: null,
});

export const useCampaign = () => useContext(CampaignContext);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<CampaignPayload[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<CampaignPayload | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const isProcessingRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  /**
   * Process next campaign in queue.
   */
  const processNextCampaign = useCallback((campaignQueue: CampaignPayload[]) => {
    if (campaignQueue.length === 0) {
      setActiveCampaign(null);
      setModalVisible(false);
      isProcessingRef.current = false;
      return;
    }

    const next = campaignQueue[0];
    setActiveCampaign(next);
    setModalVisible(true);
    isProcessingRef.current = true;

    // Record impression
    CampaignService.recordInteraction(next.id, 'impression', 'in_app');
  }, []);

  /**
   * Trigger an event (e.g. APP_OPEN, ADD_TO_CART, CHECKOUT_STARTED).
   */
  const triggerEvent = useCallback(
    async (event: CampaignTriggerEvent, extraContext: Record<string, any> = {}) => {
      // Must select a store environment before any campaign is evaluated or shown
      if (!Environment.getEnvironment()) return;

      try {
        const eligible = await CampaignService.getEligibleCampaigns(event, extraContext);

        if (eligible.length > 0) {
          setQueue(eligible);
          processNextCampaign(eligible);
        }
      } catch (error) {
        console.warn('[CampaignProvider] Error triggering campaign event:', event, error);
      }
    },
    [processNextCampaign]
  );

  /**
   * Handle user CTA click.
   */
  const handleCtaClick = useCallback(() => {
    if (!activeCampaign) return;

    // Log click interaction
    CampaignService.recordInteraction(activeCampaign.id, 'clicked', 'in_app');

    const actionType = activeCampaign.action_type;
    const actionData = activeCampaign.action_data;

    setModalVisible(false);

    // Execute CTA action
    setTimeout(() => {
      CampaignActionHandler.executeAction(actionType, actionData);

      // Shift queue
      setQueue((prevQueue) => {
        const nextQueue = prevQueue.slice(1);
        processNextCampaign(nextQueue);
        return nextQueue;
      });
    }, 250);
  }, [activeCampaign, processNextCampaign]);

  /**
   * Handle user dismissal / close.
   */
  const handleDismiss = useCallback(() => {
    if (!activeCampaign) return;

    // Log dismissal interaction
    CampaignService.recordInteraction(activeCampaign.id, 'dismissed', 'in_app');

    setModalVisible(false);

    setTimeout(() => {
      setQueue((prevQueue) => {
        const nextQueue = prevQueue.slice(1);
        processNextCampaign(nextQueue);
        return nextQueue;
      });
    }, 200);
  }, [activeCampaign, processNextCampaign]);

  // Listen to AppState transitions (Background -> Foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App resumed from background
        triggerEvent('APP_FOREGROUND');
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [triggerEvent]);

  // Initial trigger on mount: APP_OPEN & subscribe to EventBus
  useEffect(() => {
    const unsubscribe = CampaignEventBus.subscribe((event, extraContext) => {
      triggerEvent(event, extraContext);
    });

    const timer = setTimeout(() => {
      triggerEvent('APP_OPEN');
    }, 1500); // 1.5s delay after app load to allow session initialization

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [triggerEvent]);

  return (
    <CampaignContext.Provider
      value={{
        triggerEvent,
        dismissActiveCampaign: handleDismiss,
        activeCampaign,
      }}
    >
      {children}

      <CampaignModal
        campaign={activeCampaign}
        visible={modalVisible}
        onPressCta={handleCtaClick}
        onDismiss={handleDismiss}
      />
    </CampaignContext.Provider>
  );
};
