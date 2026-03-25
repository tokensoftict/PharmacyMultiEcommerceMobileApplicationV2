import { StyleSheet } from "react-native";
import { normalize } from "../../helpers";
import { design, palette, semantic } from "../../constants/colors";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  viewOrderButton: {
    backgroundColor: semantic.alert.danger.d500,
    paddingHorizontal: normalize(10),
    borderRadius: 5,
    paddingVertical: normalize(8),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: normalize(10),

  },
  priceTotalContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: normalize(6),
    marginTop: normalize(6),
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: semantic.text.white,
    padding: normalize(10),
    elevation: 50,
    shadowColor: semantic.fill.f04,
    shadowOffset: { width: normalize(4), height: normalize(4) },
    shadowOpacity: 2,
    shadowRadius: 1,
    // flex: 1,
  },
  containerImage: {
    width: normalize(80),
    height: normalize(90),
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
    borderRadius: normalize(16)
  },
  image: {
    width: '100%',
    height: normalize(90)
  },
  name: {
    fontSize: normalize(9),

    color: isDarkMode ? semantic.text.white : semantic.text.black,
  },
  category: {
    color: isDarkMode ? semantic.text.white : design.text1.color,
    backgroundColor: isDarkMode ? semantic.text.black : design.text1.background,
    padding: normalize(1),
    paddingLeft: normalize(3),
    borderRadius: normalize(10),
    width: '30%',
    fontSize: normalize(8),
    marginVertical: normalize(2)
  },
  price: {
    fontSize: normalize(9),
    color: isDarkMode ? semantic.text.white : semantic.text.black,

    marginTop: normalize(2)
  },
  special: {
    fontSize: normalize(9),
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

    marginBottom: normalize(6),
  },
  totalPrice: {
    color: palette.main.p500,
    fontSize: normalize(12),

    marginLeft: normalize(25)
  },
  containerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: normalize(18)
  },
  actions: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  actionsHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: semantic.text.white,
    padding: normalize(10),
    paddingTop: normalize(0),
    paddingBottom: normalize(0),
    borderBottomColor: semantic.background.white.w111,
    borderStyle: 'solid',
    borderBottomWidth: normalize(1),
  },
  actionsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: semantic.text.white,
    padding: normalize(10),
    paddingTop: normalize(0),
    paddingBottom: normalize(0),
    borderBottomColor: semantic.background.white.w111,
    borderStyle: 'solid',
    borderBottomWidth: normalize(1),
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

  }
})
