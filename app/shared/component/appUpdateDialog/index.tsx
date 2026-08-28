import React, { useRef } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    Linking,
    Platform,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Typography from '@/shared/component/typography';
import { semantic, palette } from '@/shared/constants/colors';
import { FONT } from '@/shared/constants/fonts';
import { theme } from '@/shared/theme';
import useDarkMode from '@/shared/hooks/useDarkMode';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface AppUpdateInfo {
    has_update: boolean;
    force_update: boolean;
    latest_version: string;
    latest_version_code: number;
    current_version: string;
    current_version_code: number;
    store_url: string;
    update_message: string;
}

interface AppUpdateDialogProps {
    visible: boolean;
    updateInfo: AppUpdateInfo | null;
    onDismiss: () => void;
}

/**
 * AppUpdateDialog
 * ─────────────────────────────────────────────────────────────────────────────
 * A polished modal dialog that informs the user when a new version of the app
 * is available. For force updates, the dismiss button is hidden.
 */
export default function AppUpdateDialog({ visible, updateInfo, onDismiss }: AppUpdateDialogProps) {
    const { isDarkMode } = useDarkMode();
    const insets = useSafeAreaInsets();

    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: true,
                }),
            ]).start();

            // Pulse animation on the update button
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.04,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.85,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
            pulseAnim.stopAnimation();
        }
    }, [visible]);

    const handleUpdate = () => {
        let targetUrl = updateInfo?.store_url?.trim() || '';

        // Fallbacks
        const iosFallback = 'https://apps.apple.com/ng/app/ps-gdc/id6741708076';
        const androidFallback = 'https://play.google.com/store/apps/details?id=com.tokensoftict.psgdc&hl=en_GB';
        const fallbackUrl = Platform.OS === 'ios' ? iosFallback : androidFallback;

        if (!targetUrl) {
            targetUrl = fallbackUrl;
        } else {
            // Auto prepend https if scheme is missing
            if (!/^https?:\/\//i.test(targetUrl) && !/^(itms-apps|market):\/\//i.test(targetUrl)) {
                targetUrl = 'https://' + targetUrl;
            }
        }

        console.log('[AppUpdate] Opening update URL:', targetUrl);

        // Directly open the URL. If it fails (e.g. custom store link in Simulator),
        // catch the error and redirect to the web app store link.
        Linking.openURL(targetUrl).catch((err) => {
            console.warn('[AppUpdate] Failed to open target URL, using web fallback:', err);
            Linking.openURL(fallbackUrl).catch((fallbackErr) => {
                console.error('[AppUpdate] Fallback URL failed:', fallbackErr);
            });
        });
    };

    if (!updateInfo?.has_update) return null;

    const isForce = updateInfo.force_update;
    const cardBg = isDarkMode ? semantic.fill.f02 : '#FFFFFF';
    const overlayBg = 'rgba(0,0,0,0.65)';

    return (
        <Modal
            transparent
            animationType="none"
            visible={visible}
            statusBarTranslucent
            onRequestClose={isForce ? undefined : onDismiss}
        >
            <View style={[styles.overlay, { backgroundColor: overlayBg, paddingBottom: insets.bottom }]}>
                <Animated.View
                    style={[
                        styles.card,
                        {
                            backgroundColor: cardBg,
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Top Decorative Banner */}
                    <View style={styles.topBanner}>
                        <View style={styles.iconCircleOuter}>
                            <View style={styles.iconCircleInner}>
                                <Typography style={styles.rocketIcon}>🚀</Typography>
                            </View>
                        </View>
                        {/* Badge */}
                        <View style={styles.badge}>
                            <Typography style={styles.badgeText}>NEW</Typography>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Typography style={[styles.title, { color: isDarkMode ? '#FFF' : '#1A1D1E' }]}>
                            Update Available!
                        </Typography>

                        <Typography style={[styles.subtitle, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>
                            {updateInfo.update_message}
                        </Typography>

                        {/* Version info pill */}
                        <View style={[styles.versionPillRow]}>
                            <View style={[styles.versionPill, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F1F5F9' }]}>
                                <Typography style={[styles.versionPillLabel, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>
                                    Current
                                </Typography>
                                <Typography style={[styles.versionPillValue, { color: isDarkMode ? '#FFF' : '#1A1D1E' }]}>
                                    v{updateInfo.current_version}
                                </Typography>
                            </View>

                            <View style={styles.arrowWrap}>
                                <Typography style={styles.arrowText}>›</Typography>
                            </View>

                            <View style={[styles.versionPill, styles.versionPillLatest]}>
                                <Typography style={[styles.versionPillLabel, { color: 'rgba(255,255,255,0.75)' }]}>
                                    Latest
                                </Typography>
                                <Typography style={[styles.versionPillValue, { color: '#FFF' }]}>
                                    v{updateInfo.latest_version}
                                </Typography>
                            </View>
                        </View>

                        {isForce && (
                            <View style={styles.forceNotice}>
                                <Typography style={styles.forceNoticeText}>
                                    ⚠️  This update is required to continue using the app.
                                </Typography>
                            </View>
                        )}
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Animated.View style={[styles.updateBtnWrapper, { transform: [{ scale: pulseAnim }] }]}>
                            <TouchableOpacity
                                style={styles.updateBtn}
                                onPress={handleUpdate}
                                activeOpacity={0.85}
                            >
                                <Typography style={styles.updateBtnText}>
                                    Update Now
                                </Typography>
                            </TouchableOpacity>
                        </Animated.View>

                        {!isForce && (
                            <TouchableOpacity
                                style={[styles.laterBtn, { borderColor: isDarkMode ? '#3A3A3C' : '#E2E8F0' }]}
                                onPress={onDismiss}
                                activeOpacity={0.7}
                            >
                                <Typography style={[styles.laterBtnText, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>
                                    Maybe Later
                                </Typography>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        width: '100%',
        maxWidth: 380,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 16,
    },
    // ── Top Decorative Banner ────────────────────────────────────────────────
    topBanner: {
        height: 130,
        backgroundColor: semantic.alert.danger.d500,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    iconCircleOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircleInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rocketIcon: {
        fontSize: 30,
    },
    badge: {
        position: 'absolute',
        top: 14,
        right: 18,
        backgroundColor: '#FF9500',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: FONT.BOLD,
        letterSpacing: 1,
    },
    // ── Content ─────────────────────────────────────────────────────────────
    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 8,
        gap: 12,
    },
    title: {
        fontSize: 22,
        fontFamily: FONT.BOLD,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: FONT.NORMAL,
        textAlign: 'center',
        lineHeight: 20,
    },
    // ── Version Pills ────────────────────────────────────────────────────────
    versionPillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 4,
    },
    versionPill: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: 'center',
        gap: 2,
    },
    versionPillLatest: {
        backgroundColor: semantic.alert.danger.d500,
    },
    versionPillLabel: {
        fontSize: 10,
        fontFamily: FONT.MEDIUM,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    versionPillValue: {
        fontSize: 16,
        fontFamily: FONT.BOLD,
    },
    arrowWrap: {
        width: 28,
        alignItems: 'center',
    },
    arrowText: {
        fontSize: 28,
        color: semantic.alert.danger.d500,
        fontFamily: FONT.BOLD,
        lineHeight: 30,
    },
    // ── Force notice ─────────────────────────────────────────────────────────
    forceNotice: {
        backgroundColor: 'rgba(214,66,66,0.10)',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderLeftWidth: 3,
        borderLeftColor: semantic.alert.danger.d500,
        marginTop: 4,
    },
    forceNoticeText: {
        fontSize: 12,
        fontFamily: FONT.MEDIUM,
        color: semantic.alert.danger.d500,
        lineHeight: 18,
    },
    // ── Actions ──────────────────────────────────────────────────────────────
    actions: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        gap: 10,
    },
    updateBtnWrapper: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    updateBtn: {
        backgroundColor: semantic.alert.danger.d500,
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: semantic.alert.danger.d500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    updateBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONT.BOLD,
        letterSpacing: 0.3,
    },
    laterBtn: {
        paddingVertical: 13,
        borderRadius: 14,
        alignItems: 'center',
        borderWidth: 1.5,
    },
    laterBtnText: {
        fontSize: 14,
        fontFamily: FONT.MEDIUM,
    },
});
