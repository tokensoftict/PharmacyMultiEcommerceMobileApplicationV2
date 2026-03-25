import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { palette, semantic } from "../../../../../shared/constants/colors.ts";
import { normalize } from "../../../../../shared/helpers";

const option: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: normalize(18),
  paddingHorizontal: normalize(20),
  paddingVertical: normalize(6),
  marginHorizontal: normalize(8)
}
const textOption: TextStyle = {
  fontSize: normalize(18),

  marginLeft: normalize(8)
}
export const styles = StyleSheet.create({
  container: {
    marginVertical: normalize(32)
  },
  option: {
    ...option,
    backgroundColor: semantic.fill.f04,
  },
  optionActive: {
    ...option,
    backgroundColor: palette.main.p500
  },
  text: {
    ...textOption
  },
  textActive: {
    ...textOption,
    color: semantic.text.white
  },
  icon: {
    tintColor: palette.main.p500
  },
  iconActive: {
    tintColor: semantic.text.white
  }
})
