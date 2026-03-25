import { StyleSheet } from "react-native";
import { normalize } from "../../helpers";
import { design, palette, semantic } from "../../constants/colors";
import { FONT } from "@/shared/constants/fonts";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    marginHorizontal: normalize(16),
    marginVertical: normalize(8),
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    borderRadius: normalize(16),
    padding: normalize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  containerImage: {
    width: normalize(90),
    height: normalize(90),
    backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8F9FA',
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  containerInfo: {
    flex: 1,
    marginLeft: normalize(16),
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: normalize(15),
    fontFamily: FONT.BOLD,
    color: isDarkMode ? semantic.text.white : '#1A1D1E',
    flex: 1,
    marginRight: normalize(8),
  },
  removeButton: {
    padding: normalize(4),
  },
  trashIcon: {
    width: normalize(18),
    height: normalize(18),
    tintColor: '#D50000',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(4),
  },
  price: {
    fontSize: normalize(18),
    fontFamily: FONT.BOLD,
    color: semantic.alert.danger.d500,
  },
  quantityBadge: {
    backgroundColor: isDarkMode ? semantic.fill.f04 : '#E8F5E9',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(6),
  },
  quantityText: {
    fontSize: normalize(10),
    fontFamily: FONT.MEDIUM,
    color: isDarkMode ? semantic.text.white : '#2E7D32',
  },
  doorStep: {
    fontSize: normalize(10),
    color: '#757575',
    fontFamily: FONT.NORMAL,
    marginTop: normalize(4),
  },
})
