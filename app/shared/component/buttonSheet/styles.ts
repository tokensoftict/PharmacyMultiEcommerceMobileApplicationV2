import { Dimensions, StyleSheet } from 'react-native';
import { palette, semantic } from "../../constants/colors.ts";
import { theme } from "../../theme";

const modal = (isDarkMode: boolean, height: number) => {
  const objectModal = {
    backgroundColor: isDarkMode ? semantic.background.red.d500 : semantic.background.white.w500,
    borderTopRightRadius: theme.borderRadius.md,
    borderTopLeftRadius: theme.borderRadius.md,
    ...theme.shadows.md,
    width: '100%',
  };
  if (height) {
    // @ts-ignore
    objectModal.height = height;
  }
  return objectModal;
};

export const _styles = (isDarkMode: boolean, height: any) => {
  const screenHeight = Dimensions.get('window').height;

  return StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'relative',
    },
    modalOverlay: {
      backgroundColor: 'black',
      opacity: 0.5,
      height: screenHeight,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
    },
    // @ts-ignore
    modalView: {
      ...modal(isDarkMode, height),
      maxHeight: screenHeight * 0.85, // Safety height constraint below statusbar
    },
  });
};
