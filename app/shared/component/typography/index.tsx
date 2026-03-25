import React from 'react';
import {Text} from 'react-native';
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {TextStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import {_styles} from './styles';
import useDarkMode from "../../hooks/useDarkMode.tsx";

interface TypographyProps {
  allowFontScaling?: boolean | undefined;
  children?: string | string[] | React.ReactNode;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip' | undefined;
  id?: string | undefined;
  lineBreakMode?: 'head' | 'middle' | 'tail' | 'clip' | undefined;
  numberOfLines?: number | undefined;
  /** This function is called on press.
   * Text intrinsically supports press handling with a default highlight state
   * (which can be disabled with suppressHighlighting). **/
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  onPressIn?: ((event: GestureResponderEvent) => void) | undefined;
  onPressOut?: ((event: GestureResponderEvent) => void) | undefined;

  /**
   * This function is called on long press.
   * e.g., `onLongPress={this.increaseSize}>``
   */
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
  style?: StyleProp<TextStyle> | undefined;
}
export default function Typography({
  children,
  style,
  numberOfLines,
  onPress,
}: TypographyProps) {
  const {isDarkMode} = useDarkMode()
  const styles = _styles(isDarkMode)
  return (
      <Text onPress={onPress} ellipsizeMode='tail' numberOfLines={numberOfLines}  style={[styles.text, style]}>
        {children}
      </Text>
  );
}
