import { StyleSheet } from "react-native";
import { normalize } from "../../../shared/helpers";
import {palette} from "../../../shared/constants/colors.ts";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: normalize(24),
    height : '100%',
    width : '100%'
  },
  containerTitle: {
    marginVertical: normalize(32)
  },
  formControl: {
    marginBottom: normalize(24)
  },
  titleImageContainer :{
    flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent : "space-between",
    marginVertical: normalize(32)
  },
  textEmail: {
    color: palette.main.p500
  },
  containerEmail: {
    alignItems: 'center',
    marginTop: normalize(32),
    marginBottom: normalize(91)
  },
  description: {
    fontSize: normalize(18)
  },
  form: {
    marginTop: normalize(40),
    marginBottom: normalize(24)
  }
})
