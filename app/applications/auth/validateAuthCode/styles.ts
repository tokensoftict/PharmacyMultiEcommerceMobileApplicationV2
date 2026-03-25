import { StyleSheet } from "react-native";
import { normalize } from "../../../shared/helpers";
import { palette } from "../../../shared/constants/colors";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: normalize(32),
  },
  containerEmail: {
    alignItems: 'center',
    marginTop: normalize(32),
    marginBottom: normalize(91)
  },
  textEmail: {
    color: palette.main.p500
  },
  titleImageContainer :{
    flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent : "space-between"
  },
  form: {
    marginBottom: normalize(80)
  },
  containerBtns: {
    marginTop: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: normalize(24)
  }
})
