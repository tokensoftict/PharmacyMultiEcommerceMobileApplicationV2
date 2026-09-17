import {Platform, StyleSheet} from 'react-native';
import { palette } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts.ts";
import { theme } from "@/shared/theme";
import { normalize } from "@/shared/helpers";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        width: '100%',
    },
    scrollContent: {
        width: '100%',
        alignSelf: 'stretch',
    },

    // ── Profile Card ──────────────────────────────────────────────────────────
    profileCardContainer: {
        marginHorizontal: theme.spacing.md,
        marginTop: theme.spacing.xs,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.lg,
        backgroundColor: 'black',
    },
    profileCardGradient: {
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: Platform.OS === 'ios' ? undefined : theme.spacing.md,
        paddingVertical: Platform.OS === 'ios' ? undefined : theme.spacing.md,
        overflow: 'hidden',
        width: '100%',
    },

    iosFixed : {
        paddingHorizontal: Platform.OS === 'ios' ? theme.spacing.md : undefined,
        paddingVertical:  Platform.OS === 'ios' ? theme.spacing.md : undefined,
    },

    profileMain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    imageContainer: {
        position: 'relative',
    },
    avatar: {
        width: normalize(68),
        height: normalize(68),
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2.5,
        borderColor: 'rgba(255,255,255,0.5)',
        backgroundColor: '#FFFFFF',
    },
    editBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#D50000',
        width: 26,
        height: 26,
        borderRadius: theme.borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        ...theme.shadows.sm,
    },
    infoContent: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    userName: {
        fontSize: theme.typography.xl,
        color: '#1A1D1E',
        fontFamily: FONT.BOLD,
    },
    userPhone: {
        fontSize: theme.typography.xs,
        color: '#6A6A6A',
        fontFamily: FONT.NORMAL,
        marginTop: 2,
    },
    groupBadge: {
        marginTop: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs / 2,
        borderRadius: theme.borderRadius.xs,
        alignSelf: 'flex-start',
    },
    groupText: {
        fontSize: theme.typography.xs,
        fontFamily: FONT.BOLD,
    },

    // ── Loyalty Progress ──────────────────────────────────────────────────────
    loyaltyContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.15)',
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.xs,
        alignSelf: 'stretch',
    },
    loyaltyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    loyaltyTitle: {
        fontSize: theme.typography.sm,
        color: '#1A1D1E',
        fontFamily: FONT.BOLD,
        flex: 1,
        marginRight: theme.spacing.xs,
    },
    pointsText: {
        fontSize: theme.typography.sm,
        color: '#D50000',
        fontFamily: FONT.BOLD,
        textAlign: 'right',
        flexShrink: 0,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#D50000',
        borderRadius: theme.borderRadius.full,
    },
    loyaltyFooter: {
        marginTop: theme.spacing.xs / 2,
        fontSize: theme.typography.xs,
        color: '#9A9A9A',
        fontFamily: FONT.NORMAL,
        lineHeight: theme.typography.xs * 1.8,
    },

    // ── Quick Actions (horizontal pill scroll) ────────────────────────────────
    quickScrollWrapper: {
        marginTop: theme.spacing.md,
        width: '100%',
        alignSelf: 'stretch',
    },
    quickScroll: {
        width: '100%',
    },
    quickScrollContent: {
        paddingHorizontal: theme.spacing.md,
    },
    quickPill: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: theme.borderRadius.xl,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        minWidth: normalize(88),
        marginRight: theme.spacing.sm,
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    quickIconWrap: {
        width: normalize(44),
        height: normalize(44),
        borderRadius: theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    quickLabel: {
        fontSize: normalize(12),
        fontFamily: FONT.BOLD,
        color: '#1E293B',
        textAlign: 'center',
    },
    quickSub: {
        fontSize: normalize(10),
        fontFamily: FONT.NORMAL,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: normalize(2),
    },

    // ── Referral Banner Card (Redesigned Stacked Layout) ──────────────────────
    referralWrapper: {
        marginHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
        alignSelf: 'stretch',
    },
    referralCard: {
        width: '100%',
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    referralGradient: {
        width: '100%',
        padding: Platform.OS === 'ios' ? undefined : theme.spacing.md,
    },

    forIosFixed : {
        width: '100%',
        padding: Platform.OS === 'ios' ? theme.spacing.md : undefined,
    },

    referralDecorCircle: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.035)',
        top: -40,
        right: -30,
    },
    referralHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    referralIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    referralTextContainer: {
        flex: 1,
        marginLeft: theme.spacing.sm,
        marginRight: theme.spacing.xs,
    },
    referralTitleText: {
        fontSize: normalize(14),
        fontFamily: FONT.BOLD,
        color: '#FFFFFF',
    },
    referralSubText: {
        fontSize: normalize(11),
        fontFamily: FONT.NORMAL,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    referralDetailsPill: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: theme.borderRadius.full,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        flexShrink: 0,
    },
    referralDetailsPillText: {
        fontSize: normalize(11),
        fontFamily: FONT.BOLD,
        color: '#FFFFFF',
    },
    referralCodeBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.xs + 4,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        borderStyle: 'dashed',
        marginBottom: theme.spacing.sm + 4,
    },
    referralCodeBoxCopied: {
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.12)',
    },
    referralCodeInfo: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    referralCodeLabel: {
        fontSize: normalize(9),
        fontFamily: FONT.BOLD,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 1.2,
        marginBottom: 2,
    },
    referralCodeVal: {
        fontSize: normalize(15),
        fontFamily: FONT.EXTRA_BOLD,
        color: '#FFFFFF',
        letterSpacing: 1.5,
    },
    copyChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.16)',
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.sm + 2,
        paddingVertical: 6,
        flexShrink: 0,
    },
    copyChipSuccess: {
        backgroundColor: '#22C55E',
    },
    copyChipText: {
        fontSize: normalize(11),
        fontFamily: FONT.BOLD,
        color: '#FFFFFF',
        marginLeft: 4,
    },
    referralShareBtn: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.main.p500,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.sm + 4,
        paddingHorizontal: theme.spacing.md,
        ...theme.shadows.sm,
    },
    referralShareBtnText: {
        fontSize: normalize(13),
        fontFamily: FONT.BOLD,
        color: '#FFFFFF',
        marginLeft: 6,
    },

    // ── Menu Section ──────────────────────────────────────────────────────────
    sectionTitle: {
        fontSize: normalize(11),
        color: '#94A3B8',
        fontFamily: FONT.BOLD,
        textTransform: 'uppercase',
        letterSpacing: normalize(1.2),
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xs / 2,
        paddingHorizontal: theme.spacing.xs,
    },
    menuList: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.xxl * 2,
        width: '100%',
        alignSelf: 'stretch',
    },
});
