import AsyncStorage from '@react-native-async-storage/async-storage';

const REFERRAL_CODE_KEY = '@psgdc/pending_referral_code';

/**
 * ReferralStorage
 *
 * Persists a pending referral code across app sessions using AsyncStorage.
 * The code is set when Detour resolves a referral deep link, and cleared
 * immediately after it has been submitted with a registration request.
 */
const ReferralStorage = {
  /**
   * Persist a referral code from a Detour link.
   */
  set: async (code: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(REFERRAL_CODE_KEY, code.toUpperCase().trim());
    } catch (e) {
      // Silent — storage failure must not block the referral flow
      console.warn('[ReferralStorage] Failed to persist referral code:', e);
    }
  },

  /**
   * Retrieve the pending referral code, or null if none is stored.
   */
  get: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(REFERRAL_CODE_KEY);
    } catch (e) {
      console.warn('[ReferralStorage] Failed to read referral code:', e);
      return null;
    }
  },

  /**
   * Clear the pending referral code after it has been used in registration.
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(REFERRAL_CODE_KEY);
    } catch (e) {
      console.warn('[ReferralStorage] Failed to clear referral code:', e);
    }
  },
};

export default ReferralStorage;
