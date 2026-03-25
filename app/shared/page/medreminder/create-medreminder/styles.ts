import { StyleSheet, Dimensions, Platform } from 'react-native';
import { normalize } from "@/shared/helpers";
import { palette } from "@/shared/constants/colors.ts";

export const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: normalize(10),
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        opacity: 0.5,
    },
    circle1: {
        width: width * 1.2,
        height: width * 1.2,
        top: -width * 0.4,
        right: -width * 0.5,
        backgroundColor: '#BFDBFE',
    },
    circle2: {
        width: width * 0.8,
        height: width * 0.8,
        bottom: -width * 0.1,
        left: -width * 0.3,
        backgroundColor: '#DDD6FE',
    },
    progressBarWrapper: {
        paddingHorizontal: normalize(24),
        marginBottom: normalize(20),
    },
    progressBarContainer: {
        height: normalize(6),
        backgroundColor: '#E2E8F0',
        borderRadius: normalize(3),
        overflow: 'hidden',
    },
    progressBarActive: {
        height: '100%',
        backgroundColor: palette.main.p500,
        borderRadius: normalize(3),
    },
    progressText: {
        fontSize: normalize(12),
        color: '#64748B',
        marginTop: normalize(8),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        textTransform: 'uppercase',
    },
    slider: {
        flexDirection: 'row',
    },
    slide: {
        width,
        paddingHorizontal: normalize(20),
        paddingBottom: normalize(20),
        flex: 1,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(24),
        padding: normalize(24),
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    stepHeader: {
        marginBottom: normalize(20),
    },
    stepTitle: {
        fontSize: normalize(22),
        color: '#1E293B',
        marginBottom: normalize(4),
    },
    stepDescription: {
        fontSize: normalize(14),
        color: '#64748B',
        lineHeight: normalize(20),
    },
    scrollArea: {
        flex: 1,
    },
    label: {
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        color: '#475569',
        marginBottom: normalize(8),
        textTransform: 'uppercase',
    },
    fieldWrapper: {
        marginBottom: normalize(20),
    },
    tagGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: normalize(10),
    },
    tag: {
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(18),
        borderRadius: normalize(12),
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    tagSelected: {
        backgroundColor: palette.main.p500,
        borderColor: palette.main.p500,
    },
    tagText: {
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '600' : undefined,
        color: '#475569',
    },
    tagTextSelected: {
        color: '#FFFFFF',
    },
    browseButton: {
        alignSelf: 'flex-end',
        marginTop: normalize(6),
    },
    browseText: {
        fontSize: normalize(13),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        color: palette.main.p500,
    },
    scheduleRow: {
        marginBottom: normalize(16),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingBottom: normalize(12),
    },
    datePicker: {
        width: '100%',
    },
    errorText: {
        fontSize: normalize(12),
        color: '#EF4444',
        marginTop: normalize(4),
        fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    },
    nav: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: normalize(24),
        paddingTop: normalize(20),
        paddingBottom: Platform.OS === 'ios' ? normalize(90) : normalize(70),
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    navButton: {
        flex: 1,
        height: normalize(48), // Reduced from 56
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalize(16),
    },
    prevButton: {
        marginRight: normalize(12),
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    mainNavButton: {
        flex: 2,
        height: normalize(48), // Reduced from 56
        borderRadius: normalize(16),
        overflow: 'hidden',
        elevation: 4,
        shadowColor: palette.main.p500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    gradientNavButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        letterSpacing: 1,
    },
    mainButtonText: {
        fontSize: normalize(15),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    sheetContent: {
        padding: normalize(24),
    },
    sheetTitle: {
        fontSize: normalize(20),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        color: '#1E293B',
        marginBottom: normalize(20),
        textAlign: 'center',
    },
    sheetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(16),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    sheetItemText: {
        fontSize: normalize(16),
        fontWeight: Platform.OS === 'ios' ? '600' : undefined,
        color: '#334155',
    },
});
