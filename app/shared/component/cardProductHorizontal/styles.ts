import { StyleSheet } from "react-native";
import { normalize } from "../../helpers";
import { design, palette, semantic } from "../../constants/colors";
import { FONT } from "@/shared/constants/fonts.ts";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    // flex: 1,
  },
  containerImage: {
    width: normalize(120),
    height: normalize(170),
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
    borderRadius: normalize(16)
  },
  image: {
    width: '100%',
    height: normalize(170)
  },
  name: {
    fontSize: normalize(18),

    color: isDarkMode ? semantic.text.white : semantic.text.black,
    maxHeight: normalize(50),
    height: normalize(50),
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
    fontSize: normalize(16),
    color: isDarkMode ? semantic.text.white : semantic.text.black,

    marginBottom: normalize(4),
  },
  special: {
    fontSize: normalize(12),
    color: semantic.alert.danger.d500,
    textDecorationLine: "line-through",
    marginTop: normalize(5),
  },
  specialHolder: {
    flexDirection: 'row'
  },
  doorStep: {
    fontSize: normalize(10),
    color: isDarkMode ? semantic.text.white : palette.main.p500,

  },
  totalPrice: {
    marginTop: normalize(10),
    color: palette.main.p500,
    fontSize: normalize(20),

  },
  containerInfo: {
    flex: 1,
    marginLeft: normalize(18)
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  containerCant: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cant: {
    backgroundColor: palette.main.p500,
    width: normalize(24),
    height: normalize(24),
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cantText: {
    color: semantic.text.white,
    fontSize: normalize(16),
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
    borderRadius: normalize(16),
  },
  outOfStockBadge: {
    backgroundColor: '#D50000',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
    borderRadius: normalize(6),
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
