import { StyleSheet, Platform } from "react-native";
import { normalize } from "../../../shared/helpers";
import { semantic } from "@/shared/constants/colors";
import { FONT } from "@/shared/constants/fonts";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
  },
  listContainer: {
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(320), // Increased to ensure last item is visible above card
  },
  summaryCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    borderTopLeftRadius: normalize(32),
    borderTopRightRadius: normalize(32),
    padding: normalize(20),
    paddingTop: normalize(16),
    paddingBottom: Platform.OS === 'ios' ? normalize(90) : normalize(80), // Account for tab bar + safe area
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: isDarkMode ? semantic.fill.f04 : '#F1F5F9',
  },
  summaryIndicator: {
    width: normalize(40),
    height: normalize(4),
    backgroundColor: isDarkMode ? '#334155' : '#E2E8F0',
    borderRadius: normalize(2),
    alignSelf: 'center',
    marginBottom: normalize(12),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  summaryLabel: {
    fontSize: normalize(13),
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: normalize(13),
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? '#334155' : '#E2E8F0',
    paddingTop: normalize(12),
    marginTop: normalize(4),
    marginBottom: normalize(16),
  },
  totalLabelContainer: {
    flex: 1,
  },
  totalTitle: {
    fontSize: normalize(15),
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
  },
  totalSubtitle: {
    fontSize: normalize(12),
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
    marginTop: normalize(2),
  },
  totalAmount: {
    fontSize: normalize(20),
    fontFamily: FONT.BOLD,
    color: semantic.alert.danger.d500,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: normalize(12),
  },
  btnClear: {
    flex: 1,
    paddingVertical: normalize(14),
    borderRadius: normalize(16),
    borderWidth: 1.5,
    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnClearText: {
    fontSize: normalize(15),
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#94A3B8' : '#475569',
  },
  btnCheckout: {
    flex: 2,
    backgroundColor: semantic.alert.danger.d500,
    paddingVertical: normalize(14),
    borderRadius: normalize(16),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: semantic.alert.danger.d500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnCheckoutText: {
    fontSize: normalize(16),
    fontFamily: FONT.BOLD,
    color: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(40),
  },
  emptyImageWrapper: {
    width: normalize(200),
    height: normalize(200),
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#F1F5F9',
    borderRadius: normalize(100),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(24),
  },
  emptyImage: {
    width: '60%',
    height: '60%',
  },
  emptyTitle: {
    fontSize: normalize(20),
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
    textAlign: 'center',
    marginBottom: normalize(8),
  },
  emptySubtitle: {
    fontSize: normalize(14),
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: normalize(20),
  },
});
