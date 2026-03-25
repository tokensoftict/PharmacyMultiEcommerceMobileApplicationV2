import { StyleSheet } from 'react-native'
import { normalize } from "../../helpers";
import { design, labels } from "@/shared/constants/colors.ts";

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: normalize(5),
    paddingBottom: normalize(5),
    paddingHorizontal: normalize(8),
    marginBottom: normalize(5),
  },
  title: {
    fontSize: normalize(14),

    marginLeft: normalize(10),
  }
})
