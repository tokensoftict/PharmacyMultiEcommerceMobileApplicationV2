import { StyleSheet } from "react-native";
import { normalize } from "../../../shared/helpers";
import { palette } from "../../../shared/constants/colors";


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
    marginBottom: normalize(24)
  },
  titleImageContainer :{
    flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent : "space-between"
  },
  form: {
    marginBottom: normalize(193)
  },
  containerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: normalize(24)
  }
})
