import { StyleSheet } from "react-native";
import { normalize } from "../../helpers";
import { design, labels, palette, semantic } from "../../constants/colors";
import { FONT } from "../../constants/fonts";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    marginBottom: normalize(16),
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(12),
    borderWidth: 1,
    borderColor: isDarkMode ? semantic.fill.f04 : '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  containerImage: {
    width: normalize(90),
    height: normalize(100),
    backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  containerInfo: {
    flex: 1,
    marginLeft: normalize(16),
    justifyContent: 'space-between',
  },
  actions: {
    flex: 1,
  },
  name: {
    fontSize: normalize(15),
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
    marginBottom: normalize(6),
  },
  priceTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  price: {
    fontSize: normalize(13),
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
  },
  totalPrice: {
    fontSize: normalize(15),
    fontFamily: FONT.BOLD,
    color: semantic.alert.danger.d500,
  },
  doorStep: {
    fontSize: normalize(10),
    fontFamily: FONT.MEDIUM,
    color: semantic.alert.danger.d500,
    marginBottom: normalize(8),
  },
  otherInfo: {
    flexDirection: 'row',
    gap: normalize(8),
  },
  category: {
    color: isDarkMode ? '#60A5FA' : '#0284C7',
    backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.1)' : '#F0F9FF',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(6),
    fontSize: normalize(9),
    fontFamily: FONT.BOLD,
  },
  expiry: {
    color: isDarkMode ? '#94A3B8' : '#475569',
    backgroundColor: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : '#F1F5F9',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(6),
    fontSize: normalize(9),
    fontFamily: FONT.BOLD,
  },
  special: {
    fontSize: normalize(10),
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  specialHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(6),
  },
  dependentBadge: {
    backgroundColor: semantic.alert.danger.d500,
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(2),
    borderRadius: normalize(4),
    marginTop: normalize(4),
    alignSelf: 'flex-start',
  },
  dependentBadgeText: {
    color: '#FFF',
    fontSize: normalize(10),
    fontFamily: FONT.BOLD,
  },
  dependentNote: {
    fontSize: normalize(10),
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: normalize(4),
  },
  linkedContainer: {
    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#F8FAFC',
    borderColor: '#CBD5E1',
    opacity: 0.85,
  }
});
