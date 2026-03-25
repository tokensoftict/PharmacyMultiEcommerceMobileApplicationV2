import { StyleSheet } from "react-native";
import { normalize } from "../../helpers";
import { design, labels, semantic } from "../../constants/colors.ts";
import Environment from "@/shared/utils/Environment.tsx";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: '#F7D9D9',
    paddingTop: normalize(80),
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(10),
  },
  avatar: {
    width: normalize(50),
    height: normalize(50),
    marginRight: normalize(12),
  },
  header: {
  },
  headerText: {
    color: labels.type4.textColor,
    fontSize: normalize(15),

  },
  subHeaderText: {
    fontSize: normalize(11),
  },
  addToCartButton: {
    height: normalize(40),
    backgroundColor: 'red',
    marginTop: normalize(50),
    padding: normalize(10),
    borderRadius: normalize(5),
    marginRight: normalize(10),
  }
})
