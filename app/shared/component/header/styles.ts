import { StyleSheet } from "react-native";
import { normalize } from "../../helpers";
import { semantic } from "../../constants/colors.ts";
import Environment from "@/shared/utils/Environment.tsx";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingHorizontal: normalize(Environment.isLogin() ? 24 : 10)
  },
  avatar: {
    width: normalize(40),
    height: normalize(40),
    marginRight: normalize(12)
  },
  avatarlogo: {
    width: normalize(60),
    height: normalize(60),
    marginRight: normalize(5),
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameUser: {
    fontSize: normalize(16),

    marginBottom: normalize(6)
  },
  iconLocation: {
    width: normalize(16),
    height: normalize(16)
  },
  location: {
    color: semantic.text.grey,

  },
  iconSize: {
    width: normalize(30),
    height: normalize(30),
  },
  widthSpace: {
    width: normalize(15)
  }
})
