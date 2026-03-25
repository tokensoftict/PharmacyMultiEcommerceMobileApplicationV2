import { StyleSheet, Platform, StatusBar, NativeModules } from 'react-native';

const { StatusBarManager } = NativeModules;

// Handle different platforms
const STATUSBAR_HEIGHT =
    Platform.OS === 'ios' ? StatusBarManager.HEIGHT : StatusBar.currentHeight;

export const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT || 0, // Ensure it doesn't return `undefined`
    backgroundColor: 'red',
  },
});
