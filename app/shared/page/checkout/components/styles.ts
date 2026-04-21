import { Dimensions, Platform, StyleSheet } from "react-native";
import { design, palette, semantic } from "@/shared/constants/colors.ts";
import { normalize } from "@/shared/helpers";
import { FONT } from "@/shared/constants/fonts";


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRIMARY_COLOR = '#d32f2f';
const LIGHT_GRAY = '#f7f7f7';
const DARK_TEXT = '#222';

export const _styles = (isDarkMode: boolean, width: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(16),
    borderRadius: normalize(16),
    margin: normalize(16),
    marginBottom: normalize(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  stepHeader: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepTitle: {
    fontSize: normalize(10),
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#64748B' : '#94A3B8',
    textAlign: 'center',
    marginBottom: normalize(6),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepTitleActive: {
    color: semantic.alert.danger.d500,
  },
  stepLine: {
    height: normalize(4),
    width: '80%',
    backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
    borderRadius: normalize(2),
  },
  stepLineActive: {
    backgroundColor: semantic.alert.danger.d500,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  stepsContainer: {
    flexDirection: 'row',
    height: '100%',
    width: SCREEN_WIDTH * 4,
  },
  step: {
    width: SCREEN_WIDTH,
    paddingHorizontal: normalize(16),
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: normalize(20),
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? semantic.fill.f04 : '#F1F5F9',
    // Removed elevation and shadow to avoid Android navigation bar overlap issues
  },
  nav: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: normalize(16),
  },
  button: {
    flexDirection: 'row',
    backgroundColor: semantic.alert.danger.d500,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(28),
    borderRadius: normalize(30), // Pill shape for more attraction
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: semantic.alert.danger.d500,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: normalize(14),
    fontFamily: FONT.BOLD,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonSecondary: {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(30),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0, // Clean look
  },
  buttonSecondaryText: {
    color: isDarkMode ? '#94A3B8' : '#64748B',
    fontSize: normalize(14),
    fontFamily: FONT.BOLD,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
