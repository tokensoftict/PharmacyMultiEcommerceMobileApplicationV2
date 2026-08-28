// app/campaign/CampaignEventBus.ts
import { CampaignTriggerEvent } from './CampaignTypes';

type EventListener = (event: CampaignTriggerEvent, extraContext?: Record<string, any>) => void;

class CampaignEventBus {
  private listeners: Set<EventListener> = new Set();

  /**
   * Subscribe to campaign trigger events.
   */
  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Emit a campaign trigger event.
   */
  public emit(event: CampaignTriggerEvent, extraContext: Record<string, any> = {}): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event, extraContext);
      } catch (err) {
        console.warn('[CampaignEventBus] Listener error:', err);
      }
    });
  }
}

export default new CampaignEventBus();
