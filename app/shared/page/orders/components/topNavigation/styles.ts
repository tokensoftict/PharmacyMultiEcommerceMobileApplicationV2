import { StyleSheet, ViewStyle } from "react-native";
import { palette, semantic } from "@/shared/constants/colors";
import { normalize } from "@/shared/helpers";

const tabDefault: ViewStyle = {

}
export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: normalize(5),
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
    flex: 1,
  },
  tab: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(6),
    flex: 1,
  },
  tabActive: {
    flex: 1,
    backgroundColor: palette.main.p500,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(6),
    borderRadius: normalize(5)
  },
  text: {
    fontSize: normalize(10),
    color: semantic.text.grey,
    textAlign: 'center'
  },
  textActive: {
    fontSize: normalize(10),
    color: semantic.text.white,
    textAlign: 'center',

  }
})
