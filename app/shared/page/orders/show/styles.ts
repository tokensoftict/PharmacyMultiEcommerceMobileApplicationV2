import { StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";
import {semantic} from "@/shared/constants/colors.ts";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(10),
    backgroundColor : semantic.background.white.w101
  }
})
