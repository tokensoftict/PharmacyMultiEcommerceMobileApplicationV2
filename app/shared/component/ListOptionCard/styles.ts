import { StyleSheet, ViewStyle } from "react-native";
import { palette, semantic } from "../../constants/colors";
import { FONT } from "../../constants/fonts";
import { theme } from "../../theme";

const defaultContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing.sm,
  borderWidth: 1,
  backgroundColor: 'white',
  borderRadius: theme.borderRadius.sm,
  marginVertical: theme.spacing.xs / 2,
};

export const _styles = (isDarkMode: boolean, active: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.xs,
    borderWidth: 1.5,
    borderColor: active ? semantic.alert.danger.d500 : (isDarkMode ? semantic.fill.f04 : '#F1F5F9'),
    ...theme.shadows.sm,
  },
  containerIcon: {
    backgroundColor: isDarkMode ? semantic.fill.f03 : '#F8FAFC',
    borderRadius: theme.borderRadius.sm,
    width: theme.MIN_TOUCH_TARGET, // 44dp
    height: theme.MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  icon: {
    width: theme.spacing.md,
    height: theme.spacing.md,
    tintColor: active ? semantic.alert.danger.d500 : (isDarkMode ? '#94A3B8' : '#64748B'),
  },
  title: {
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
    marginBottom: 2,
  },
  address: {
    fontSize: theme.typography.xs,
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
  },
  containerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  price: {
    fontSize: theme.typography.sm,
    fontFamily: FONT.BOLD,
    color: semantic.alert.danger.d500,
  },
});
