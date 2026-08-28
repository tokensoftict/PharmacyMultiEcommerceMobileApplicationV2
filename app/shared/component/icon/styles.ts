import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface Sizes {
    width?: number | undefined;
    height?: number | undefined;
    isDarkMode: boolean;
}
export const _styles = ({ width, height, isDarkMode }: Sizes) =>
    StyleSheet.create({
        icon: {
            width: width || theme.spacing.lg, // Default to theme standard (24dp)
            height: height || theme.spacing.lg,
            alignSelf: 'center',
            alignItems: 'center',
            // Removed hardcoded offsets to keep centering responsive
        },
    });
