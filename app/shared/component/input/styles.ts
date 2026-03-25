import { StyleSheet } from 'react-native';
import { normalize } from '../../helpers';
import { semantic } from '../../constants/colors';

export const _styles = (isFocus: boolean, isDarkMode: boolean, multiline: boolean) =>

    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: normalize(8),
            backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
            paddingHorizontal: normalize(12),
            paddingVertical: normalize(12),
            marginTop: normalize(8),
        },
        input: {
            flex: 1,
            padding: normalize(5),
            color: isDarkMode ? semantic.text.white : semantic.text.black,
            fontSize: normalize(13),
            height: multiline ? normalize(150) : 'auto',
            textAlignVertical: multiline ? 'top' : 'center',
        },
        label: {
            fontSize: normalize(16),

            color: semantic.text.grey
        }
    });
