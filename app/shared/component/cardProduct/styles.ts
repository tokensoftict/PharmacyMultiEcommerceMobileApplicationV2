import { Platform, StyleSheet } from "react-native";
import { normalize } from "../../helpers";
import { design, labels, palette, semantic } from "../../constants/colors";
import { FONT } from "@/shared/constants/fonts.ts";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    width: normalize(176),
    marginBottom: normalize(12),
    marginTop: normalize(12),
    marginRight: normalize(5),
    marginLeft: normalize(15),
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f03,
    borderRadius: normalize(5),
    shadowOpacity: 0.11,
    ...Platform.select({
      ios: {
        shadowRadius: normalize(3),
        elevation: normalize(20),
        shadowOffset: {
          width: normalize(0),
          height: normalize(0),
        },
      },
      android: {
        shadowRadius: normalize(3),
        elevation: normalize(2),
        shadowOffset: {
          width: normalize(0),
          height: normalize(0),
        },
      }
    }),

  },
  containerImage: {
    width: '100%',
    height: normalize(115),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  image: {
    width: '60%',
    height: '80%',
    alignSelf: 'center',
  },
  name: {
    fontFamily: FONT.LIGHT,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
    maxHeight: normalize(40),
    fontSize: normalize(12),
    alignItems: "center",
    marginBottom: normalize(4),
    height: normalize(35),
  },
  category: {
    color: isDarkMode ? semantic.text.white : design.text1.color,
    backgroundColor: isDarkMode ? semantic.text.black : design.text1.background,
    padding: normalize(2),
    paddingLeft: normalize(5),
    borderRadius: normalize(5),
    width: '50%',

    fontSize: normalize(10),
    marginVertical: normalize(8)
  },
  price: {
    color: isDarkMode ? semantic.text.white : semantic.text.black,

    marginBottom: normalize(4),
  },
  special: {
    fontSize: normalize(9),
    color: semantic.alert.danger.d500,
    textDecorationLine: "line-through",
    marginTop: normalize(5),
  },
  doorStep: {
    fontSize: normalize(10),
    fontFamily: Platform.OS == 'android' ? FONT.EXTRA_BOLD : FONT.LIGHT,
    color: isDarkMode ? semantic.text.white : palette.main.p500,

  },
  addToCart: {
    marginRight: normalize(8),
    marginTop: normalize(0),
    backgroundColor: semantic.alert.danger.d500,
    borderRadius: normalize(100),
    width: normalize(35),
    height: normalize(35),
    padding: normalize(10),
    shadowColor: '#171717',
    shadowOffset: { width: normalize(-2), height: normalize(2) },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },

  expiryStyle: {
    color: labels.type1.textColor,
    backgroundColor: labels.type1.background,
    padding: normalize(1),
    paddingHorizontal: normalize(5),
    borderRadius: normalize(5),

    fontSize: normalize(8),
  },


  quantityStyle: {
    color: design.text1.color,
    backgroundColor: design.text1.background,
    padding: normalize(1),
    paddingHorizontal: normalize(5),
    borderRadius: normalize(5),

    fontSize: normalize(8),
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
    borderRadius: normalize(5),
  },
  outOfStockBadge: {
    backgroundColor: '#D50000',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontFamily: FONT.BOLD,
    textTransform: 'uppercase',
  },
  wishlistButton: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    zIndex: 20,
    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
    borderRadius: normalize(15),
    width: normalize(28),
    height: normalize(28),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wishlistIcon: {
    width: normalize(16),
    height: normalize(16),
    tintColor: '#D50000',
  },
})
