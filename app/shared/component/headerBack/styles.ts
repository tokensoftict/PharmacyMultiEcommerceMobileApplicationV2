import { StyleSheet } from 'react-native'
import { normalize } from "../../helpers";
import { design } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: design.text1.background,
    alignItems: 'center',
    width: '100%',
    height: normalize(56),
    paddingHorizontal: normalize(15),
    marginBottom: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minWidth: normalize(40),
  },
  title: {
    fontSize: normalize(18),
    fontFamily: FONT.MEDIUM,
    color: design.text1.color,
    marginLeft: normalize(12),
    flex: 1,
  }
})
