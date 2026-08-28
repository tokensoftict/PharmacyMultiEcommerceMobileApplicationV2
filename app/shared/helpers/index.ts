import { Dimensions, PixelRatio } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

// ---------------------------------------------------------------------------
// Screen dimensions — always read live so foldables / orientation work
// ---------------------------------------------------------------------------
export const getScreen = () => Dimensions.get('window');

/**
 * Returns true when running on a tablet (iPad / large Android tablet).
 * Uses react-native-device-info (already installed).
 */
export const isTablet = (): boolean => DeviceInfo.isTablet();

// ---------------------------------------------------------------------------
// Base design dimensions
// We use a DYNAMIC base so the system scales relative to the actual screen,
// not hard-coded to one reference device.
//
// Formula: proportion from "standard" phone base (375 × 812)
// but clamped so it never over-scales on massive tablets.
// ---------------------------------------------------------------------------
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Factor cap: on tablets we limit scale to 1.4× to prevent giant UI
const MAX_SCALE_FACTOR = isTablet() ? 1.4 : 1.0;

const getShortDimension = () => {
  const { width, height } = getScreen();
  return Math.min(width, height);
};

const getLongDimension = () => {
  const { width, height } = getScreen();
  return Math.max(width, height);
};

// ---------------------------------------------------------------------------
// normalize (horizontal scale) — FIXED: removed the erroneous -2 offset
// ---------------------------------------------------------------------------
export const normalize = (size: number): number => {
  const shortDim = getShortDimension();
  const rawScale = shortDim / BASE_WIDTH;
  // Clamp scale so tablets don't blow up
  const scale = Math.min(rawScale, 1 + (MAX_SCALE_FACTOR - 1));
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// ---------------------------------------------------------------------------
// verticalScale — scales based on the long dimension (height)
// ---------------------------------------------------------------------------
export const verticalScale = (size: number): number => {
  const longDim = getLongDimension();
  return Math.round(PixelRatio.roundToNearestPixel((longDim / BASE_HEIGHT) * size));
};

// ---------------------------------------------------------------------------
// moderateScale — best for most UI elements (mix of h/v scale)
// factor = 0.5 means halfway between identity and full scale
// ---------------------------------------------------------------------------
export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (normalize(size) - size) * factor;
};

// ---------------------------------------------------------------------------
// fontScale — responsive font size (uses moderateScale with 0.2 factor
// so text grows more slowly than layout — prevents oversized text on tablets/large phones)
// ---------------------------------------------------------------------------
export const fontScale = (size: number): number => {
  return moderateScale(size, 0.2);
};

// ---------------------------------------------------------------------------
// wp / hp — width / height as a percentage of the screen
// Usage: wp(50) = 50% of screen width
// ---------------------------------------------------------------------------
export const wp = (percentage: number): number => {
  const { width } = getScreen();
  return (percentage / 100) * width;
};

export const hp = (percentage: number): number => {
  const { height } = getScreen();
  return (percentage / 100) * height;
};

// ---------------------------------------------------------------------------
// Utility: number of grid columns based on device type
// ---------------------------------------------------------------------------
export const getNumColumns = (phoneColumns = 2, tabletColumns = 3): number => {
  return isTablet() ? tabletColumns : phoneColumns;
};

// ---------------------------------------------------------------------------
// Utility: responsive card width for grid layouts
// Usage: cardWidth(2, 16) = (screenWidth - 3*16) / 2
// ---------------------------------------------------------------------------
export const getCardWidth = (columns: number, horizontalPadding: number): number => {
  const { width } = getScreen();
  const totalPadding = horizontalPadding * (columns + 1);
  return (width - totalPadding) / columns;
};

// ---------------------------------------------------------------------------
// Array helpers
// ---------------------------------------------------------------------------
export function createRows<T>(array: T[], size: number): T[][] {
  const chunkedArray: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }
  return chunkedArray;
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + '..';
  }
  return str;
}

// ---------------------------------------------------------------------------
// AsyncStorage helpers
// ---------------------------------------------------------------------------
export const storage = {
  create: async (key: string, value: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      // silently fail
    }
  },
  get: async (key: string): Promise<any> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  },
  delete: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (_) {
      // silently fail
    }
  },
};
