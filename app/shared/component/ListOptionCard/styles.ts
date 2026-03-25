import { StyleSheet, ViewStyle } from "react-native";
import { palette, semantic } from "../../constants/colors";
import { normalize } from "../../helpers";
import { FONT } from "../../constants/fonts";

const defaultContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: normalize(10),
  borderWidth: 1,
  backgroundColor: 'white',
  borderRadius: normalize(5),
  marginVertical: normalize(2)
}
export const _styles = (isDarkMode: boolean, active: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: normalize(16),
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    borderRadius: normalize(16),
    marginVertical: normalize(8),
    borderWidth: 1.5,
    borderColor: active ? semantic.alert.danger.d500 : (isDarkMode ? semantic.fill.f04 : '#F1F5F9'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  containerIcon: {
    backgroundColor: isDarkMode ? semantic.fill.f03 : '#F8FAFC',
    borderRadius: normalize(12),
    width: normalize(48),
    height: normalize(48),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(16),
  },
  icon: {
    width: normalize(24),
    height: normalize(24),
    tintColor: active ? semantic.alert.danger.d500 : (isDarkMode ? '#94A3B8' : '#64748B'),
  },
  title: {
    fontSize: normalize(14),
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
    marginBottom: normalize(2),
  },
  address: {
    fontSize: normalize(12),
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
  },
  containerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(12),
  },
  price: {
    fontSize: normalize(14),
    fontFamily: FONT.BOLD,
    color: semantic.alert.danger.d500,
  },
});
