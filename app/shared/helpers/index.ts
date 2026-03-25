import { Dimensions, PixelRatio, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Use the smaller dimension to scale consistently across orientations
const [shortDimension, longDimension] = SCREEN_WIDTH < SCREEN_HEIGHT
  ? [SCREEN_WIDTH, SCREEN_HEIGHT]
  : [SCREEN_HEIGHT, SCREEN_WIDTH];

// Base design size (iPhone 11 / common Figma size)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// scale horizontally
export const normalize = (size: number) => {
  const scale = shortDimension / guidelineBaseWidth;
  const newSize = size * scale;

  const result = Math.round(PixelRatio.roundToNearestPixel(newSize));

  return result - 2;
};

// scale vertically
export const verticalScale = (size: number) => {
  return Math.round(PixelRatio.roundToNearestPixel((longDimension / guidelineBaseHeight) * size));
};

// moderate scaling (best for most UI sizes)
export const moderateScale = (size: number, factor = 0.5) => {
  return size + (normalize(size) - size) * factor;
};

// font scaling
export const fontScale = (size: number) => {
  return normalize(size);
};




export function createRows<T>(array: T[], size: number): T[][] {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    chunkedArray.push(chunk);
  }
  return chunkedArray;
}


export function truncateString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + '..';
  }
  return str;
}


export const storage = {
  create: async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  },
  get: async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  },
  delete: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (e) {
      // remove error
    }
  }
}
