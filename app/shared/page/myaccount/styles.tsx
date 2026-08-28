import { StyleSheet, Dimensions, Platform } from 'react-native';
import { semantic, palette } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts.ts";
import { theme } from "@/shared/theme";
import { normalize } from "@/shared/helpers";

/**
 * MyAccount Screen Styles
 */

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    // ── Profile Card ──────────────────────────────────────────────────────────
    profileCardContainer: {
        marginHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderRadius: theme.borderRadius.xl,
        ...theme.shadows.lg,
        backgroundColor: 'transparent',
    },
    profileCardGradient: {
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.md,
        overflow: 'hidden',
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
        width: 68,
        height: 68,
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
    },
    pointsText: {
        fontSize: theme.typography.sm,
        color: '#D50000',
        fontFamily: FONT.BOLD,
        textAlign: 'right',
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
    quickScroll: {
        marginTop: theme.spacing.md,
    },
    quickScrollContent: {
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    quickPill: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: theme.borderRadius.xl,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        minWidth: normalize(88),
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    quickIconWrap: {
        width: 44,
        height: 44,
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
        marginTop: 2,
    },

    // ── Referral Banner Card ──────────────────────────────────────────────────
    referralWrapper: {
        marginHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    referralCard: {
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    referralGradient: {
        padding: theme.spacing.md,
        overflow: 'hidden',
    },
    referralDecorCircle: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: -50,
        right: -40,
    },
    referralTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    referralIconBg: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    referralTitle: {
        fontSize: normalize(15),
        fontFamily: FONT.BOLD,
        color: '#FFFFFF',
    },
    referralSub: {
        fontSize: normalize(11),
        fontFamily: FONT.NORMAL,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
        flexWrap: 'wrap',
    },
    referralDetailBtn: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    referralDetailBtnText: {
        fontSize: normalize(11),
        fontFamily: FONT.BOLD,
        color: '#FFFFFF',
    },
    referralCodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    referralCodeBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
    },
    referralCodeText: {
        fontSize: normalize(16),
        fontFamily: FONT.EXTRA_BOLD,
        color: '#FFFFFF',
        letterSpacing: 3,
        textAlign: 'center',
    },
    referralActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: '#93C5FD',
    },
    referralActionBtnCopied: {
        backgroundColor: '#22C55E',
        borderColor: '#22C55E',
    },
    referralShareBtn: {
        backgroundColor: palette.main.p500,
        borderColor: palette.main.p500,
    },
    referralActionText: {
        fontSize: normalize(11),
        fontFamily: FONT.BOLD,
        color: '#93C5FD',
    },

    // ── Menu Section ──────────────────────────────────────────────────────────
    sectionTitle: {
        fontSize: normalize(11),
        color: '#94A3B8',
        fontFamily: FONT.BOLD,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xs / 2,
        paddingHorizontal: theme.spacing.xs,
    },
    menuList: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.xxl * 2,
    },
});
