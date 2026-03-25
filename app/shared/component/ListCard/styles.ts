import { StyleSheet, ViewStyle } from "react-native";
import { palette, semantic } from "../../constants/colors";
import { normalize } from "../../helpers";

const defaultContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: normalize(5),
  borderWidth: 1,
  borderRadius: normalize(10),
  marginVertical: normalize(2)
}
export const _styles = (isDarkMode: boolean, active: boolean) => StyleSheet.create({
  container: {
    ...defaultContainer,
    borderColor: active ? palette.main.p500 : isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
  },
  containerActive: {
    ...defaultContainer,
    borderColor: palette.main.p400,
  },
  containerIcon: {
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
    borderRadius: normalize(16),
    width: normalize(64),
    height: normalize(64),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(12)
  },
  icon: {
    width: normalize(32),
    height: normalize(32),
    tintColor: isDarkMode ? semantic.background.white.w500 : semantic.text.grey
  },
  title: {
    fontSize: normalize(12),

  },
  address: {
    fontSize: normalize(10),
    color: semantic.text.grey
  },
  containerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {

    marginRight: normalize(12)
  }
})
