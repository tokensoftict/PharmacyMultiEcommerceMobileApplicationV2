import { StyleSheet, ViewStyle } from "react-native";
import { palette, semantic } from "../../constants/colors";
import { theme } from "../../theme";

const defaultContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: theme.spacing.sm,
  paddingHorizontal: theme.spacing.md,
  borderWidth: 1,
  borderRadius: theme.borderRadius.sm,
  marginVertical: theme.spacing.xs / 2,
};

export const _styles = (isDarkMode: boolean, active: boolean) => StyleSheet.create({
  container: {
    ...defaultContainer,
    borderColor: active ? palette.main.p500 : isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
  },
  containerActive: {
    ...defaultContainer,
    borderColor: palette.main.p400,
  },
  containerIcon: {
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
    borderRadius: theme.borderRadius.sm,
    width: theme.MIN_TOUCH_TARGET + 8,
    height: theme.MIN_TOUCH_TARGET + 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  icon: {
    width: theme.spacing.lg,
    height: theme.spacing.lg,
    tintColor: isDarkMode ? semantic.background.white.w500 : semantic.text.grey,
  },
  title: {
    fontSize: theme.typography.sm,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
  },
  address: {
    fontSize: theme.typography.xs,
    color: semantic.text.grey,
  },
  containerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    marginRight: theme.spacing.sm,
    fontSize: theme.typography.sm,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
  },
});
