import React, { useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { _styles } from './styles';
import Typography from '../../typography';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { palette } from '../../../constants/colors';
import useDarkMode from '../../../hooks/useDarkMode';

interface ButtonOutlineProps {
    /** Disables interaction and greys out the button */
    disabled?: boolean;
    /** Optional icon rendered to the left of the label */
    leftIcon?: React.ReactNode;
    /** Optional icon rendered to the right of the label */
    rightIcon?: React.ReactNode;
    /** Button label */
    title?: string;
    /** Press handler */
    onPress?: (event: GestureResponderEvent) => void;
    /** Shows an ActivityIndicator in place of content */
    loading?: boolean;
    /** Compact variant — smaller padding and font */
    sm?: boolean;
    /** Additional container style overrides */
    style?: ViewStyle;
}

/**
 * ButtonOutline
 * ─────────────────────────────────────────────────────────────────────────────
 * A branded outlined button that matches the PSGDC design system.
 *
 * Features:
 *   - Dark / light mode aware border and text colour
 *   - Animated press-in scale feedback (subtle 0.97 shrink)
 *   - sm prop for compact contexts
 *   - rightIcon support for common patterns like "Continue →"
 *   - Disabled state with appropriate visual treatment
 */
export default function ButtonOutline({
    disabled,
    leftIcon,
    rightIcon,
    title = 'Done',
    onPress,
    loading,
    sm,
    style,
}: ButtonOutlineProps) {
    const { isDarkMode } = useDarkMode();
    const styles = _styles(disabled, isDarkMode, sm);

    // Animated press feedback
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    return (
        <Animated.View style={[{ width: '100%', transform: [{ scale: scaleAnim }] }, style]}>
            <TouchableOpacity
                disabled={disabled || loading}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.container}
                activeOpacity={0.75}
            >
                {loading ? (
                    <ActivityIndicator color={palette.main.p300} size="small" />
                ) : (
                    <>
                        {leftIcon && leftIcon}
                        <Typography style={styles.text}>{title}</Typography>
                        {rightIcon && rightIcon}
                    </>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}
