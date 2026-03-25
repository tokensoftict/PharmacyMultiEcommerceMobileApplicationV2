import { StyleSheet } from "react-native";
import { normalize } from "../../../../../shared/helpers";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: normalize(10)
  },
  title: {
    fontSize: normalize(15),

    width: '70%'
  }
})
