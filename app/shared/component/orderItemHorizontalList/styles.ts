import { StyleSheet } from "react-native";
import { design, palette, semantic } from "../../constants/colors";
import { theme } from "../../theme";

/**
 * OrderItemHorizontalList Styles (Latest Design Refactor)
 *
 * Refactored using the centralized theme spacing, shadows, border-radius,
 * and responsive typography system to align cleanly.
 */
export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  viewOrderButton: {
    backgroundColor: semantic.alert.danger.d500,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.xs / 2,
    paddingVertical: theme.spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 28, // Compact design spec
  },
  buttonText: {
    color: "white",
    fontSize: theme.typography.xs - 1,
  },
  priceTotalContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: isDarkMode ? semantic.fill.f04 : '#F1F5F9',
    ...theme.shadows.sm,
  },
  containerImage: {
    width: 70, // Responsive aspect bounds
    height: 80,
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  name: {
    fontSize: theme.typography.xs,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
  },
  category: {
    color: isDarkMode ? semantic.text.white : design.text1.color,
    backgroundColor: isDarkMode ? semantic.text.black : design.text1.background,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs / 2,
    alignSelf: 'flex-start',
    fontSize: theme.typography.xs - 2,
    marginVertical: theme.spacing.xs / 2,
  },
  price: {
    fontSize: theme.typography.xs,
    color: isDarkMode ? semantic.text.white : semantic.text.black,
    marginTop: 2,
  },
  special: {
    fontSize: theme.typography.xs,
    color: semantic.alert.danger.d500,
    textDecorationLine: "line-through",
    marginTop: theme.spacing.xs / 2,
  },
  specialHolder: {
    flexDirection: 'row'
  },
  doorStep: {
    fontSize: theme.typography.xs - 2,
    color: isDarkMode ? semantic.text.white : palette.main.p500,
    marginBottom: theme.spacing.xs / 2,
  },
  totalPrice: {
    color: palette.main.p500,
    fontSize: theme.typography.xs,
    marginLeft: theme.spacing.md,
  },
  containerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: theme.spacing.md,
  },
  actions: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  actionsHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: theme.borderRadius.sm,
    borderTopLeftRadius: theme.borderRadius.sm,
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    padding: theme.spacing.sm,
    borderBottomColor: semantic.background.white.w111,
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  actionsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomRightRadius: theme.borderRadius.sm,
    borderBottomLeftRadius: theme.borderRadius.sm,
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFFFFF',
    padding: theme.spacing.sm,
    borderBottomColor: semantic.background.white.w111,
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  containerCant: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cant: {
    backgroundColor: palette.main.p500,
    width: theme.spacing.md,
    height: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cantText: {
    color: semantic.text.white,
    fontSize: theme.typography.sm,
  }
});
