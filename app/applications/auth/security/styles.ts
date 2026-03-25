import { StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";
import { labels, palette } from "@/shared/constants/colors";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: normalize(24),
  },
  containerEmail: {
    alignItems: 'center',
    marginTop: normalize(32),
    marginBottom: normalize(40)
  },
  textEmail: {
    color: palette.main.p500
  },
  formControl: {
    marginBottom: normalize(24),
  },
  titleImageContainer: {
    flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  form: {
    marginTop: normalize(32),
  },
  containerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: normalize(24)
  },
  addToCartButton: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(13),
    borderRadius: normalize(5),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: labels.type4.background
  },
  buttonText: {
    color: labels.type4.textColor,

    fontSize: normalize(14),
    flex: 1,
    textAlign: 'center',
  }
})
