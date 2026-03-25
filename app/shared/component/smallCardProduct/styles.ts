import { StyleSheet } from "react-native";
import { normalize } from "../../helpers";
import { design, labels, palette, semantic } from "../../constants/colors";
import { FONT } from "@/shared/constants/fonts";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    width: normalize(105),
    marginBottom: normalize(12),
    marginTop: normalize(8),
    marginRight: normalize(3),
    marginLeft: normalize(3),
    backgroundColor: isDarkMode ? semantic.fill.f01 : '#FFFFFF',
    borderRadius: normalize(12),
    padding: normalize(8),
    borderWidth: 1,
    borderColor: isDarkMode ? 'transparent' : '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  containerImage: {
    width: '100%',
    height: normalize(70),
  },
  image: {
    marginTop: normalize(5),
    width: '100%',
    height: normalize(60)
  },
  name: {
    fontSize: normalize(10),
    color: isDarkMode ? semantic.text.white : '#1A1D1E',
    fontFamily: FONT.MEDIUM,
    height: normalize(32),
    lineHeight: normalize(14),
    marginTop: normalize(4),
  },
  category: {
    color: semantic.text.white,
    backgroundColor: isDarkMode ? semantic.text.black : design.text1.background,
    padding: normalize(1),
    paddingLeft: normalize(5),
    borderRadius: normalize(3),
    width: '80%',

    fontSize: normalize(7),
    marginVertical: normalize(1)
  },
  expiry: {
    backgroundColor: labels.type1.background,
    color: labels.type1.textColor,
    padding: normalize(1),
    paddingLeft: normalize(5),
    borderRadius: normalize(3),
    width: '80%',

    fontSize: normalize(7),
    marginVertical: normalize(1)
  },
  price: {
    color: '#D50000',
    fontSize: normalize(12),
    fontFamily: FONT.BOLD,
    marginTop: normalize(4),
  },
  special: {
    fontSize: normalize(10),
    color: '#9A9A9A',
    textDecorationLine: "line-through",
    fontFamily: FONT.NORMAL,
  },
  doorStep: {
    fontSize: normalize(7),
    color: isDarkMode ? semantic.text.white : palette.main.p500,
  },
  badgeContainer: {
    flexDirection: 'column',
    marginTop: normalize(4),
  },
  stockBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: normalize(4),
    paddingVertical: normalize(2),
    borderRadius: normalize(4),
    marginBottom: normalize(4),
    alignSelf: 'flex-start',
  },
  stockText: {
    fontSize: normalize(8),
    color: '#2E7D32',
    fontFamily: FONT.MEDIUM,
  },
  expiryBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: normalize(4),
    paddingVertical: normalize(2),
    borderRadius: normalize(4),
    alignSelf: 'flex-start',
  },
  expiryText: {
    fontSize: normalize(8),
    color: '#EF6C00',
    fontFamily: FONT.MEDIUM,
  },
  outOfStockContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(12),
  },
  outOfStockBadge: {
    backgroundColor: '#D50000',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: normalize(9),
    fontFamily: FONT.BOLD,
    textTransform: 'uppercase',
  },
  wishlistButton: {
    position: 'absolute',
    top: normalize(5),
    right: normalize(5),
    zIndex: 20,
    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
    borderRadius: normalize(15),
    width: normalize(24),
    height: normalize(24),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wishlistIcon: {
    width: normalize(14),
    height: normalize(14),
    tintColor: '#D50000',
  },
})
