/**
 * useDimensions
 *
 * A reactive hook that provides current window dimensions and listens for
 * changes (orientation changes, foldable unfold, split-screen resize).
 *
 * WHY: Calling Dimensions.get('window') at module-level is a common bug —
 * the value is captured once at import time and never updates. This hook
 * always returns the live value and triggers re-renders on change.
 *
 * USAGE:
 *   const { width, height, isLandscape, isTablet } = useDimensions();
 */
import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { isTablet as checkIsTablet } from '../helpers';

interface DimensionsState {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
}

const buildState = (window: ScaledSize): DimensionsState => ({
  width: window.width,
  height: window.height,
  isLandscape: window.width > window.height,
  isTablet: checkIsTablet(),
});

export default function useDimensions(): DimensionsState {
  const [dims, setDims] = useState<DimensionsState>(() =>
    buildState(Dimensions.get('window')),
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDims(buildState(window));
    });
    return () => subscription.remove();
  }, []);

  return dims;
}
