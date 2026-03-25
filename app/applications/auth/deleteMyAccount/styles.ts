import { StyleSheet } from "react-native";
import { normalize } from "../../../shared/helpers";
import { labels, palette, semantic } from "../../../shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts.ts";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: normalize(24),
    justifyContent: 'center',
  },
  logoWrapper: {
    marginBottom: normalize(20),
    alignItems: 'center',
  },
  formControl: {
    marginTop: normalize(24)
  },
  logo: {
    width: normalize(150),
    height: normalize(150),
    alignSelf: 'center',
  },
  title: {
    fontSize: normalize(28),

    marginBottom: normalize(20),
    color: '#D9534F',
    textAlign: 'center',
    fontFamily: FONT.NORMAL,
  },
  warning: {
    fontSize: normalize(16),
    color: '#333',
    marginBottom: normalize(24),
    textAlign: 'center',
    fontFamily: FONT.NORMAL,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(32),
  },
  label: {
    marginLeft: normalize(10),
    fontSize: normalize(16),
    color: '#444',
  },
  button: {
    backgroundColor: '#D9534F',
    paddingVertical: normalize(14),
    borderRadius: normalize(10),
    alignItems: 'center',
    elevation: normalize(2),
    marginBottom: normalize(18),
  },
  button2: {
    backgroundColor: 'green',
    paddingVertical: normalize(14),
    borderRadius: normalize(10),
    alignItems: 'center',
    elevation: normalize(2),
    marginBottom: normalize(18),
  }
  ,
  buttonText: {
    color: '#fff',
    fontSize: normalize(18),

  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: labels.type4.background,
    padding: normalize(15),
    borderRadius: normalize(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(5),
  },
  buttonText2: {
    color: labels.type4.textColor,

    fontSize: normalize(14),
    flex: 1,
    textAlign: 'center',
  }
})
