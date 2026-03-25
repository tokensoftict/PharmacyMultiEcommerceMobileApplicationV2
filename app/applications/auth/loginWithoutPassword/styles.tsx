import { StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";
import { palette } from "@/shared/constants/colors.ts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: normalize(25),
    marginTop: normalize(32),
  },
  titleImageContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  },
  form: {
    marginTop: normalize(32)
  },
  formControl: {
    marginBottom: normalize(24)
  },
  containerRemember: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  containerCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRemember: {
    marginLeft: normalize(10)
  },
  forgot: {

  },
  containerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alreadyAccount: {
    fontSize: normalize(16)
  },
  link: {
    marginLeft: normalize(6),
    color: palette.main.p500,

    fontSize: normalize(16)
  }
})
